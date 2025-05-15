<p align="center">
  <img src="assets/logo.png" alt="GauchoGrubz Logo" width="200"/>
</p>

<h1 align="center">GauchoGrubz</h1>

GauchoGrubz is a full-stack web application that allows UCSB students to view real-time dining hall menus and submit reviews for specific menu items. Built by Nathan Ngo and Alvin Lee as a collaborative project at UCSB to enhance student dining experiences by combining live data with crowd-sourced feedback.

## Features

- View current menus by dining hall (Carrillo, Portola, Ortega, etc.)
- Submit reviews and ratings for specific dishes
- View average ratings and user feedback per food item
- Real-time data pulled from UCSB Dining API

## Technologies Used

- **Backend**: Flask, SQLite, Requests, Python-dotenv
- **Frontend**: React, React-Router, React-Bootstrap, Axios, Vite
- **API**: UCSB Dining API
- **Deployment**: GitHub Actions (scheduled updates to the database)
- **Package Managers**: pip (Python), npm (Node.js)
- **DevOps**: GitHub Actions, .env files

## Database Schema

```
Menu_Items Table:
- id (Primary Key)
- name (Food Item)
- dining_hall (Dining Hall Name)
- meal (Breakfast, Brunch, Lunch, Dinner)
- station (Food Station)

Reviews Table:
- id (Primary Key)
- menu_item_id (Foreign Key -> Menu_Items.id)
- rating (Integer)
- comment (Text)
- created_at (Timestamp)
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Returns current menu data for all dining halls |
| POST | `/<dining_hall>/<item_name>` | Submits a review for a menu item |
| GET | `/<dining_hall>/<item_name>` | Returns all reviews + avg rating for an item |

## Deployment & Automation

- `update_database.py` pulls new dining hall data from UCSB API every 24 hours and inserts it into the SQLite database.
- Flask API runs locally or can be deployed to any cloud provider.
- React frontend runs locally or can be built for production.

## Screenshots

### Home Page – Dining Hall Selection
![Home Page](assets/home.png)

### Menu View – Food by Meal and Station
![Menu View](assets/menu.png)

### Review Submission – Leave Feedback on Items
![Submit Review](assets/review-submit.png)

### Review Display – See What Others Said
![Reviews Display](assets/review-view.png)

## Contributors

- [Alvin Lee](https://github.com/nitron532)
- [Nathan Ngo](https://github.com/ngostream)
