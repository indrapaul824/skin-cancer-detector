import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

model = load_model('./models/my_model.h5')

def process_image(image):
    '''
    Make an image ready-to-use by the model
    '''
    # convert the image pixels to a numpy array
    image = img_to_array(image)
    print(image.shape)
    # reshape data for the model
    image = image.reshape((-1, 28, 28, 3))
    print(image.shape)

    return image

def decode_predictions(label):
    cancer = ['akiec','df','bkl','mel','nv','vasc','bcc']
    return cancer[label]

def predict_class(image):
    '''
    Predict and render the class of a given image 
    '''
    # predict the probability across all output classes
    yhat = model.predict(image)
    # convert the probabilities to class labels with highest probability
    label = np.argmax(yhat, axis = 1)
    # return the classification
    prediction = decode_predictions(label)

    return prediction

if __name__ == '__main__':
    ''' for test'''
    # load an image from file
    image = load_img('reports/image1.jpg', target_size=(224, 224))
    image = process_image(image)
    prediction = predict_class(image)
    # write scores to a file
    #with open("reports/metrics.txt", "w") as f:
    #    f.write("Predicted Class: %2.2f%%\n" % prediction)
    print(prediction)
