from fastapi import FastAPI
from pydantic import BaseModel
from Models.LLM.LLM import LLM
from Models.Gemini.Recomment_Department import Gemini

class Prompt(BaseModel):
    prompt: str

class Doctor(BaseModel):
    name: str
    date: str
    time: str

class PathologyRequest(BaseModel):
    prompt: str

app = FastAPI()

llm = LLM()
rd = Gemini()

@app.post('/api/query_llm')
def first_route(prompt: Prompt):
    output = llm.generate(prompt.prompt)
    dept = rd.predict_department(prompt.prompt)
    print(dept)
    return output

@app.post('/api/book_appointment')
def second_route(prompt: Doctor):
    return prompt

@app.post('/api/check_availability')
def third_route(prompt: Doctor):
    return prompt

@app.post('/api/pathology_test')
def fourth_route(prompt: PathologyRequest):
    return prompt