import os

folders = [
    "satellite_dataset/images/train",
    "satellite_dataset/images/val",
    "satellite_dataset/labels/train",
    "satellite_dataset/labels/val"
]

for f in folders:
    os.makedirs(f, exist_ok=True)

print("✅ Folder structure ready!")
