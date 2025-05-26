import psycopg2
from psycopg2.extras import Json
# import sqlite3
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv(".env.prod")

# connect to supabase db
print("DATABASE_URL:", os.getenv("DATABASE_URL"))
# conn = sqlite3.connect("dining_menu.db")
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cursor = conn.cursor()

# menu items
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Menu_Items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        dining_hall TEXT NOT NULL,
        meal TEXT NOT NULL,
        station TEXT,
        avg_rating REAL DEFAULT 0,
        UNIQUE(name, dining_hall, meal)
    );
""")

# user reviews
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Reviews (
        id SERIAL PRIMARY KEY,
        menu_item_id INTEGER NOT NULL,
        rating REAL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES Menu_Items(id) ON DELETE CASCADE
    );
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Daily_Menu (
        date DATE PRIMARY KEY,
        data JSONB NOT NULL,
        last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
""")

cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_id ON Reviews(menu_item_id);
""")

# commit and close connection
conn.commit()
conn.close()

print("supabase setup all good")
