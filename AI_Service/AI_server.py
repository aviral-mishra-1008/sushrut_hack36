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
from pydub import AudioSegment
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import json
import io


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

ENCRYPTION_KEY = "YourSecretKey123YourSecretKey123".encode('utf-8')
TEMP_DIR = os.path.join(os.getcwd(),"Temp")

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
async def register_users(request: Request):
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
            # Decode base64 audio
            audio_data = base64.b64decode(audio_base64)
            
            # Process audio with pydub
            try:
                # Load audio from bytes
                audio = AudioSegment.from_file(io.BytesIO(audio_data))
                
                # Convert to mono if stereo
                if audio.channels > 1:
                    audio = audio.set_channels(1)
                
                # Set proper audio parameters
                audio = audio.set_frame_rate(16000)  # Set sample rate to 16kHz
                audio = audio.set_sample_width(2)    # Set to 16-bit
                
                # Save the processed audio
                audio_path = os.path.join(TEMP_DIR, f"{userID}.wav")
                audio.export(audio_path, format="wav", parameters=["-ac", "1", "-ar", "16000"])
                print("Audio file processed and saved successfully")
            
            except Exception as audio_e:
                print(f"Error processing audio: {str(audio_e)}")
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "message": f"Error processing audio: {str(audio_e)}",
                    }
                )

            # Process image
            image_data = base64.b64decode(image_base64)
            image_path = os.path.join(TEMP_DIR, f"{userID}.jpg")
            with open(image_path, "wb") as f:
                f.write(image_data)
            print("Image file saved successfully")

            # Register user
            register_user(audio_path, image_path, userID)
            print("User registered successfully")

            # Clean up temporary files
            os.remove(audio_path)
            os.remove(image_path)

            return JSONResponse(
                status_code=200,
                content={
                    "message": "Registration successful",
                }
            )

        except Exception as e:
            print(f"Processing error: {str(e)}")
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Processing error: {str(e)}",
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
async def authenticate_users(request: Request):
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
            # Decode base64 audio
            audio_data = base64.b64decode(audio_base64)
            
            # Convert audio to proper WAV format using pydub
            try:
                # Load audio from bytes
                audio = AudioSegment.from_file(io.BytesIO(audio_data))
                
                # Convert to mono if stereo
                if audio.channels > 1:
                    audio = audio.set_channels(1)
                
                # Export as WAV with specific parameters
                audio = audio.set_frame_rate(16000)  # Set sample rate to 16kHz
                audio = audio.set_sample_width(2)    # Set to 16-bit
                
                # Save the processed audio
                audio_path = os.path.join(TEMP_DIR, "temp_audio.wav")
                audio.export(audio_path, format="wav", parameters=["-ac", "1", "-ar", "16000"])
                print("Audio file saved successfully")
            
            except Exception as audio_e:
                print(f"Error processing audio: {str(audio_e)}")
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "message": f"Error processing audio: {str(audio_e)}",
                    }
                )

            # Process image
            image_data = base64.b64decode(image_base64)
            image_path = os.path.join(TEMP_DIR, "temp_image.jpg")
            with open(image_path, "wb") as f:
                f.write(image_data)
            print("Image file saved successfully")

            userID = authenticate_user(audio_path, image_path)
            print("User authenticated successfully",userID)

            return JSONResponse(
                status_code=200,
                content={
                    "userID": userID,
                    "message": "Authentication successful",
                }
            )

        except Exception as e:
            print(f"Processing error: {str(e)}")
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Processing error: {str(e)}",
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






def decrypt_data(encrypted_data):
    cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.ECB(), backend=default_backend())
    decryptor = cipher.decryptor()
    return decryptor.update(encrypted_data) + decryptor.finalize()

@app.post("/summarize")
async def summarize_report(request: Request):
    try:
        data = await request.json()
        file_content = data.get('file_content', '')
        report_type = int(data.get('report_type', '-1'))

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
            encrypted_content = base64.b64decode(file_content)
            pdf_content = decrypt_data(encrypted_content)
            
            os.makedirs(TEMP_DIR, exist_ok=True)
            
            pdf_path = os.path.join(TEMP_DIR, "test.pdf")
            with open(pdf_path, "wb") as f:
                f.write(pdf_content)

        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Invalid PDF content or decryption error: {str(e)}"
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
                    "summary": demasked_explanation
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