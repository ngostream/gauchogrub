"""Flask API for cached dining menus and food reviews."""

import datetime
import os
import re
from contextlib import contextmanager
from urllib.parse import unquote
from zoneinfo import ZoneInfo

from better_profanity import profanity
from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from psycopg2.pool import SimpleConnectionPool

load_dotenv(".env.prod")
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set!")

db_pool = SimpleConnectionPool(1, 10, dsn=DATABASE_URL)
profanity.load_censor_words()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://gauchogrub.vercel.app"])


@contextmanager
def database_connection():
    """Finish every transaction and return its connection, including on errors."""
    conn = db_pool.getconn()
    try:
        with conn:
            yield conn
    finally:
        db_pool.putconn(conn)


def is_inappropriate(text):
    substitutions = {
        "1": "i", "!": "i", "3": "e", "4": "a", "@": "a",
        "0": "o", "$": "s", "5": "s", "+": "t",
    }
    normalized = text.lower()
    for source, replacement in substitutions.items():
        normalized = normalized.replace(source, replacement)
    normalized = re.sub(r"[^a-z\s]", "", normalized)
    return profanity.contains_profanity(re.sub(r"\s+", "", normalized))


@app.route("/")
def menu():
    today = datetime.datetime.now(ZoneInfo("America/Los_Angeles")).date()
    with database_connection() as conn, conn.cursor() as cursor:
        cursor.execute("SELECT data FROM Daily_Menu WHERE date = %s", (today,))
        row = cursor.fetchone()
        if not row:
            cursor.execute(
                "SELECT data FROM Daily_Menu WHERE date < %s ORDER BY date DESC LIMIT 1",
                (today,),
            )
            row = cursor.fetchone()

    if row:
        return Response(row[0], mimetype="application/json")
    return jsonify({"error": "No data found"}), 404


@app.route("/<dining_hall>/<item_id>", methods=["POST", "GET"])
def submit(dining_hall, item_id):
    item_name = unquote(item_id).replace("__slash__", "/")
    with database_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "SELECT id FROM Menu_Items WHERE name = %s AND dining_hall = %s",
            (item_name, dining_hall),
        )
        menu_item = cursor.fetchone()
        if not menu_item:
            return jsonify({"error": "Menu item not found"}), 404

        menu_item_id = menu_item[0]
        if request.method == "POST":
            data = request.get_json(silent=True)
            if not isinstance(data, dict) or "rating" not in data or "review" not in data:
                return jsonify({"error": "Missing review data"}), 400
            if not isinstance(data["review"], str) or not data["review"].strip():
                return jsonify({"error": "Review must be non-empty text"}), 400

            review_text = data["review"].strip()
            rating = data["rating"]
            if len(review_text) > 300:
                return jsonify({"error": "Review too long (300 character limit)"}), 400
            if is_inappropriate(review_text):
                return jsonify({"error": "Review contains inappropriate language"}), 400
            if (
                isinstance(rating, bool)
                or not isinstance(rating, (float, int))
                or not (1 <= rating <= 5)
                or rating * 2 != int(rating * 2)
            ):
                return jsonify({"error": "Rating must be between 1 and 5 in half-star steps"}), 400

            cursor.execute(
                """SELECT 1 FROM Reviews
                   WHERE menu_item_id = %s AND comment = %s
                   AND created_at > NOW() - interval '10 seconds'""",
                (menu_item_id, review_text),
            )
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO Reviews (menu_item_id, rating, comment) VALUES (%s, %s, %s)",
                    (menu_item_id, rating, review_text),
                )
                cursor.execute(
                    """UPDATE Menu_Items SET avg_rating =
                       (SELECT AVG(rating) FROM Reviews WHERE menu_item_id = %s)
                       WHERE id = %s""",
                    (menu_item_id, menu_item_id),
                )

        cursor.execute(
            """SELECT rating, comment, created_at FROM Reviews
               WHERE menu_item_id = %s ORDER BY created_at DESC, id DESC""",
            (menu_item_id,),
        )
        reviews = [
            {"rating": row[0], "comment": row[1], "created_at": row[2]}
            for row in cursor.fetchall()
        ]
        cursor.execute("SELECT AVG(rating) FROM Reviews WHERE menu_item_id = %s", (menu_item_id,))
        average = cursor.fetchone()[0]

    return jsonify({"message": "received", "avg_rating": average, "reviews": reviews})


@app.route("/<dining_hall>/avg_ratings")
def get_avg_ratings(dining_hall):
    with database_connection() as conn, conn.cursor() as cursor:
        cursor.execute(
            "SELECT name, COALESCE(avg_rating, 0) FROM Menu_Items WHERE dining_hall = %s",
            (dining_hall,),
        )
        result = {row[0]: round(row[1], 2) for row in cursor.fetchall()}
    return jsonify(result)


@app.route("/health")
def health():
    return "OK", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
