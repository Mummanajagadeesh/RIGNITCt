import os
import pathlib # New module for robust path handling
from PIL import Image

def convert_jpegs_to_webp(quality=85):
    """
    Converts all JPEG images in the current directory to WebP format, 
    handling various case extensions (e.g., .JPG, .jpeg, .JPeG).

    :param quality: The compression quality for the WebP output (0-100).
    """
    # Define all possible JPEG extensions (case-insensitive checking below)
    JPEG_EXTENSIONS = ['.jpg', '.jpeg']
    
    # Use pathlib to get all items in the current directory
    current_dir = pathlib.Path('.')
    
    # Initialize the list of files to process
    jpeg_files = []

    # Iterate over all files in the current directory
    for item in current_dir.iterdir():
        if item.is_file():
            # Check if the file's extension (converted to lowercase) 
            # is in our list of JPEG extensions
            if item.suffix.lower() in JPEG_EXTENSIONS:
                jpeg_files.append(str(item))

    if not jpeg_files:
        print("❌ No JPEG images (.jpg, .JPG, .jpeg, etc.) found in the current directory.")
        return

    print(f"✅ Found {len(jpeg_files)} JPEG images to convert.")
    
    # --- Conversion Loop (unchanged) ---
    for input_file in jpeg_files:
        try:
            # 1. Open the image
            with Image.open(input_file) as img:
                
                # 2. Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # 3. Create the output filename
                base_name = os.path.splitext(input_file)[0]
                output_file = base_name + ".webp"
                
                # Check for existing WebP file
                if os.path.exists(output_file):
                    print(f"⏩ Skipping: {output_file} already exists.")
                    continue
                
                # 4. Save the image in WebP format
                img.save(output_file, 'webp', quality=quality)
                
                print(f"✨ Converted '{input_file}' to '{output_file}'")

        except Exception as e:
            print(f"🛑 Error converting {input_file}: {e}")
            
    print("\nConversion complete.")


# Run the function
convert_jpegs_to_webp(quality=90)