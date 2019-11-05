import os
from PIL import Image

new_width = 400
new_height = 600

filenames = os.listdir('original')

for f in filenames:
    if '.jpg' in f:
        im = Image.open('original/' + f)
        width, height = im.size   # Get dimensions
        if(width < new_width):
            new_width = width
        if(height < new_height):
            new_height = height

for f in filenames:
    if '.jpg' in f:
        print(f)
        im = Image.open('original/' + f)
        width, height = im.size   # Get dimensions

        left = (width - new_width)/2
        top = (height - new_height)/2
        right = (width + new_width)/2
        bottom = (height + new_height)/2

        # Crop the center of the image
        im = im.crop((left, top, right, bottom))
        print(im.size)

        bg = Image.new('RGB', (new_width, new_height), (255, 255, 255))
        bg.paste(im, (0, 0))
        bg.save(f.split('.jpg')[0] + '.png')
