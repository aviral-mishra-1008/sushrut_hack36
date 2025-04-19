from fastapi import FastAPI, HTTPException
from LLM_Models.LLM.LLM import *
from LLM_Models.Gemini.Recomment_Department import *
from LLM_Models.LLM.Prompt_Builder import *
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from translate import *
from LLM_Models.LLM.Styles import *
from fastapi import FastAPI, File, UploadFile, Request
import shutil
from pathlib import Path
from fastapi.responses import JSONResponse
import base64
from auth import *

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


TEMP_DIR = Path("Temp")
TEMP_DIR.mkdir(exist_ok=True)


@app.post("/query")
async def process_query(request: Request):
    try:
        data = await request.json()
        query = data.get('query', '')
        
        promptBuilder.change_style(Style.FOCUSED)
        prompt = promptBuilder.build_prompt(query)
        answer = llm.generate(prompt)
        department = gemini.predict_department(query).get('recommended_department', '')
        print("Answer from LLM:", answer)
        print("Answer from Gemini:", department)
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

@app.post("/register_user")
async def register_user(request: Request):
    try:
        data = await request.json()
        userID = data.get("userID")
        if not userID:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error", 
                    "message": "userID is required",
                }
            )

        audio_base64 = data.get("audio_file")
        image_base64 = data.get("image_file")

        if not audio_base64 or not image_base64:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error", 
                    "message": "Both audio_file and image_file are required",
                }
            )

        try:
            audio_data = base64.b64decode(audio_base64)
            audio_path = TEMP_DIR / f"{userID}.wav"
            with open(audio_path, "wb") as f:
                f.write(audio_data)

            image_data = base64.b64decode(image_base64)
            image_path = TEMP_DIR / f"{userID}.jpg"
            with open(image_path, "wb") as f:
                f.write(image_data)

            register_user(audio_path, image_path, userID)
            print("User registered successfully")

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Invalid base64 data: {str(e)}",
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Registration successful",
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"An error occurred: {str(e)}",
            }
        )




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)