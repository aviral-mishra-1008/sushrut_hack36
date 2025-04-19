from fastapi import FastAPI, HTTPException
from Models.LLM.LLM import *
from Models.Gemini.Recomment_Department import *
from Models.LLM.Prompt_Builder import *
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from translate import *
from Models.LLM.Styles import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

llm = LLM()
gemini = Gemini()
promptBuilder = PromptBuilder()

@app.post("/query")
async def process_query(request: Request):
    try:
        data = await request.json()
        query = data.get('query', '')
        language = data.get('language', '')

        if language!="en-US" and language!="en-GB":
            query = await to_english(query, language)

        print("Received query:", query, language)
        
        promptBuilder.change_style(Style.FOCUSED)
        prompt = promptBuilder.build_prompt(query)
        answer = llm.generate(prompt)
        department = gemini.predict_department(query)
        return {
            "department": department,
            "description": answer,
        }
        
    except json.JSONDecodeError:
        return {"status": "error", "message": "Invalid JSON"}
    except KeyError as e:
        return {"status": "error", "message": f"Missing required field: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)