from langchain_community.document_loaders import PyMuPDFLoader
from langchain_cohere import CohereEmbeddings
from .chunker import chunker
import psycopg2
import os

# Initialize embedding model
embedding_model = CohereEmbeddings(model="embed-english-v3.0")
database_url = os.getenv("DATABASE_URL")


def store_data(file_path, file_id):
    """Stores document embeddings in PostgreSQL."""

    # Load document pages
    loader = PyMuPDFLoader(file_path)
    pages = [doc for doc in loader.lazy_load()]

    # Establish database connection
    conn = psycopg2.connect(database_url)

    try:
        with conn.cursor() as cur:
            # Ensure vector extension and embeddings table exist
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS embeddings (
                    id SERIAL PRIMARY KEY, 
                    text TEXT, 
                    embedding vector(1024), 
                    file_id INT REFERENCES files(file_id) ON DELETE CASCADE
                )
                """
            )

            # Process each page and chunk content
            for page in pages:
                chunks = chunker(page.page_content)
                embeddings = embedding_model.embed_documents(chunks)

                # Insert each chunk and its embedding with file_id reference
                for text, embedding in zip(chunks, embeddings):
                    embedding_array = [float(x) for x in embedding]
                    cur.execute(
                        """
                        INSERT INTO embeddings (text, embedding, file_id) 
                        VALUES (%s, %s::vector, %s)
                        """,
                        (text, embedding_array, file_id),
                    )

        # Commit transaction
        conn.commit()
        print("Embeddings stored in PostgreSQL with pgvector successfully.")

    except Exception as e:
        conn.rollback()
        print(f"Error storing embeddings: {e}")

    finally:
        conn.close()
