#!/bin/bash
cd server
pip install -r requirements.txt
gunicorn --bind=0.0.0.0:$PORT --timeout 600 server:app
