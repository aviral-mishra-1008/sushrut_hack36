from S1_Audio.Wav2Vec2 import *

model = Wav2Vec2FeatureExtractor()

def make_audio_embedding(audio_path,userID):
    embedding = model.generate_embedding(audio_path)
    model.save_embeddings(embedding,userID)
    print("Embedding Saved!")

def detect_audio(audio_path):
    userId, _ = model.tag_audio(audio_path)
    return userId