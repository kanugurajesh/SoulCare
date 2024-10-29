import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def get_meta():
    database_url = os.getenv("DATABASE_URL")
    conn = psycopg2.connect(database_url)
    
    with conn.cursor() as curr:
        # Execute SELECT query to fetch all records
        curr.execute("SELECT * FROM files")
        response = curr.fetchall()  # Fetch all results from the SELECT query
        print(response)  # This will print the list of records retrieved
        
    conn.commit()
    conn.close()
    
    print("File metadata stored successfully")
    
    return {"message": "File metadata stored successfully"}

get_meta()