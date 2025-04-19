import os
import cv2
import numpy as np
import time
from src.anti_spoof_predict import AntiSpoofPredict
from src.generate_patches import CropImage
from src.utility import parse_model_name
import warnings
warnings.filterwarnings('ignore')

def check_image(image):
    height, width, channel = image.shape
    if width/height != 3/4:
        print("Image is not appropriate!!!\nHeight/Width should be 4/3.")
        return False
    else:
        return True

def main():
    model_dir = "./resources/anti_spoof_models"
    model_test = AntiSpoofPredict(0)  
    image_cropper = CropImage()
    
    cap = cv2.VideoCapture(0)
    
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 480) 
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 640) 

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error reading from webcam")
            break
            
        image_bbox = model_test.get_bbox(frame)
        
        if image_bbox is None:
            cv2.putText(
                frame,
                "No face detected",
                (20, 40),
                cv2.FONT_HERSHEY_COMPLEX, 0.5*frame.shape[0]/1024, (0, 0, 255)
            )
            cv2.imshow('Spoof Detection', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            continue

        prediction = np.zeros((1, 3))
        test_speed = 0
        
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
            start = time.time()
            prediction += model_test.predict(img, os.path.join(model_dir, model_name))
            test_speed += time.time()-start

        label = np.argmax(prediction)
        value = prediction[0][label]/2
        
        if label == 1:
            result_text = "Real Face Score: {:.2f}".format(value)
            color = (0, 255, 0)  
        else:
            result_text = "Fake Face Score: {:.2f}".format(value)
            color = (0, 0, 255)  
            
        fps_text = "FPS: {:.2f}".format(1/test_speed)
        
        cv2.rectangle(
            frame,
            (image_bbox[0], image_bbox[1]),
            (image_bbox[0] + image_bbox[2], image_bbox[1] + image_bbox[3]),
            color, 2)
        
        cv2.putText(
            frame,
            result_text,
            (image_bbox[0], image_bbox[1] - 5),
            cv2.FONT_HERSHEY_COMPLEX, 0.5*frame.shape[0]/1024, color
        )
        
        cv2.putText(
            frame,
            fps_text,
            (20, 40),
            cv2.FONT_HERSHEY_COMPLEX, 0.5*frame.shape[0]/1024, (255, 255, 255)
        )

        cv2.imshow('Spoof Detection', frame)        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()