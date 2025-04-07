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

- **Backend**: Flask, SQLite
- **Frontend**: React, React-Router, React-Bootstrap, Axios, Vite
- **API**: UCSB Dining API
- **Deployment**: GitHub Actions (scheduled updates to the database)
- **Package Managers**: pip (Python), npm (Node.js)
