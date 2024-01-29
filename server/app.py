from flask import Flask, request, flash
from werkzeug.utils import secure_filename
import cv2
import os
import json 
import numpy as np

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'webp', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def processImage(filename, operation):
    print(f"the operation is {operation} and filename is {filename}")
    img = cv2.imread(f"uploads/{filename}")
    match operation:
        case "grayScale":
            imgProcessed = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            newFilename = f"static/{filename.split('.')[0]} cgray.jpeg"
            cv2.imwrite(newFilename, imgProcessed)
            return newFilename
        case "Kontras": 
            imgProcessed = np.ones(img.shape, dtype=np.uint8) * 60
            Kontras  = cv2.add(img, imgProcessed)
            newFilename = f"static/{filename.split('.')[0]} Kontras.jpeg"  
            cv2.imwrite(newFilename, Kontras)
            return newFilename
        case "brightness": 
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            hsv[:,:,2] = np.clip(hsv[:,:,2] * 1.5, 0, 255)
            adjusted_image = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
            newFilename = f"static/{filename.split('.')[0]} bring.jpeg"
            cv2.imwrite(newFilename, adjusted_image)
            return newFilename
        case "mirror": 
            flipp_image = cv2.flip(img, 1)
            newFilename = f"static/{filename.split('.')[0]} mirror.jpeg"
            cv2.imwrite(newFilename, flipp_image)
            return newFilename
        case "scalling": 
            Scalling_image = cv2.resize(img, (200,200))
            newFilename = f"static/{filename.split('.')[0]} scalling.jpeg"
            cv2.imwrite(newFilename, Scalling_image)
            return newFilename
        case "deteksi tepi": 
            tepi_image = cv2.Canny(img, 120, 205)
            newFilename = f"static/{filename.split('.')[0]} tepi.jpeg"
            cv2.imwrite(newFilename, tepi_image)
            return newFilename
        case "thresholding": 
            grayscale_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            _, thresholded_image = cv2.threshold(grayscale_image, 128, 255, cv2.THRESH_BINARY)
            newFilename = f"static/{filename.split('.')[0]} thresholding.jpeg"
            cv2.imwrite(newFilename, thresholded_image)
            return newFilename
        case "operasi Ketetanggaan": 
            blurred_image = cv2.GaussianBlur(img, (5, 5), 0)
            newFilename = f"static/{filename.split('.')[0]} Ketetanggaan.jpeg"
            cv2.imwrite(newFilename, blurred_image)
            return newFilename
        case "degradasi":
            kernel_size = 30 
            kernel_motion_blur = np.zeros((kernel_size, kernel_size))
            kernel_motion_blur[int((kernel_size-1)/2), :] = np.ones(kernel_size)
            kernel_motion_blur = kernel_motion_blur / kernel_size
            motion_blur_image = cv2.filter2D(img, -1, kernel_motion_blur)

            newFilename = f"static/{filename.split('.')[0]} degradasi.jpeg"
            cv2.imwrite(newFilename, motion_blur_image)
            return newFilename

@app.route("/")
def index():
    return 'helo world'

@app.route("/photo", methods=['POST'])
def barang():
    operation = request.form.get("operation")
    file = request.files['file']

    if file.filename == '':
        flash('No selected file')
        return "error no selected file"
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        new = processImage(filename, operation)
        x = {
            "fileloc": new,    
        }
        y = json.dumps(x)
        return y
       
    