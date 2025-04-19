'''THIS CODE IS TO DOWNLOAD NECESSARY ITEMS'''
# from google.colab import drive
# drive.mount('/content/drive')

# !cp '/content/drive/MyDrive/FaceNet David/facenet_keras_weights.h5' /content
# drive.flush_and_unmount()

'''We thank David Sandberg and Nyoki for their awesome contribution to the open source community, for coming up with a facenet implementation to enable us to make this project with so our existing compute power, additionally we thank Gauravesh for the weights and architecture file organised in his repo'''
'''
https://github.com/davidsandberg/facenet
https://github.com/nyoki-mtl/keras-facenet?tab=readme-ov-file
https://github.com/gauravesh/Face-recognition-Using-Facenet-On-Tensorflow-in_colab
'''

'''
Additionally on request by David Sandberg
We thank Casia-Webface and VGG Face2 for providing awesome databases for processing
'''


class FaceNet:
  def __new__(self,summary=False):
    from pre_trained_model_architecture import InceptionResNetV2
    facenet = InceptionResNetV2()
    facenet.load_weights('facenet_keras_weights.h5')
    if summary:
      print(facenet.summary())
    return facenet
