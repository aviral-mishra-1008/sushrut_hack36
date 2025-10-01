from Wav2Vec2 import *

model = Wav2Vec2FeatureExtractor()

embedding1 = model.generate_embedding(os.path.join(os.getcwd(),"S1_Audio","Sample_audio","Recording.wav"))
model.save_embeddings(embedding1, "User1")

embedding2 = model.generate_embedding(os.path.join(os.getcwd(),"S1_Audio","Sample_audio","Recording (3).wav"))
model.save_embeddings(embedding2, "User2")

userId, _ = model.tag_audio(os.path.join(os.getcwd(),"1S_Audio","Sample_audio","Recording (2).wav"))
print(userId)

'''
    Output: User1
    
'''