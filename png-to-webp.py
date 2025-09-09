import os
import subprocess
from PIL import Image

root_dir = "assets"

for subdir, _, files in os.walk(root_dir):
    for file in files:
        if file.lower().endswith(".webp"):
            file_path = os.path.join(subdir, file)
            output_path = os.path.splitext(file_path)[0] + ".webp"

            if os.path.exists(output_path):
                print(f"Already exists: {output_path}")
                continue

            try:
                if "assets/images/main" in file_path.replace("\\", "/"):
                    try:
                        subprocess.run(
                            ["ffmpeg", "-y", "-i", file_path, output_path],
                            check=True,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL
                        )
                        print(f"Animated PNG converted with ffmpeg: {file_path} -> {output_path}")
                    except subprocess.CalledProcessError:
                        print(f"FFmpeg failed, skipping: {file_path}")
                else:
                    with Image.open(file_path) as img:
                        img.save(output_path, "WEBP")
                    print(f"Static PNG converted: {file_path} -> {output_path}")

            except Exception as e:
                print(f"Failed to convert {file_path}: {e}")
