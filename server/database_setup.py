import sqlite3

# connect to the database
conn = sqlite3.connect("server/dining_menu.db")
cursor = conn.cursor()

# menu items
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Menu_Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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

