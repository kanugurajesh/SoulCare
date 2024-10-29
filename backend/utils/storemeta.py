import os
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

# Function to store file metadata in the database and return file_id
def store_meta(file_location, file_name, file_size, file_type, user_gmail):
    # Get the database URL from environment variables
    database_url = os.getenv("DATABASE_URL")
    # Initialize the connection to the database
    conn = psycopg2.connect(database_url)
    
    try:
        with conn.cursor() as curr:
            # Create the files table if it does not exist
            curr.execute(
                """
                CREATE TABLE IF NOT EXISTS files (
                    file_id SERIAL PRIMARY KEY, 
                    file_location VARCHAR(255), 
                    file_name VARCHAR(255) UNIQUE, 
                    file_size INT, 
                    file_type VARCHAR(255), 
                    user_gmail VARCHAR(255)
                )
                """
            )
            
            # Insert data into the files table and return file_id
            curr.execute(
                """
                INSERT INTO files (file_location, file_name, file_size, file_type, user_gmail) 
                VALUES (%s, %s, %s, %s, %s) RETURNING file_id
                """,
                (file_location, file_name, file_size, file_type, user_gmail)
            )
            
            # Retrieve the generated file_id
            file_id = curr.fetchone()[0]
        
        # Commit transaction
        conn.commit()
        print("File metadata stored successfully")
        return file_id  # Return the file_id for further use
    
    except Exception as e:
        conn.rollback()
        print(f"Error storing file metadata: {e}")
        return None
    
    finally:
        conn.close()
