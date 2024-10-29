from fastapi import FastAPI, APIRouter, Request
import nltk
import psycopg2
import os
router = APIRouter()

database_url = os.getenv("DATABASE_URL")

# nltk.download('averaged_perceptron_tagger_eng')
# nltk.download('maxent_ne_chunker_tab')
# nltk.download('words')
# nltk.download('punkt_tab')
# nltk.download('vader_lexicon')

from nltk.sentiment import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()

@router.post("/predict")
async def result(request: Request):
    
    data = await request.json()
    input = data.get("input")
    gmail = data.get("gmail")
    
    y=sia.polarity_scores(input)
    x=y['compound']
    if x>0.2:
        sentiment="Positive"
    elif x<0:
        sentiment="Negative"
    else:
        sentiment="Neutral"
        
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
                    DATE DATE DEFAULT CURRENT_DATE,
                    SCORE FLOAT DEFAULT 0.0,
                    UNIQUE (gmail, DATE)
                );
            """)
            conn.commit()

            if sentiment == "Positive":
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE, SCORE)
                    VALUES (%s, 1, 0, 0, CURRENT_DATE, %s)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET POSITIVE = sentiment.POSITIVE + 1, SCORE = sentiment.SCORE + EXCLUDED.SCORE;
                """, (gmail, x))
            elif sentiment == "Negative":
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE, SCORE)
                    VALUES (%s, 0, 1, 0, CURRENT_DATE, %s)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET NEGATIVE = sentiment.NEGATIVE + 1, SCORE = sentiment.SCORE + EXCLUDED.SCORE;
                """, (gmail, x))
            else:  # Neutral sentiment
                cur.execute("""
                    INSERT INTO sentiment (gmail, POSITIVE, NEGATIVE, NEUTRAL, DATE, SCORE)
                    VALUES (%s, 0, 0, 1, CURRENT_DATE, %s)
                    ON CONFLICT (gmail, DATE)
                    DO UPDATE SET NEUTRAL = sentiment.NEUTRAL + 1, SCORE = sentiment.SCORE + EXCLUDED.SCORE;
                """, (gmail, x))

            conn.commit()

    return {"sentiment": sentiment}

        
    return {"Sentiment": text, "Score": x}