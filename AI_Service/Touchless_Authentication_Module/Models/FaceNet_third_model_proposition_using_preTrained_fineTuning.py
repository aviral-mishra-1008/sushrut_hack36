'''
It was observed that the hard truth is, inceptionV3 needs to be trained as well or fine tuned on face images
Also, the dataset to make model generalise needs to be larger, we thus tried to utilize the CASIA-WebFace 
database but processing such large neural networks on kaggle, colab and gpu we currently have is not feasible
or possible, we do plan to perform an inceptionV3 based network in future soon having possesed the compute

Thus we plan to perform transfer learning using the pre-trained model we have access to, we decided to fine tune
it using an Indian Face Dataset because ultimately it's audience will be our institute which has mostly Indians

The issue often pointed out for CASIA-Webface is that the its a little biased towards western white faces and
thus we hope to increase model's accuracy on indian faces by fine tuning it
'''

'''
Neccessary Files already in repo (except weights)
import gdown

file_id = '1hats6FkARnYAa6UP7evLtSuoVisb3Y4y'
gdown.download(f'https://drive.google.com/uc?id={file_id}', quiet=False)

file_id = '1GkwE8yrewsIIqGocxDFuMnSl0w2UUEPs'
gdown.download(f'https://drive.google.com/uc?id={file_id}', quiet=False)

!mkdir Models

file_id = '1BrddL8-Ltvjrh2HLOghx3tZBg5gTsnJ7'
gdown.download(f'https://drive.google.com/uc?id={file_id}', quiet=False)
'''

#FaceNet Using PreTrained Model

#Imports
import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import backend as K
from tensorflow.keras.models import Model, load_model
from tensorflow.keras import layers
from Models.pre_trained_model_setup import *
import keras


#Model Definition
class FaceNet_V2:
    
    def triplet_loss (self, y_true, y_pred):
        anchor_out = y_pred[:, 0:128]
        positive_out = y_pred[:, 128:256]
        negative_out = y_pred[:, 256:384]
        pos_dist = K.sum(K.abs(anchor_out-positive_out), axis=1)
        neg_dist = K.sum(K.abs(anchor_out - negative_out), axis=1)
        stacked_distances = K.stack([pos_dist, neg_dist], axis=0)
        probs = K.softmax(stacked_distances, axis=0)
        return K.mean(K.abs (probs [0]) + K.abs (1.0 - probs [1]))

    def __new__(self):
        model = FaceNet()
        for layer in model.layers:
            if(layer.name=='AvgPool'):
                break
            layer.trainable = False
        triplet_model_a = layers.Input((160, 160, 3))
        triplet_model_p = layers.Input((160, 160, 3))
        triplet_model_n = layers.Input((160, 160, 3))
        triplet_model_out = layers.Concatenate()([model (triplet_model_a), model (triplet_model_p), model(triplet_model_n)])
        triplet_model = Model( [triplet_model_a, triplet_model_p, triplet_model_n], triplet_model_out)

        return triplet_model

class Embed_model:

    def triplet_loss(self,y_true, y_pred):
        y_pred = K.l2_normalize(y_pred, axis=0)
        anchor_out = y_pred[:, 0:128]
        positive_out = y_pred[:, 128:256]
        negative_out = y_pred[:, 256:384]
        pos_dist = K.sum(K.abs(anchor_out-positive_out), axis=1)
        neg_dist = K.sum(K.abs(anchor_out - negative_out), axis=1)
        stacked_distances = K.stack([pos_dist, neg_dist], axis=0)
        probs = K.softmax(stacked_distances, axis=0)
        return K.mean(K.abs (probs [0]) + K.abs (1.0 - probs [1]))
    
    def __new__(self,summary=False):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(root_dir, 'FaceNet_TL_ep10')
        model = load_model(model_path,custom_objects={'triplet_loss': self.triplet_loss}) #specify path to folder having SavedModel File
        single_image_input = layers.Input(shape=(160, 160, 3), name='single_image_input')
        embedding_output = model.layers[3](single_image_input)
        inference_model = Model(inputs = single_image_input, outputs = embedding_output)
        inference_model.set_weights(model.get_weights())

        if(summary):
            print(model.summary())
        
        return inference_model
    
class parameters:
    def __init__(self,lr_rate=0.0005, wt_decay=0.1, epochs=10, st_pr_epoch = 84):
        self.lr_rate = lr_rate
        self.wt_decay = wt_decay
        self.epochs = epochs
        self.sr_pr_epoch = st_pr_epoch
    
    def optimizer(self):
        optimizer = keras.optimizers.Adam(learning_rate=self.lr_rate, weight_decay=self.wt_decay)
        return optimizer

