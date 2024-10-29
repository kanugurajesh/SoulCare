from fastapi import APIRouter, File, UploadFile
import os
import psycopg2
from dotenv import load_dotenv

# loading all the environment variables
load_dotenv()

router = APIRouter()

# Directory for uploads
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

database_url = os.getenv("DATABASE_URL")


@router.get("")
async def list_files():
    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM files")
            files = cur.fetchall()
            return files


@router.delete("/{file_id}")
async def delete_file(file_id: int):
    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM files WHERE file_id = %s", (file_id,))
            conn.commit()
            return {"message": "File deleted successfully"}


@router.get("/local")
async def get_local_files():
    try:
        files = []
        for filename in os.listdir(UPLOAD_DIRECTORY):
            file_path = os.path.join(UPLOAD_DIRECTORY, filename)
            if os.path.isfile(file_path):
                file_size = os.path.getsize(file_path)
                file_info = {"filename": filename, "path": file_path, "size": file_size}
                files.append(file_info)

        return {"files": files}
    except Exception as e:
        return {"error": f"An error occurred while reading local files: {str(e)}"}


from fastapi import HTTPException
import os


@router.delete("/local/{filename}")
async def delete_local_file(filename: str):
    try:
        # Identify the file path based on the filename or ID
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)

        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        # Delete the file from the filesystem
        os.remove(file_path)

        return {"message": "File deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
