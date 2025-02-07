import sqlite3

# Connect to SQLite
conn = sqlite3.connect("dining_menu.db")
cursor = conn.cursor()

# table for menu items
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Menu_Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dining_hall TEXT NOT NULL,
        meal TEXT NOT NULL,
        category TEXT
        UNIQUE(name, dining_hall, meal)
    );
""")

# table for reviews
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

# commit and close
conn.commit()
conn.close()

print("SQLite database and tables created successfully!")
