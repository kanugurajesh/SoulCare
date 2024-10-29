from fastapi import APIRouter, Request
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
import psycopg2
import os

router = APIRouter()
database_url = os.getenv("DATABASE_URL")

emotion_model_name = "ahmettasdemir/distilbert-base-uncased-finetuned-emotion"
emotion_model = DistilBertForSequenceClassification.from_pretrained(emotion_model_name)
emotion_tokenizer = DistilBertTokenizer.from_pretrained(emotion_model_name)

sentiment_model_name = "distilbert-base-uncased-finetuned-sst-2-english"
sentiment_model = DistilBertForSequenceClassification.from_pretrained(sentiment_model_name)
sentiment_tokenizer = DistilBertTokenizer.from_pretrained(sentiment_model_name)

class TextInput(BaseModel):
    text: str

@router.post("/predict")
async def predict_emotion_sentiment(request: Request):
    data = await request.json()
    input = data.get("input")
    gmail = data.get("gmail")
    emotion_inputs = emotion_tokenizer(input, return_tensors='pt')
    emotion_outputs = emotion_model(**emotion_inputs)
    emotion_probs = torch.nn.functional.softmax(emotion_outputs.logits, dim=-1)
    predicted_emotion = torch.argmax(emotion_probs, dim=1).item()
    emotion = emotion_model.config.id2label[predicted_emotion]

    sentiment_inputs = sentiment_tokenizer(input, return_tensors='pt')
    sentiment_outputs = sentiment_model(**sentiment_inputs)
    sentiment_probs = torch.nn.functional.softmax(sentiment_outputs.logits, dim=-1)
    predicted_sentiment = torch.argmax(sentiment_probs, dim=1).item()
    sentiment = sentiment_model.config.id2label[predicted_sentiment]
    
    print(sentiment)
    
    with psycopg2.connect(database_url) as conn:
        with conn.cursor() as cur:
            # Create the sentiment table with defaults set to 0
            cur.execute("""
                CREATE TABLE IF NOT EXISTS sentiment (
                    id SERIAL PRIMARY KEY,
                    gmail VARCHAR(255),
                    POSITIVE INT DEFAULT 0,
                    NEGATIVE INT DEFAULT 0,
                    NEUTRAL INT DEFAULT 0,
                    DATE DATE,
                    UNIQUE (gmail, DATE)
                );
            """)
            conn.commit()

            # Insert or update based on the sentiment type
            if sentiment == "POSITIVE":
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE)
                    VALUES (%s, 1, 0, 0, CURRENT_DATE)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET POSITIVE = sentiment.POSITIVE + 1;
                """, (gmail,))
            elif sentiment == "NEGATIVE":
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE)
                    VALUES (%s, 0, 1, 0, CURRENT_DATE)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET NEGATIVE = sentiment.NEGATIVE + 1;
                """, (gmail,))
            else:  # NEUTRAL sentiment
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE)
                    VALUES (%s, 0, 0, 1, CURRENT_DATE)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET NEUTRAL = sentiment.NEUTRAL + 1;
                """, (gmail,))

            conn.commit()

    return {"sentiment": sentiment}
