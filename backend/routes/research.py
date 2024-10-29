from fastapi import APIRouter, Request, HTTPException
from tavily import TavilyClient
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("TAVILY_API_KEY")

tavily_client = TavilyClient(api_key=API_KEY)

@router.post("")
async def research(request: Request):
    data = await request.json()
    text = data.get("prompt", "")

    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")
    
    response = tavily_client.search(text)
    
    return response