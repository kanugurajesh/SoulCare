from fastapi import APIRouter, File, UploadFile
import shutil
import os
from dotenv import load_dotenv
from utils.storemeta import store_meta
from utils.storedata import store_data

# Load environment variables
load_dotenv()

router = APIRouter()

# Directory for uploads
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Default route for file upload
@router.post("")
async def upload(file: UploadFile = File(...), user_gmail: str = ""):
    # Define the path to save the uploaded file
    file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
    
    # Write the file to the uploads directory
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Calculate file size
    file_size = os.path.getsize(file_location)
    
    # Store metadata in the database and retrieve the file_id
    file_id = store_meta(file_location, file.filename, file_size, file.content_type, user_gmail)
    
    # Pass file_id to store_data to associate embeddings with this file
    store_data(file_location, file_id)

    return {
        "message": "File uploaded and processed successfully",
        "file_location": file_location,
        "file_id": file_id
    }
