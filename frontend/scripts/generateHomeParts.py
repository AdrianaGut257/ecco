"""Separa assets/svg/background/home.svg en capas animables (src/components/layout/homeParts.ts). Uso: python scripts/generateHomeParts.py ."""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
svg = (root / "assets/svg/background/home.svg").read_text(encoding="utf-8")

paths = re.findall(r'<path d="([^"]+)"([^>]*)/>', svg)
masks = re.findall(r'<mask id="([^"]+)"[^>]*>\s*<path d="([^"]+)"', svg)
groups = re.findall(r'<g mask="url\(#([^)]+)\)">(.*?)</g>', svg, re.S)
gradient = re.search(r"<linearGradient.*?</linearGradient>", svg, re.S).group(0)

back = next(d for d, a in paths if 'fill="#B2D37A"' in a)
front = next(d for d, a in paths if "url(#paint0" in a)


def bush(i, cid):
    mask_id, mask_d = masks[i]
    body = next(g for mid, g in groups if mid == mask_id).strip()
    return f'<clipPath id="{cid}"><path d="{mask_d}"/></clipPath><g clip-path="url(#{cid})">{body}</g>'


# Las colinas se extienden 45 unidades más allá de cada borde: al moverse de lado no dejan huecos.
assert "0 48.3166V190H495V78.8561" in back and "0 182.5V996H495V182.5" in front
back = back.replace("0 48.3166V190H495V78.8561", "0 48.3166L-45 44V190H540V80L495 78.8561")
front = front.replace("0 182.5V996H495V182.5", "0 182.5L-45 188V996H540V188L495 182.5")
grad = gradient.replace("paint0_linear_323_2293", "homeFrontFill")
parts = {
    "backHill": f'<path d="{back}" fill="#B2D37A"/>',
    "bushLeft": bush(0, "homeBushL"),
    "bushRight": bush(1, "homeBushR"),
    "frontHill": f'<defs>{grad}</defs><path d="{front}" fill="url(#homeFrontFill)"/>',
}

out = [
    "// Generado desde assets/svg/background/home.svg (495 × 996). Si cambia el dibujo, hay que regenerarlo.",
    "export const HOME_VIEW = { w: 495, h: 996 };",
    "// Cielo: rectángulo del dibujo (los primeros 245 de alto).",
    'export const HOME_SKY = { color: "#FFFCCE", h: 245 };',
    "// Base de la colina de atrás (desde ahí se estira) y de cada arbusto (desde ahí se mecen).",
    "export const HOME_BACK_BASE = 190;",
    "export const HOME_BUSH_ROOTS = { left: { x: 110, y: 180 }, right: { x: 374, y: 180 } };",
    "",
    "export const HOME_PARTS = " + json.dumps(parts, indent=2, ensure_ascii=False) + ";",
    "",
]
(root / "src/components/layout/homeParts.ts").write_text("\n".join(out), encoding="utf-8")
print("ok", {k: len(v) for k, v in parts.items()})
