import pickle
import numpy as np
import cv2
from Models.FaceNet_third_model_proposition_using_preTrained_fineTuning import *
from sklearn.preprocessing import Normalizer
import os
from src.anti_spoof_predict import AntiSpoofPredict
from src.generate_patches import CropImage
from src.utility import parse_model_name

l2_normalizer = Normalizer('l2')
detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
model = Embed_model()

model_dir = "./resources/anti_spoof_models"
model_test = AntiSpoofPredict(0)  
image_cropper = CropImage()



def make_face_embeddings(image_path,userId):
    image = cv2.imread(image_path)
    
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    except:
        gray = image
    
    try:
        (x, y, w, h) = detector.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)[0]
        face_img = image[y:y+h, x:x+w]
    
    except:
        print("No face detected")
        exit(1)

    face_img = cv2.resize(face_img, (160, 160))
    face_img = face_img.astype('float32') / 255.0
    face_img = np.expand_dims(face_img, axis=0)

    face_embedding = model.predict(face_img)[0]
    face_embedding = l2_normalizer.transform(np.expand_dims(face_embedding, axis=0))[0]

    data_dict = None
   
    if os.path.exists('faceEmbeddings.pkl'):
        with open('faceEmbeddings.pkl','rb') as f:
            data_dict = pickle.load(f)
        
    if data_dict is None:
        data_dict = dict()
    
    data_dict[userId] = face_embedding

    with open('faceEmbeddings.pkl','wb') as f:
        pickle.dump(data_dict,f)

def check_spoof(frame):
    image_bbox = model_test.get_bbox(frame)
    
    if image_bbox is None:
        print("No face detected")
        return False, 0
        
    prediction = np.zeros((1, 3))
    
    for model_name in os.listdir(model_dir):
        h_input, w_input, model_type, scale = parse_model_name(model_name)
        param = {
            "org_img": frame,
            "bbox": image_bbox,
            "scale": scale,
            "out_w": w_input,
            "out_h": h_input,
            "crop": True,
        }
        if scale is None:
            param["crop"] = False
        img = image_cropper.crop(**param)
        prediction += model_test.predict(img, os.path.join(model_dir, model_name))

    label = np.argmax(prediction)
    value = prediction[0][label]/2
    
    if label == 1:
        return True, value  
    else:
        return False, value 

def detect_person(image_path):
    with open("faceEmbeddings.pkl", "rb") as f:
        data = pickle.load(f)
    
    embeddings = list(data.values())
    class_names = list(data.keys())

    image = cv2.imread(image_path)
    is_real, _ = check_spoof(image)

    if is_real is None:
        print("No Face Detected")
        return -1

    if not is_real:
        print("Spoofing detected")
        return -2
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        print("No faces detected")
        return -1
    
    x, y, w, h = faces[0]
    face_img = image[y:y+h, x:x+w]
    face_img = cv2.resize(face_img, (160, 160))
    face_img = face_img.astype('float32') / 255.0
    face_img = np.expand_dims(face_img, axis=0)

    face_embedding = model.predict(face_img)[0]
    face_embedding = l2_normalizer.transform(np.expand_dims(face_embedding, axis=0))[0]

    highest_similarity = -float('inf')
    predicted_class_name = None
    for array, class_name in zip(embeddings, class_names):
        similarity = np.dot(face_embedding, array) / (np.linalg.norm(face_embedding) + np.linalg.norm(array))
        if similarity > highest_similarity:
            highest_similarity = similarity
            predicted_class_name = class_name

    return predicted_class_name