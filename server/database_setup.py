import psycopg2
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
        UNIQUE(name, dining_hall, meal)
    );
""")

# user reviews
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Reviews (
        id SERIAL PRIMARY KEY,
        menu_item_id INTEGER NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES Menu_Items(id) ON DELETE CASCADE
    );
""")

# commit and close connection
conn.commit()
conn.close()

print("supabase setup all good")
