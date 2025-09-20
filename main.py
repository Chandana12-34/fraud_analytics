from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; later restrict to http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Connection (use your own credentials)
DB_CONFIG = {
    "dbname": "fraud_detection",
    "user": "postgres",
    "password": "fraud_pass",
    "host": "localhost",
    "port": "5432"
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

@app.get("/transaction")
def get_transactions():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM transaction LIMIT 100;")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    cur.close()
    conn.close()
    return [dict(zip(colnames, row)) for row in rows]

@app.get("/fraud-summary")
def get_fraud_summary():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT
            SUM(CASE WHEN "FraudIndicator" = 1 THEN 1 ELSE 0 END) AS fraudulent,
            SUM(CASE WHEN "FraudIndicator" = 0 THEN 1 ELSE 0 END) AS non_fraudulent
        FROM transaction;
    """)
    fraud, non_fraud = cur.fetchone()
    cur.close()
    conn.close()
    return {"fraudulent": fraud, "non_fraudulent": non_fraud}
