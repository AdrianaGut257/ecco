"""Separa assets/svg/background/background3.svg en capas animables (src/components/layout/homeParts.ts).

Uso: python scripts/generateHomeParts.py .
"""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
svg = (root / "assets/svg/background/background3.svg").read_text(encoding="utf-8")
body = re.search(r'<g clip-path="url\(#clip0[^"]*\)">(.*?)</g>\s*<defs>', svg, re.S).group(1)
elements = re.findall(r"<(?:path|ellipse)\b[^>]*/>", body)
gradient = re.search(r"<linearGradient.*?</linearGradient>", svg, re.S).group(0)


def pick(pred):
    found = [e for e in elements if pred(e)]
    assert found, "falta una pieza del dibujo"
    return found


def first_x(e):
    return float(re.search(r'(?:d="M|cx=")(-?[\d.]+)', e).group(1))


mountain = pick(lambda e: 'fill="#B2D37A"' in e)[0]
tree = pick(lambda e: "<ellipse" in e or 'fill="black"' in e)
grass = sorted(pick(lambda e: 'fill="#80B24A"' in e), key=first_x)
clouds = sorted(pick(lambda e: 'fill="white"' in e), key=first_x)
strip = pick(lambda e: 'fill="#B1CB56"' in e)[0]
ground = pick(lambda e: "url(#paint0" in e)[0]

# La montaña se extiende 45 unidades más allá de cada borde: al moverse de lado no deja huecos.
edge = "0 102.317V244H495V132.856"
assert edge in mountain
mountain = mountain.replace(edge, "0 102.317L-45 96V244H540V134L495 132.856")
grad = gradient.replace(re.search(r'id="([^"]+)"', gradient).group(1), "homeGroundFill")
ground = re.sub(r"url\(#[^)]+\)", "url(#homeGroundFill)", ground)

parts = {
    "cloudLeft": clouds[0],
    "cloudRight": clouds[1],
    "mountain": mountain,
    "tree": "".join(tree),
    "grassLeft": grass[0],
    "grassRight": grass[1],
    "ground": f"<defs>{grad}</defs>{strip}{ground}",
}

out = [
    "// Generado con scripts/generateHomeParts.py desde assets/svg/background/background3.svg (495 × 996).",
    "// Si cambia el dibujo, hay que regenerarlo.",
    "export const HOME_VIEW = { w: 495, h: 996 };",
    "// Cielo: rectángulo del dibujo (los primeros 245 de alto).",
    'export const HOME_SKY = { color: "#FFFCCE", h: 245 };',
    "// Donde empieza el suelo: tapa la base de la montaña y de la hierba.",
    "export const HOME_GROUND = 215;",
    "// Base de cada mata de hierba (desde ahí se mece).",
    "export const HOME_GRASS_ROOTS = { left: { x: 64, y: 221 }, right: { x: 430, y: 224 } };",
    "",
    "export const HOME_PARTS = " + json.dumps(parts, indent=2, ensure_ascii=False) + ";",
    "",
]
(root / "src/components/layout/homeParts.ts").write_text("\n".join(out), encoding="utf-8", newline="\n")
print("ok", {k: len(v) for k, v in parts.items()})
