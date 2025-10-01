from auth import *
import os

USER_ID1 = "test_user1"
AUDIO_PATH1 = os.path.join(os.getcwd(),"Temp","test1.wav")
IMAGE_PATH1 = os.path.join(os.getcwd(),"Temp","test1.jpg")

USER_ID2 = "test_user2"
AUDIO_PATH2 = os.path.join(os.getcwd(),"Temp","test2.wav")
IMAGE_PATH2 = os.path.join(os.getcwd(),"Temp","test2.jpg")

# register_user(AUDIO_PATH1, IMAGE_PATH1, USER_ID1)
# register_user(AUDIO_PATH2, IMAGE_PATH2, USER_ID2)

print("-------------------------------------***********************------------------------------")
print()
print("Authenticating..............")
print()
print("-------------------------------------***********************------------------------------")

user = authenticate_user(AUDIO_PATH1, IMAGE_PATH1)

print("-------------------------------------***********************------------------------------")
print()
if user!=-1:
    print(f"User {user} authenticated successfully!")
else:
    print("Authentication failed!")
print()
print("-------------------------------------***********************------------------------------")

