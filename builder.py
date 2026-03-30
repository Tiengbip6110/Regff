import re
import os
import requests
import base64
from io import BytesIO
from PIL import Image

with open("target_website.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("target_style.css", "r", encoding="utf-8") as f:
    style_css = f.read()

with open("target_gift.css", "r", encoding="utf-8") as f:
    gift_css = f.read()

with open("target_script.js", "r", encoding="utf-8") as f:
    script_js = f.read()

with open("target_gift.js", "r", encoding="utf-8") as f:
    gift_js = f.read()

# Get Vercel base64 images
b64_images = []
for i in range(1, 21):
    url = f"https://gift-birthdayv4.vercel.app/style/img/Anh%20({i}).jpg"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            content_type = response.headers.get('content-type', 'image/jpeg')
            img = Image.open(BytesIO(response.content))
            img.thumbnail((300, 300), Image.Resampling.LANCZOS)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=60)
            b64 = f"data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode('utf-8')
            b64_images.append(b64)
        else:
            print(f"Failed to fetch {url}")
            b64_images.append("")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        b64_images.append("")

js_images_array = "[\n" + ",\n".join([f"'{b64}'" for b64 in b64_images]) + "\n]"

script_js_replacement = r"""
    const imagesArray = """ + js_images_array + r""";
    for (let i = 1; i <= 20; i++) {
        const img = document.createElement('img');
        img.src = imagesArray[i - 1];
        img.alt = `Birthday Image ${i}`;
        if (i === 1) img.classList.add('active');
        imageContainer.appendChild(img);
    }
"""

script_js = re.sub(
    r"for\s*\(\s*let\s+i\s*=\s*1\s*;\s*i\s*<=\s*20\s*;\s*i\+\+\s*\)\s*\{[\s\S]*?imageContainer\.appendChild\(img\);\s*\}",
    script_js_replacement,
    script_js
)

gift_js = re.sub(r'const IMGS = Array\.from\([^;]+\);', f"const IMGS = {js_images_array};", gift_js)


# Fix the malformed img tag I fixed earlier
html = html.replace('<img id="mewmew" src="./style/img/mewmew.gif" alt="" />', '<img id="mewmew" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />')

# Replace resources
html = html.replace('<link rel="stylesheet" href="./style/style.css">', f"<style>\n{style_css}\n</style>")
html = html.replace('<link rel="stylesheet" href="./style/gift.css">', f"<style>\n{gift_css}\n</style>")
html = html.replace('<script src="./style/script.js"></script>', f"<script>\n{script_js}\n</script>")
html = html.replace('<script src="./style/gift.js"></script>', f"<script>\n{gift_js}\n</script>")

# Fix other base64 resources
star_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAGtJREFUOE/tlNENgDAMAy+T0WiUjMIoHkKj8Bih8KjP1Lw4VapKlcqv49vOsiwRsTzYgZ3YgR14ETnnnHMQEQEAuPe/B3rvAXB3AAAzw8yq51yIiMDM8F5BRESccwAA3vve+yL+YweeuwM/sT9sL2rM7AAAAABJRU5ErkJggg=="
mail_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAgBJREFUeJztm01uwyAQhb+XqGv3vkzPU/Rcd9WlB0gU2zKCMX+z8x5JCCHMjGeB4RkURVEURVEURVEURVGU/5C2bXtv/VwP8AAe1v3O+wZ8Aru1N2Bv/Qh8Aydg1eWf6wE6tQJ2wB14ASvN5tMceLq/X4CvKkM7NQIe4Q9z3+bA21x66y24E9D0l3j4K/AE3IB34A68Aw/gFfgAPoEv4Av4Bv6Af+AP+Af+gH/gD/gH/oB/4A/4B/6AP+Af+AP+gT/gH/gD/oE/4B/4A/6BP+Af+AP+gT/oGzD0/33X7/x91+98L8CeQ6sVsANuwAtYaTaf5sDT/f0CfFUZ2qkR8Ah/mPs2B97m0ltvwZ2Apr/Ew1+BJ+AGvAN34B14AK/AB/AJfAFfwDfwB/wDf8A/8Af8A3/AP/AH/AN/wD/wB/wDf8A/8Af8A3/AP/AH/AN/wD/wB/wDf8A/8Af8A3/QN2Do//uu3/n7rt/5XoA9h1YrYAfcgBew0mw+zYGn+/sF+KoytFMj4BH+MPdtDrzNpbfegjsBTX+Jh78CT8ANeAfuwDvwAF6BD+AT+AK+gG/gD/gH/oB/4A/4B/6Af+AP+Af+gH/gD/gH/oB/4A/4B/6Af+AP+Af+gH/gD/gH/oB/4A/6Bgz9f9/1O3/f9TvfC7Dn0GoF7IAb8AJWms2nOfB0f78AX1WGdmoEPMIf5r7Ngbe59NZbcCeg6S/x8FfgCbgB78AduAMP4BX4AD6BL+AL+Ab+gH/gD/gH/oB/4A/4B/6Af+AP+Af+gH/gD/gH/oB/4A/4B/6Af+AP+Af+gH/gD/gH/qBvwND/912/8/ddv/O9AHsOrVbADrgBL2Cl2XyaA0/39wvwVWVop0bAI/xh7tsceJtLb70FdwKa/hIPfwWegBvwDtyBd+ABvAIfwCfwBXwD38Af8A/8Af/AH/AP/AH/wB/wD/wB/8Af8A/8Af/AH/AP/AH/wB/wD/wB/8Af8A/8Af/AH/AP/EHfgKH/77t+5++7fud7AfYcWq2AHXADXsBKs/k0B57u7xfgq8rQTo2AR/jD3Lc58DaX3noL7gQ0/SUe/go8ATfgHbgD78ADeAU+gE/gC/gGvoE/4B/4A/6BP+Af+AP+gT/gH/gD/oE/4B/4A/6BP+Af+AP+gT/gH/gD/oE/4B/4A/6BP+gbMPT/fdfv/H3X73wvwJ5DqxWwA27AC1hpNp/mwNP9/QJ8VRnaqRHwCH+Y+zYH3ubSW2/BnYCmv8TDX4En4Aa8A3fgHXgAr8AH8Al8AV/AN/AH/AN/wD/wB/wD/8Af8A/8Af/AH/AP/AH/wB/wD/wB/8Af8A/8Af/AH/AP/AH/wB/wD/xB34Ch/++7fufvu37n/wD411I2+aWpMAAAAABJRU5ErkJggg=="
star_gif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
mewmew_gif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

html = html.replace('./style/material/star.png', star_b64)
html = html.replace('./style/img/star.gif', star_gif)
html = html.replace('./style/img/mail.png', mail_b64)
html = html.replace('./style/nhac.mp3', 'In Love x Có Đôi Điều.mp3')

with open("snvvn.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"Created snvvn.html")
print(f"Size: {os.path.getsize('snvvn.html') / (1024*1024):.2f} MB")
