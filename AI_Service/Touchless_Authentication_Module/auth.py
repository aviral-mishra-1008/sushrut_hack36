# AI_Service/Touchless_Authentication_Module/auth.py
from S1_Audio.utils import *
from utils import *
from datetime import datetime

def get_timestamp():
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

opts = {
    -1: "No Face Detected",
    -2: "Spoofing Detected"
}

def authenticate_user(audio_path, image_path):
    timestamp = get_timestamp()  # "2025-04-19 13:56:38" format
    print(f"\nStarting authentication at {timestamp}")
    
    user_id_from_audio = detect_audio(audio_path)
    user_id_from_image = detect_person(image_path)
    
    if user_id_from_image in opts.keys():
        print(f"[{timestamp}] {opts[user_id_from_image]}")
        return -1 
    
    if user_id_from_audio == user_id_from_image:
        return user_id_from_audio
    else:
        print(f"[{timestamp}] Authentication failed!")
        return -1

def register_user(audio_path, image_path, userID):
    timestamp = get_timestamp()
    print(f"\n[{timestamp}] Registering user: {userID}")
    
    make_audio_embedding(audio_path, userID)
    make_face_embeddings(image_path, userID)
    print(f"[{timestamp}] User {userID} registered successfully!")