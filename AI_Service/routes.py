from fastapi import FastAPI
from pydantic import BaseModel

class Prompt(BaseModel):
    prompt: str

app = FastAPI()

@app.post('/api/query_llm')
def first_route(prompt: Prompt):
    print(prompt)
    return 1

@app.post('/api/book_appointment')
def second_route(prompt):
    print(prompt)
    return 2

@app.post('/api/check_availability')
def third_route(prompt):
    print(prompt)
    return 3

@app.get('/api/customer_support')
def fourth_route():
    print(4)
    return 4