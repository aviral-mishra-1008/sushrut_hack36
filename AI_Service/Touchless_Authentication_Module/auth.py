from S1_Audio.utils import *
from utils import *

opts = {-1:"No Face Detected", -2:"Spoofing Detected"}

def authenticate_user(audio_path,image_path):
    user_id_from_audio = detect_audio(audio_path)
    user_id_from_image = detect_person(image_path)
    
    if user_id_from_image in opts.keys():
        print(opts[user_id_from_image])
        return -1 
    
    if user_id_from_audio == user_id_from_image:
        return user_id_from_audio
    
    else:
        print("Authentication failed!")
        return -1

def register_user(audio_path,image_path,userID):
    make_audio_embedding(audio_path,userID)
    make_face_embeddings(image_path,userID)
    print(f"User {userID} registered successfully!")