from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings

# Initialize Cohere client
def chunker(data):
    """This function splits the text into chunks of 500 characters each with an overlap of 50 characters,
    removes newline characters from each chunk, and generates embeddings for each chunk using Cohere."""
    
    # The below is used to generate embeddings for each chunk of text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )

    # Split text into chunks and remove newline characters
    chunks = [chunk.replace('\n', ' ') for chunk in text_splitter.split_text(data)]
    
    return chunks