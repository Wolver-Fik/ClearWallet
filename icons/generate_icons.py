"""Genera los PNG de ClearWallet con Pillow a partir de icons/icon.svg.

Uso:  python icons/generate_icons.py
Billetera geometrica con flujo financiero ascendente y degradido
cian -> azul (#06B6D4 -> #3B82F6), dibujado a 4x y reducido con LANCZOS.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
SCALE = 32  # 64 unidades de viewBox -> 2048 px de master
N = 64 * SCALE
BG = (7, 10, 16, 255)        # #070A10
CYAN = (6, 182, 212, 255)    # #06B6D4
BLUE = (59, 130, 246, 255)   # #3B82F6


def px(v):
    return int(round(v * SCALE))


def box(*values):
    return tuple(px(v) for v in values)


def gradient(diagonal=True):
    n = 256
    data = bytearray()
    for y in range(n):
        for x in range(n):
            t = (x + y) / (2 * (n - 1)) if diagonal else x / (n - 1)
            data.append(int(t * 255 + 0.5))
    ramp = Image.frombytes("L", (n, n), bytes(data)).resize((N, N), Image.Resampling.BICUBIC)
    return Image.composite(Image.new("RGBA", (N, N), BLUE), Image.new("RGBA", (N, N), CYAN), ramp)


def apply(mask, opacity=1.0):
    if opacity != 1.0:
        mask = mask.point(lambda v: int(v * opacity))
    layer = gradient()
    layer.putalpha(mask)
    return layer


def stroke(draw, points, width, fill=255):
    xy = [(px(x), px(y)) for x, y in points]
    draw.line(xy, fill=fill, width=px(width), joint="curve")
    r = px(width) / 2
    for x, y in (points[0], points[-1]):
        draw.ellipse((px(x) - int(r), px(y) - int(r), px(x) + int(r), px(y) + int(r)), fill=fill)


def artwork():
    image = Image.new("RGBA", (N, N), BG)

    halo = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    ImageDraw.Draw(halo).ellipse(box(4, 6, 60, 60), fill=(*CYAN[:3], 52))
    image = Image.alpha_composite(image, halo.filter(ImageFilter.GaussianBlur(N * 0.06)))

    rim = Image.new("L", (N, N), 0)
    ImageDraw.Draw(rim).rounded_rectangle(box(0.5, 0.5, 63.5, 63.5), radius=px(13.5), outline=255, width=px(1))
    image = Image.alpha_composite(image, apply(rim, 0.4))

    mask = Image.new("L", (N, N), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(box(8, 18, 56, 50), radius=px(8), outline=255, width=px(4))
    stroke(d, [(8, 28), (56, 28)], 3, 140)
    d.rounded_rectangle(box(14, 35, 25, 43), radius=px(2), outline=255, width=px(2.6))
    stroke(d, [(20, 45), (29, 37), (36, 40), (48, 26)], 4)
    stroke(d, [(41, 24), (48, 24), (48, 31)], 4)
    return Image.alpha_composite(image, apply(mask))


def main():
    master = artwork()
    for size in (180, 192, 512):
        path = HERE / f"icon-{size}.png"
        master.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)
        print(f"wrote {path.name} ({size}x{size})")


if __name__ == "__main__":
    main()
