import os
import random
import staticmap
from PIL import Image

# where to save
save_dir = "satellite_dataset/images/train"
os.makedirs(save_dir, exist_ok=True)

# random coordinates (around big cities)
locations = [
    (40.7128, -74.0060),   # New York
    (28.6139, 77.2090),    # Delhi
    (34.0522, -118.2437),  # Los Angeles
    (48.8566, 2.3522),     # Paris
    (31.2304, 121.4737),   # Shanghai
    (35.6895, 139.6917),   # Tokyo
    (55.7558, 37.6173),    # Moscow
]

# download ~30 random map tiles
for i in range(1, 31):
    lat, lon = random.choice(locations)
    map_obj = staticmap.StaticMap(512, 512, url_template="https://tile.openstreetmap.org/{z}/{x}/{y}.png")
    map_img = map_obj.render(zoom=15, center=(lon, lat))

    filename = os.path.join(save_dir, f"sat_{i:03d}.png")
    map_img.save(filename)
    print(f"✅ Saved {filename}")

print("🎉 Download complete! Check satellite_dataset/images/train/")
