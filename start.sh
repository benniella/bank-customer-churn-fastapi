#!/bin/bash
echo "Starting FastAPI app on Render..."
uvicorn main:app --host 0.0.0.0 --port $PORT