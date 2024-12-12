from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Path
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from groq import Groq
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    # "http://localhost:3000",  # or any other origin you want to allow
    # "https://super-sloth-deep.ngrok-free.app",
    "https://fast-api-nextjs-news-summerize-works-no5d43yhb.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}



load_dotenv()

# app = FastAPI()

options = Options()
options.use_chromium = True
options.add_argument("user-data-dir=C:\\Users\\WorkStation\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default")

def scrape_article(url: str) -> str:
    driver = webdriver.Edge(options=options)
    driver.get(url)
    element = driver.find_element(By.XPATH, '//*[@id="new-article-template"]/div/div[1]')
    html = element.get_attribute("outerHTML")
    soup = BeautifulSoup(html, "html.parser")
    content = soup.get_text(strip=True)
    driver.quit()
    return content

def get_groq_client() -> Groq:
    api_key = os.environ.get("GROQ_API_KEY")
   
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set")
    return Groq(api_key=api_key)

def tldr_article(content: str) -> str:
    client = get_groq_client()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Read the following text and give me the TLDR like you were my executive assistant: {content}",
            },
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content

def summarize_article(content: str) -> str:
    client = get_groq_client()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Read the following text and give me the TLDR like you were my executive assistant. Followed by an in-depth report where you pull all the relevant information and expand on it if necessary, if not reiterate the important points: {content}",
            },
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content

@app.get("/scrape_article/{url:path}")
async def scrape_article_api(url: str = Path(..., description="Article URL")):
    article_content = scrape_article(url)
    tldr_review = tldr_article(article_content)
    llm_review = summarize_article(article_content)
    return {"tldr": tldr_review, "summary": llm_review}

@app.get("/tldr/{url:path}")
async def tldr_article_api(url: str = Path(..., description="Tldr URL")):
    tldr_content = scrape_article(url)
    tldr_review= tldr_article(tldr_content)
    return {"TLDR": tldr_review}

@app.get("/summery/{url:path}")
async def tldr_article_api(url: str = Path(..., description="Summary URL")):
    summery_content = scrape_article(url)
    summery_review= summarize_article(summery_content)
    return {"Executive Summery": summery_review}


from fastapi.responses import Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
@app.get("/generate_tldr/{url:path}")
async def tldr_article_api(url: str = Path(..., description="Tldr URL")):
    try:
        tldr_content = scrape_article(url)
        tldr_review = tldr_article(tldr_content)
        return Response(content=tldr_review, media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=404, content={"detail": str(e)})

@app.get("/generate_summery/{url:path}")
async def summary_article_api(url: str = Path(..., description="Summary URL")):
    try:
        summery_content = scrape_article(url)
        summery_review = summarize_article(summery_content)
        return Response(content=summery_review, media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=404, content={"detail": str(e)})

@app.get("/generate_text/{url:path}")
async def generate_text(url: str = Path(..., description="Article Full URL")):
    try:
        article_content = scrape_article(url)
        llm_review = summarize_article(article_content)
        
        docbreaker = "************************* FULL ARTICLE *************************"
        text = f"{llm_review}\n\n\n\n{docbreaker}\n\n\n\n{article_content}"
        
        return Response(content=text, media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=404, content={"detail": str(e)})


# @app.get("/generate_text/{url:path}")
# async def generate_text(url: str = Path(..., description="Article URL")):
#     article_content = scrape_article(url)
#     # tldr_review = tldr_article(article_content)
#     llm_review = summarize_article(article_content)
    
#     docbreaker = "************************* FULL ARTICLE *************************"
#     text = f"{llm_review}\n\n\n{docbreaker}\n\n\n{article_content}"
    
#     return {"The whole thing": text}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Raz's first API!",
        "instructions": "Use /scrape_article/{url} to scrape an article, e.g., /scrape_article/https://example.com/article. For a TLDR, use /tldr/{url}."
    }