from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = psycopg2.connect(
    dbname="fraud_detection",
    user="fraud_user",
    password="fraud_pass",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

@app.get("/data")
def get_data(
    start: str = Query(None),  # ISO datetime string
    end: str = Query(None)
):
    query = 'SELECT * FROM "transaction"'
    params = []

    if start and end:
        query += ' WHERE "Timestamp" BETWEEN %s AND %s'
        params = [start, end]

    query += " ORDER BY \"Timestamp\" LIMIT 1000;"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    colnames = [desc[0] for desc in cursor.description]
    data = [dict(zip(colnames, row)) for row in rows]
    return {"data": data}
