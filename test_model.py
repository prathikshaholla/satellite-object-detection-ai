from ultralytics import YOLO

# Load model
model = YOLO("yolov8n.pt")  

# Run prediction on an image
results = model("https://ultralytics.com/images/bus.jpg")

# YOLOv8 returns a list, so get the first result
results[0].plot()  # returns an image with boxes drawn

# If you want to show it using OpenCV
import cv2

img = results[0].plot()  # get numpy image
cv2.imshow("YOLOv8 Detection", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
