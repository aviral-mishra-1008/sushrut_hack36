from tensorflow.keras import layers
from tensorflow.keras.models import Model
from tensorflow.keras.applications.inception_v3 import InceptionV3
from keras.models import load_model
from tensorflow.keras import backend as K

class FaceNet_Model:

    input_shape = (224,224,3)

    def triplet_loss (self, y_true, y_pred):
        anchor_out = y_pred[:, 0:128]
        positive_out = y_pred[:, 128:256]
        negative_out = y_pred[:, 256:384]
        pos_dist = K.sum(K.abs(anchor_out-positive_out), axis=1)
        neg_dist = K.sum(K.abs(anchor_out - negative_out), axis=1)
        stacked_distances = K.stack([pos_dist, neg_dist], axis=0)
        probs = K.softmax(stacked_distances, axis=0)
        return K.mean(K.abs (probs [0]) + K.abs (1.0 - probs [1]))

    def facenet(self):

        #This FaceNet Implementation using Inception_V3
        input_layer = layers.Input(shape=self.input_shape)
        inception = InceptionV3(weights='imagenet', include_top=False)
        feature_extractor = inception(input_layer)
        for layer in inception.layers:
            layer.trainable = False
        gap_layer = layers.GlobalAveragePooling2D()(feature_extractor)
        dropout_layer = layers.Dropout(rate=0.2,seed=82)(gap_layer)
        fc_layer = layers.Dense(128, activation='relu')(dropout_layer)
        batchNorm = layers.BatchNormalization()(fc_layer)
        model = Model(inputs=input_layer, outputs=batchNorm)

        #Triplet model for training the weights
        triplet_model_a = layers.Input((224, 224, 3))
        triplet_model_p = layers.Input((224, 224, 3))
        triplet_model_n = layers.Input((224, 224, 3))
        triplet_model_out = layers.Concatenate()([model (triplet_model_a), model (triplet_model_p), model(triplet_model_n)])
        triplet_model = Model( [triplet_model_a, triplet_model_p, triplet_model_n], triplet_model_out)

        return triplet_model

class Inference_Model:

    #Inference Model to be used for prediction (not to train)

    def inference(self):
        facenet = FaceNet_Model()
        model = load_model('path_to_savedModel_file', custom_objects={'triplet_loss': facenet.triplet_loss}) #Triplet loss file is on main model pipeline
        single_image_input = layers.Input(shape=(224, 224, 3), name='single_image_input')
        embedding_output = model.layers[3](single_image_input)
        inference_model = Model(inputs = single_image_input, outputs = embedding_output)
        inference_model.set_weights(model.get_weights())

