import tensorflow as tf
from keras.models import load_model
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array

model = tf.keras.models.load_model('./models/my_model.h5', compile=False)

def process_image(image):
    '''
    Make an image ready-to-use by the model
    '''
    # convert the image pixels to a numpy array
    image = img_to_array(image)
    # reshape data for the model
    image = image.reshape((-1, 28, 28, 3))

    return image

def predict_class(image):
    '''
    Predict and render the class of a given image 
    '''
    # predict the probability across all output classes
    yhat = model.predict(image)
    # convert the probabilities to class labels
    label = decode_predictions(yhat)
    # retrieve the most likely result, e.g. highest probability
    label = label[0][0]
    # return the classification
    prediction = label[1]
    percentage = '%.2f%%' % (label[2]*100)

    return prediction, percentage

if __name__ == '__main__':
    ''' for test'''
    # load an image from file
    image = load_img('../image1.jpg', target_size=(224, 224))
    image = process_image(image)
    prediction, percentage = predict_class(image)
    # write scores to a file
    with open("metrics.txt", "w") as f:
        f.write("Predicted Class: %2.2f%%\n" % prediction)
        f.write("Test accuracy score: %2.2f%%\n" % test_score)
    print(prediction, percentage)
