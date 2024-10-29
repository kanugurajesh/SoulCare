import os
from fastapi import APIRouter, Request, HTTPException
from langchain_community.document_loaders import YoutubeLoader
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import execute_values  # For efficient batch insertion
from utils.chunker import chunker
from langchain_cohere import CohereEmbeddings
import cohere

# Load environment variables
load_dotenv()

# Set up FastAPI router
router = APIRouter()

# Load API key and database URL from environment variables
cohere_api_key = os.getenv("COHERE_API_KEY")
database_url = os.getenv("DATABASE_URL")

co = cohere.Client(cohere_api_key)

# Set the Cohere API key if not set
if cohere_api_key:
    os.environ["COHERE_API_KEY"] = cohere_api_key
else:
    raise ValueError("Cohere API key is missing. Set COHERE_API_KEY in your environment.")

# Initialize embedding model
embedding_model = CohereEmbeddings(model="embed-english-v3.0")

@router.post("/embed")
async def youtube(request: Request):
    data = await request.json()
    video_id = data.get("videoId", "")
    
    if not video_id:
        raise HTTPException(status_code=400, detail="Video ID is required.")
    
    url = f"https://youtu.be/{video_id}"
    
    # Load the video data
    loader = YoutubeLoader.from_youtube_url(url, add_video_info=False)
    data = loader.load()
    video_content = data[0].page_content
    
    # Establish database connection
    try:
        conn = psycopg2.connect(database_url)
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")
    
    try:
        with conn.cursor() as cur:
            # Ensure vector extension and table are set up
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS youtubeembeddings (
                    id SERIAL PRIMARY KEY, 
                    text TEXT, 
                    embedding vector(1024)
                )
            """)

            # Process content into chunks and embeddings
            chunks = chunker(video_content)
            embeddings = embedding_model.embed_documents(chunks)

            # Insert each chunk and its embedding into the database
            values = [(text, embedding) for text, embedding in zip(chunks, embeddings)]
            execute_values(
                cur,
                "INSERT INTO youtubeembeddings (text, embedding) VALUES %s",
                values,
                template="(%s, %s::vector)"
            )

        # Commit transaction
        conn.commit()
        return {"message": "Embeddings stored in PostgreSQL successfully."}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error storing embeddings: {e}")

    finally:
        conn.close()

@router.post("/search")
async def search(request: Request):
    data = await request.json()
    query = data.get("query", "")
    
    embeddings = CohereEmbeddings(model="embed-english-v3.0")
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required.")
    
    # Establish database connection
    try:
        conn = psycopg2.connect(database_url)
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")
    
    try:
        with conn.cursor() as cur:
            # Check if table exists
            cur.execute("SELECT to_regclass('public.youtubeembeddings')")
            if cur.fetchone()[0] is None:
                raise HTTPException(status_code=400, detail="Table youtubeembeddings does not exist.")
            
            # Embed the query
            query_embedding = embeddings.embed_query(query)
            # print("Query Embedding:", query_embedding)  # Debugging line
            
            if not query_embedding:
                raise HTTPException(status_code=400, detail="Query embedding is empty.")
            
            # Perform semantic search with similarity threshold (e.g., > 0.1)
            cur.execute("""
                SELECT text, embedding, 1 - (embedding <=> %s::vector) AS similarity
                FROM youtubeembeddings
                WHERE 1 - (embedding <=> %s::vector) > 0.1
                ORDER BY embedding <=> %s::vector
                LIMIT 5
            """, (query_embedding, query_embedding, query_embedding))
            
            results = cur.fetchall()
            if not results:
                raise HTTPException(status_code=404, detail="No results found with sufficient similarity.")
            
            context_data = [{"text": result[0], "similarity": result[2]} for result in results]
            # print("Search Results:", context_data)  # Debugging line to inspect results and similarities
        
        context = context_data[0]["text"] if context_data else ""
        
        promptD = f"Answer the Question: {query} based on the context: {context}"
        # print("Prompt:", promptD)  # Debugging line
        
        response = co.generate(
            model='command-xlarge',
            prompt=promptD,
            max_tokens=100,
            temperature=0.7,
            stop_sequences=["--END--"]
        )
        
        if not response.generations:
            raise HTTPException(status_code=500, detail="No generation returned from Cohere.")
        
        # print("Response:", response.generations[0].text)
        
        return {"response": response.generations[0].text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching embeddings: {e}")


@router.delete("/delete")
async def delete():
    try:
        # Attempting database connection
        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cur:
                # Dropping the table if it exists
                cur.execute("DROP TABLE IF EXISTS youtubeembeddings")
                conn.commit()  # Commit the transaction after dropping the table
            
            return {"message": "Table youtubeembeddings dropped successfully."}
    
    except psycopg2.Error as e:
        # Rollback on error and return a 500 error with the exception detail
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error dropping table: {e}")
