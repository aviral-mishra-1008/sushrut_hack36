# AI_Service/test.py
from Touchless_Authentication_Module.auth import *
import os
from datetime import datetime

# Current timestamp in your format
def get_timestamp():
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

# Setup paths
# Get the current directory (AI_Service)
current_dir = os.getcwd()

USER_ID1 = "test_user1"
# Use absolute paths since we're in AI_Service folder
AUDIO_PATH1 = os.path.join(current_dir, "Temp", "test1.wav")
IMAGE_PATH1 = os.path.join(current_dir, "Temp", "test1.jpg")

USER_ID2 = "test_user2"
AUDIO_PATH2 = os.path.join(current_dir, "Temp", "test2.wav")
IMAGE_PATH2 = os.path.join(current_dir, "Temp", "test2.jpg")

# Print separator
def print_separator():
    print("-------------------------------------***********************------------------------------")

# Main authentication flow
print_separator()
print(f"\nCurrent Date and Time (UTC): {get_timestamp()}")
print(f"Current User's Login: aviral-mishra-1008")
print("\nAuthenticating..............\n")
print_separator()

# Debug print to verify paths
print(f"Audio path: {AUDIO_PATH1}")
print(f"Image path: {IMAGE_PATH1}")
print(f"Current directory: {current_dir}")

# Authenticate user
user = authenticate_user(AUDIO_PATH1, IMAGE_PATH1)

# Print results
print_separator()
print()
if user != -1:
    print(f"User {user} authenticated successfully!")
else:
    print("Authentication failed!")
print()
print_separator()