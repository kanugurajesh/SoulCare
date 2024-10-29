from fastapi import APIRouter, Request
from langchain_cohere import CohereEmbeddings, ChatCohere
import psycopg2
import os
from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import PromptTemplate

workflow = StateGraph(state_schema=MessagesState)

# Load environment variables
load_dotenv()
database_url = os.getenv("DATABASE_URL")

# Define the router
router = APIRouter()

# Define the number of similar results to retrieve
top_n = 5

# Initialiazing the cohere model
model = ChatCohere(temperature=0)

# Creating a prompt template for the model
prompt = PromptTemplate.from_template(
    "As a knowledgeable assistant, provide a clear and helpful answer to the user's question."
    "Question: {question}"
    "Context : {context}"
    "Respond concisely and directly:"
)


def call_model(state: MessagesState):
    system_prompt = (
        "You are a helpful assistant. "
        "Answer all questions to the best of your ability. "
    )
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    response = model.invoke(messages)
    return {"messages": response}


workflow.add_node("model", call_model)
workflow.add_edge(START, "model")

# Add simple in-memory checkpointer
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)


@router.post("")
async def read_items(request: Request):
    # Parse incoming JSON data
    data = await request.json()
    message = data.get("message", "")

    # Initialize embeddings
    embeddings = CohereEmbeddings(model="embed-english-v3.0")
    # Connect to the database
    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            query_embedding = embeddings.embed_query(message)

            # Check if the query embedding is empty
            if not query_embedding:
                return "Sorry, I didn't understand that. Could you please rephrase your question?"

            # check if the embeddings table exists
            cur.execute(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_name = 'embeddings'
                );
                """
            )

            if not cur.fetchone()[0]:
                return "Sorry, I am unable to answer your question at the moment. Please try again later."

            # Perform semantic search
            cur.execute(
                """
                SELECT text, embedding, 1 - (embedding <=> %s::vector) AS similarity
                FROM embeddings
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
                """,
                (query_embedding, query_embedding, top_n),
            )

            # Fetch and return the results
            results = cur.fetchall()

            context_data = [{"text": result[0]} for result in results]

    context = context_data[0]["text"] if context_data else ""

    final = app.invoke(
        {
            "messages": [
                HumanMessage(
                    content=prompt.invoke(
                        {"question": message, "context": context}
                    ).to_string()
                )
            ]
        },
        config={"configurable": {"thread_id": "1"}},
    )

    return final.get("messages")[len(final.get("messages")) - 1].content
