"""Create the PostgreSQL tables used by the menu and review API."""

import os

import psycopg2
from dotenv import load_dotenv


def create_schema(conn):
    with conn.cursor() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Menu_Items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                dining_hall TEXT NOT NULL,
                meal TEXT NOT NULL,
                station TEXT,
                avg_rating REAL DEFAULT 0,
                UNIQUE(name, dining_hall)
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Reviews (
                id SERIAL PRIMARY KEY,
                menu_item_id INTEGER NOT NULL REFERENCES Menu_Items(id) ON DELETE CASCADE,
                rating REAL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Daily_Menu (
                date DATE PRIMARY KEY,
                data TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_id ON Reviews(menu_item_id)
        """)
    conn.commit()


if __name__ == "__main__":
    load_dotenv(".env.prod")
    database_url = os.environ["DATABASE_URL"]
    connection = psycopg2.connect(database_url)
    try:
        create_schema(connection)
    finally:
        connection.close()
    print("Database schema is ready")
