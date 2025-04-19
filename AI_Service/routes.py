from fastapi import FastAPI
from pydantic import BaseModel
from Models.LLM.LLM import LLM

class Prompt(BaseModel):
    prompt: str

class Doctor(BaseModel):
    name: str
    date: str
    time: str

app = FastAPI()

@app.post('/api/query_llm')
def first_route(prompt: Prompt):
    llm = LLM()
    output = llm.generate(prompt)
    return output

@app.post('/api/book_appointment')
def second_route(prompt: Doctor):
    print(prompt)
    return 2

@app.post('/api/check_availability')
def third_route(prompt: Doctor):
    print(prompt)
    return 3

@app.get('/api/customer_support')
def fourth_route():
    print(4)
    return 4