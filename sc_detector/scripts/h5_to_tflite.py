import tensorflow as tf
from tensorflow import keras

model = keras.models.load_model('./sc_detector/artifacts/mn_model.h5')

# tf.saved_model.save(model, '../artifacts/mn_model')

# # # Convert the model.
# # converter = tf.lite.TFLiteConverter.from_keras_model(model)
# # tflite_model = converter.convert()

# # # Save the model.
# # with open('./sc_detector/artifacts/tflite/model.tflite', 'wb') as f:
# #   f.write(tflite_model)


import tf2onnx

model_proto, external_tensor_storage = tf2onnx.convert.from_keras(model)