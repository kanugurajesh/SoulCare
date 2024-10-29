from fastapi import APIRouter, HTTPException
import psycopg2
import os

database_url = os.getenv("DATABASE_URL")

router = APIRouter()

@router.get("")
async def read_priq():
    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT gmail FROM sentiment WHERE gmail IS NOT NULL ORDER BY score ASC")
            rows = cur.fetchall()
            
            # send the gmails in json format
            if rows:
                return {"gmails": [row[0] for row in rows]}
        
    raise HTTPException(status_code=404, detail="No data found")

