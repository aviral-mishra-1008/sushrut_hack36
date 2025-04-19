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
from datetime import datetime
from auth import *
from LLM_Models.Pathology_Report_Models.utils.reportTables2Text import *
from LLM_Models.Pathology_Report_Models.utils.pdf2Text import *
from LLM_Models.Pathology_Report_Models.utils.text2table import *
from LLM_Models.Radiology_Report_Models.Summarization_model.summary_model import *
from LLM_Models.Gemini.Layman import *
from Masking_Demasking_Module.Masking_Layer import *
import os

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


radio_summary_model = PDFSummarizer()
table_extractor = pathology_reports()
pdf_to_text = PDFTextExtractor()
explainer = Layman(os.getenv('GEMINI_API_KEY'))
pii_masker = PIIMasker()


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

            os.remove(audio_path)
            os.remove(image_path)

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

@app.post("/authenticate_user")
async def authenticate_user(request: Request):
    try:
        data = await request.json()
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
            audio_path = TEMP_DIR / "temp_audio.wav"
            with open(audio_path, "wb") as f:
                f.write(audio_data)

            image_data = base64.b64decode(image_base64)
            image_path = TEMP_DIR / "temp_image.jpg"
            with open(image_path, "wb") as f:
                f.write(image_data)

            userID = authenticate_user(audio_path, image_path)
            print("User authenticated successfully")

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Invalid base64 data: {str(e)}",
                }
            )
        
        if userID == -1:
            return JSONResponse(
                status_code=401,
                content={
                    "status": "error",
                    "message": "Authentication failed",
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "userID": userID,
                "message": "Authentication successful",
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


TEMP_DIR = Path("AI_Service/Temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/summarize")
async def summarize_report(request: Request):
    try:
        data = await request.json()
        file_content = data.get('file_content', '')
        report_type = data.get('report_type', None)

        if not file_content:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "file_content is required"
                }
            )

        if report_type not in [0, 1]:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "report_type must be 0 (Radiology) or 1 (Pathology)"
                }
            )

        try:
            pdf_content = base64.b64decode(file_content)
            pdf_path = TEMP_DIR / "test.pdf"
            with open(pdf_path, "wb") as f:
                f.write(pdf_content)
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Invalid PDF content: {str(e)}"
                }
            )

        try:
            if report_type == 0:  
                outcome = radio_summary_model.summarize_pdf(str(pdf_path))
                
                masked_text, mapping_dict = pii_masker.mask_pii(outcome)
                
                masked_explanation = explainer.explain(masked_text)
                
                demasked_summary = pii_masker.demask_pii(masked_text, mapping_dict)
                demasked_explanation = pii_masker.demask_pii(masked_explanation, mapping_dict)
                
                response = {
                    "status": "success",
                    "summary": demasked_summary,
                    "explanation": demasked_explanation
                }

            else: 
                tables = table_extractor.get_valid_tables(str(pdf_path))
                
                if tables is not None:
                    outcome = table_extractor.to_natural_language(tables)
                else:
                    text = pdf_to_text.process_pdf(str(pdf_path))
                    table = pdf_to_text.process_medical_report(text)
                    if table is not None:
                        outcome = table_extractor.to_natural_language(table)
                    else:
                        return JSONResponse(
                            status_code=400,
                            content={
                                "status": "error",
                                "message": "No valid tables found in the PDF"
                            }
                        )
                
                masked_text, mapping_dict = pii_masker.mask_pii(outcome)
                masked_explanation = explainer.explain(masked_text)
                demasked_summary = pii_masker.demask_pii(masked_text, mapping_dict)
                demasked_explanation = pii_masker.demask_pii(masked_explanation, mapping_dict)
                
                response = {
                    "status": "success",
                    "summary": demasked_summary,
                    "explanation": demasked_explanation
                }

        finally:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)

        return JSONResponse(
            status_code=200,
            content=response
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }
        )
