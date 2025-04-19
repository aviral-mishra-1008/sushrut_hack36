from julep import Julep
import os
from dotenv import load_dotenv
import requests
from parsingService import parseNameDateTime
from fastapi import FastAPI
from pydantic import BaseModel
import sys
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from translate import to_english
from Masking_Demasking_Module.Masking_Layer import PIIMasker

pii = PIIMasker()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

client = Julep(
    api_key=os.getenv('JULEP_API_KEY'),
    environment=os.getenv('JULEP_ENVIRONMENT', 'production')
)

class APICaller:

    def __init__(self, prompt):
        self.prompt = prompt
    
    def sendMessage(self):
        session = client.sessions.get(session_id=os.getenv('SESSION_ID'))

        response = None

        while (response is None):
            print("Waiting for response...")
            response = client.sessions.chat(
                session_id=session.id,
                messages=[
                    {
                        "role": "user",
                        "content": self.prompt
                    }
                ]
            )

        return response.choices[0].message.content
    
    def callAPI(self):
        endpoint = self.sendMessage()
        url = "http://127.0.0.1:8080/api/" + endpoint
        if endpoint == 'query_llm':
            data = {
                'query': self.prompt
            }
            res = requests.post(url="http://127.0.0.1:8080/api/llm/query", json=data)
            return res.content
        if endpoint == 'book_appointment':
            info = parseNameDateTime(self.prompt)
            #print(info)
            data = {
                'name': info['name'],
                'date': info['date'],
                'time': info['time']
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'check_availability':
            info = parseNameDateTime(self.prompt)
            #print(info)
            data = {
                'name': info['name'],
                'date': info['date'],
                'time': info['time']
            }
            data = {
                'prompt': self.prompt
            }
            res = requests.post(url=url, json=data)
            return res
        if endpoint == 'customer_support':
            return requests.get(url=url)

@app.post('/api/julep')
async def getIntent(prompt: Request):
    data = await prompt.json()
    query = data.get('query', '')
    language = data.get('language', '')
    if language != 'en-US' and language != 'en-GB':
        query = to_english(query, language)
    call = APICaller(query)
    return call.callAPI()