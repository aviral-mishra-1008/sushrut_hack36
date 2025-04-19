import torch
import torchaudio
import numpy as np
from scipy.spatial.distance import euclidean
from transformers import Wav2Vec2Model, Wav2Vec2Processor
import pickle
import os

class Wav2Vec2FeatureExtractor:
    def __init__(self, model_name='facebook/wav2vec2-base', device='cpu'):
        self.device = device
        self.processor = Wav2Vec2Processor.from_pretrained(model_name)
        self.model = Wav2Vec2Model.from_pretrained(model_name).to(device)

    def load_audio(self, audio_path, target_sampling_rate=16000):
        waveform, sample_rate = torchaudio.load(audio_path)

        #We never work on stereo, just mono
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        if sample_rate != target_sampling_rate:
            resampler = torchaudio.transforms.Resample(sample_rate, target_sampling_rate)
            waveform = resampler(waveform)

        #Ensuring 1 dimentional audio
        waveform = waveform.squeeze()
        return waveform

    def generate_embedding(self,audio_path):
        waveform = self.load_audio(audio_path)
        inputs = self.processor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)

        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)

            #Casting the embeddings to unit hypersphere using L2 NORM for better results
            normalized_embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)

        return normalized_embeddings.squeeze().numpy()
    
    def save_embeddings(self,embedding,user_id,path="embeddings.pkl"):
        embedding_dict = None

        if os.path.exists(path):
            with open(path, 'rb') as f:
                embedding_dict = pickle.load(f)

        if embedding_dict is None:
            embedding_dict = dict()

        embedding_dict[user_id] = embedding
        with open(path, 'wb') as f:
            pickle.dump(embedding_dict, f)
        
    def tag_audio(self,audio_path,embedding_path="embeddings.pkl"):
        test_embedding = self.generate_embedding(audio_path)

        with open(embedding_path, 'rb') as f:
            embedding_dict = pickle.load(f)

        embeddings = list(embedding_dict.values())
        user_ids = list(embedding_dict.keys())

        match_id = None
        match_dist = float('inf')
        for i in range(len(embeddings)):
            embedding = embeddings[i]
            dist = euclidean(embedding, test_embedding)
            if dist<match_dist:
                match_dist = dist
                match_id = user_ids[i]

        return match_id, match_dist
    
    