"""Genera src/components/avatar/parts.ts desde los dibujos de assets/svg/avatars.

Cada hoja tiene 4 figuras. Cada pieza se lleva al marco del avatar: la cabeza de 68 x 83
con su centro en (57, 41.5). Uso: python scripts/generateAvatarParts.py
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHEETS = ROOT / "assets" / "svg" / "avatars"
OUT = ROOT / "src" / "components" / "avatar" / "parts.ts"

NUM = r"-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?"
HAIR = "#22160E"
BEARD = "#411B10"
GLASSES = "#2F3432"


def tokens(d):
    return re.findall(r"[MLCHVZQS]|" + NUM, d)


def fmt(v):
    v = round(v, 2)
    return str(int(v)) if v == int(v) else ("%.2f" % v).rstrip("0").rstrip(".")


def points(d):
    cmd, out, toks, i = None, [], tokens(d), 0
    x = y = 0.0
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t
            out.append(t)
            i += 1
        elif cmd == "H":
            x = float(t); out.append(("x", x)); i += 1
        elif cmd == "V":
            y = float(t); out.append(("y", y)); i += 1
        else:
            x, y = float(t), float(toks[i + 1]); out.append(("p", x, y)); i += 2
    return out


def move(d, dx, dy):
    s = ""
    for p in points(d):
        if isinstance(p, str):
            s += p
            continue
        vals = [p[1] + dx] if p[0] == "x" else [p[1] + dy] if p[0] == "y" else [p[1] + dx, p[2] + dy]
        for v in vals:
            n = fmt(v)
            if s and not s[-1].isalpha() and not n.startswith("-"):
                s += " "
            s += n
    return s


def bbox(d):
    xs, ys, x, y = [], [], 0.0, 0.0
    for p in points(d):
        if isinstance(p, str):
            continue
        if p[0] == "x":
            x = p[1]
        elif p[0] == "y":
            y = p[1]
        else:
            x, y = p[1], p[2]
        xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def elements(path):
    src = re.sub(r"<mask.*?</mask>", "", path.read_text(encoding="utf-8"), flags=re.S)
    out = []
    for m in re.finditer(r"<path\b([^>]*)/?>", src):
        a = dict(re.findall(r'([\w-]+)="([^"]*)"', m.group(1)))
        if "mask" in a:
            a["outline"] = True
        out.append(a)
    return out


def figures(name):
    els = elements(SHEETS / name)
    heads = []
    for e in els:
        x0, y0, x1, y1 = bbox(e["d"])
        if abs(x1 - x0 - 68) < 0.6 and 82 < y1 - y0 < 83.6 and not e.get("outline"):
            if not heads or x0 - heads[-1][0] > 20:
                heads.append((x0, y0))
    figs = [{"dx": 23 - x0, "dy": -y0, "cx": x0 + 34, "els": []} for x0, y0 in heads]
    for e in els:
        if e.get("outline"):
            continue
        x0, _, x1, _ = bbox(e["d"])
        f = min(figs, key=lambda f: abs(f["cx"] - (x0 + x1) / 2))
        f["els"].append({**e, "d": move(e["d"], f["dx"], f["dy"])})
    return figs


girl1 = figures("girl/stylesGirl1.svg")
girl2 = figures("girl/stylesGirls2.svg")
boy1 = figures("boy/stylesBoy1.svg")
boy2 = figures("boy/stylesBoy2.svg")
boy3 = figures("boy/stylesBoy3.svg")
base = figures("base/skinTones.svg")[0]


def by_fill(fig, fill):
    return [e["d"] for e in fig["els"] if e.get("fill") == fill]


def hair(fig, i):
    return by_fill(fig, HAIR)[i]


# La hoja 3 de chicas (estilos con capas, flequillo recto, diadema y capucha) solo está en PNG:
# esas piezas se conservan de la versión anterior de parts.ts.
previous = OUT.read_text(encoding="utf-8")


def kept(record, key):
    block = re.search(r"export const " + record + r"[^{]*\{(.*?)\n\};", previous, re.S).group(1)
    return re.search(r"^\s+" + key + r': "([^"]*)",', block, re.M).group(1)


back = {
    "flip": hair(girl1[0], 0), "bob": hair(girl1[1], 0), "long": hair(girl1[2], 0), "wavy": hair(girl1[3], 0),
    "halfBun": hair(girl2[0], 0), "bun": hair(girl2[1], 0), "pixie": hair(girl2[2], 0), "curly": hair(girl2[3], 0),
    "layered": kept("BACK_HAIR", "layered"), "blunt": kept("BACK_HAIR", "blunt"),
    "straight": kept("BACK_HAIR", "straight"), "volume": kept("BACK_HAIR", "volume"),
    "classic": hair(boy1[0], 0), "sidePart": hair(boy1[1], 0), "fringe": hair(boy1[2], 0), "shortWaves": hair(boy1[3], 0),
    "spiky": hair(boy2[1], 0), "shaggy": hair(boy2[2], 0), "curtains": hair(boy2[3], 0),
    "quiff": hair(boy3[2], 0), "afro": hair(boy3[3], 0), "bald": "",
}
front = {
    "lock": hair(girl1[0], 1), "swept": hair(girl1[1], 1), "wispy": hair(girl1[2], 1), "middle": hair(girl1[3], 1),
    "full": hair(girl2[0], 1), "short": hair(girl2[2], 1),
    "straightCut": kept("FRONT_HAIR", "straightCut"), "choppy": kept("FRONT_HAIR", "choppy"), "sweep": kept("FRONT_HAIR", "sweep"),
    "tuft": hair(boy1[0], 1), "parted": hair(boy1[1], 1), "messyFringe": hair(boy1[2], 1), "waves": hair(boy1[3], 1),
    "spiky": hair(boy2[1], 1), "shaggy": hair(boy2[2], 1), "curtains": hair(boy2[3], 1),
    "sideFringe": hair(boy3[1], 1), "quiff": hair(boy3[2], 1), "curls": hair(boy3[3], 1),
}
beard = {
    "goatee": by_fill(boy2[0], BEARD)[0], "full": by_fill(boy3[0], BEARD)[0],
    "chinstrap": by_fill(boy3[2], BEARD)[0], "short": by_fill(boy3[3], BEARD)[0],
}

# Color de la prenda: "main" toma el color elegido, "shade" uno más oscuro y "light" uno más claro.
MAIN = {"#214185", "#19224F", "#027E7E", "#FD4D6B", "#438EAF", "#2A2686", "#A5A4FF"}
SKIP = {HAIR, BEARD, GLASSES}
HOOD_LIGHT = "#4C4AB0"


def clothes(fig):
    layers = []
    for e in fig["els"]:
        x0, y0, x1, y1 = bbox(e["d"])
        if y1 < 88 or e.get("fill") in SKIP or e.get("stroke") in ("black", GLASSES):
            continue
        if e.get("fill", "").startswith("#") and e["fill"] in {"#FFD5CD", "#FECD9C", "#E1AB79", "#A47A51"}:
            continue
        if "stroke" in e and "fill" not in e:
            layers.append({"d": e["d"], "stroke": "#FFFFFF" if e["stroke"] == "white" else e["stroke"]})
            continue
        fill = e["fill"]
        layer = {"d": e["d"], "fill": "main" if fill in MAIN else "light" if fill == HOOD_LIGHT else "#FFFFFF" if fill == "white" else fill}
        if fill == "#CBE1E5":
            layer["cover"] = True
        layers.append(layer)
    return layers


outfits = {
    "tee": clothes(girl1[0]), "tank": clothes(girl1[1]), "strap": clothes(girl1[2]), "vneck": clothes(girl1[3]),
    "shirt": clothes(boy1[0]), "tie": clothes(boy1[2]), "vneckWide": clothes(boy3[2]),
    "raglan": clothes(boy3[0]), "jersey": clothes(boy3[1]), "hoodie": clothes(boy3[3]), "crew": clothes(boy1[3]),
}
for sleeve in outfits["raglan"][1:]:
    sleeve["cover"] = 1.6
# Capucha de chica (girl/stylesGirls3, figura 4): la misma capucha sobre una polera blanca con escote en V,
# con la capucha más oscura que las mangas, como en su dibujo.
hood = [dict(l) for l in outfits["hoodie"][1:]]
for l in hood:
    if l.get("fill") == "light":
        l["fill"] = "shade"
outfits["hoodieLight"] = [{"d": outfits["vneck"][0]["d"], "fill": "#FFFFFF"}] + hood

def strokes(fig):
    return [e["d"] for e in fig["els"] if e.get("stroke") == GLASSES]


glasses = {"round": strokes(girl1[1])[0], "square": strokes(girl1[2])[0], "wide": strokes(girl1[3])[0]}

skin = [e for e in base["els"] if e.get("fill") in ("#FFD5CD", "#FA9983")]
ears = {}
for e in skin:
    x0, y0, x1, y1 = bbox(e["d"])
    if 30 < y0 < 40 and y1 < 56:
        side = "right" if x0 > 57 else "left"
        ears[side + ("Inner" if e["fill"] == "#FA9983" else "")] = e["d"]
ears = {k: ears[k] for k in ("right", "rightInner", "left", "leftInner")}


def earrings(fig, stroke=None, fill=None):
    found = [e["d"] for e in fig["els"] if (stroke and e.get("stroke") == stroke) or (fill and e.get("fill") == fill and bbox(e["d"])[1] > 45 and bbox(e["d"])[3] < 70)]
    return sorted(found, key=lambda d: bbox(d)[0])


earring_paths = {
    "hoops": earrings(girl1[0], fill="#FECD9C"),
    "small": earrings(girl1[1], fill="#A67D54"),
    "studs": earrings(girl1[3], stroke="#6D4116"),
}


def record(name, typ, obj):
    rows = "\n".join(f'  {k}: "{v}",' for k, v in obj.items())
    return f"export const {name}: Record<{typ}, string> = {{\n{rows}\n}};\n\n"


def layer_ts(l):
    parts = [f'd: "{l["d"]}"']
    if "fill" in l:
        parts.append(f'fill: "{l["fill"]}"')
    if "stroke" in l:
        parts.append(f'stroke: "{l["stroke"]}"')
    if "cover" in l:
        parts.append(f'cover: {"true" if l["cover"] is True else l["cover"]}')
    return "{ " + ", ".join(parts) + " }"


out = 'import type { Bangs, Earrings, FacialHair, Glasses, HairStyle, Outfit } from "../../types";\n\n'
out += "// Generado con scripts/generateAvatarParts.py desde assets/svg/avatars, en el marco de base/skinTones.svg\n"
out += "// (cabeza de 68 x 83 con centro en 57, 41.5). No editar a mano: cambiar el dibujo y volver a generar.\n\n"
out += "export interface OutfitLayer {\n  d: string;\n  fill?: \"main\" | \"shade\" | \"light\" | string;\n  stroke?: string;\n"
out += "  // Borde del mismo color que tapa la orilla de la capa de abajo (true = 1 unidad de grosor).\n  cover?: boolean | number;\n}\n\n"
out += record("BACK_HAIR", "HairStyle", back)
out += record("FRONT_HAIR", 'Exclude<Bangs, "none">', front)
out += record("BEARD_PATHS", 'Exclude<FacialHair, "none">', beard)
out += "export const OUTFIT_LAYERS: Record<Outfit, OutfitLayer[]> = {\n"
for k, ls in outfits.items():
    if k == "raglan":
        out += "  // Las mangas comparten el borde con la base: `cover` las agranda un poco para que no se vea una línea clara.\n"
    out += f"  {k}: [\n" + "".join(f"    {layer_ts(l)},\n" for l in ls) + "  ],\n"
out += "};\n\n"
out += record("GLASSES_PATHS", 'Exclude<Glasses, "none">', glasses)
headband = re.search(r'export const HEADBAND = "([^"]*)"', previous).group(1)
out += f'export const HEADBAND = "{headband}";\n\n'
out += "export const EARS = {\n" + "".join(f'  {k}: "{v}",\n' for k, v in ears.items()) + "};\n\n"
out += 'export const EARRING_PATHS: Record<Exclude<Earrings, "none">, [string, string]> = {\n'
for k, (a, b) in earring_paths.items():
    out += f'  {k}: [\n    "{a}",\n    "{b}",\n  ],\n'
out += "};\n"
OUT.write_text(out, encoding="utf-8", newline="\n")
print(f"{OUT.name}: {len(out)} bytes")
