# UCSB Dining Commons Menu & Reviews

A full-stack web application that allows users to view dining hall menus at UCSB and submit reviews for individual menu items. The backend is built with Flask and makes requests to our SQLite powered database and UCSB's Dining API. The frontend is built with React/Vite and interacts with the backend Flask API through axios to request and submit dining hall reviews and data.

## Features

- View current menus by dining hall (Carrillo, Portola, Ortega, etc.)
- Submit food reviews and ratings
- Display average rating and user reviews for each menu item
- Backend powered by Flask and SQLite
- Frontend powered by Vite, React, React-Bootstrap, Material-UI
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
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Returns current menu data for all dining halls |
| POST | `/<dining_hall>/<item_name>` | Submits a review for a menu item |
| GET | `/<dining_hall>/<item_name>` | Returns all reviews + avg rating for an item |

## Deployment & Automation

- `update_database.py` pulls new dining hall data from UCSB API and inserts it into SQLite.
- This script is automatically run daily using GitHub Actions to keep data fresh.
- Flask API runs locally or can be deployed to any cloud provider.
- React frontend runs locally or can be built for production.

## Running Locally

### Backend Setup
```bash
cd server
pip install -r requirements.txt
python server.py
```

You need to create `.env.prod` with a UCSB API key:
```
API_KEY=your-ucsb-api-key
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
