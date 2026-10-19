import re
import unicodedata
from typing import Literal

Level = Literal["ok", "mild", "severe"]

# Los términos se escriben en minúsculas y sin tildes, igual que el texto normalizado.
SEVERE = [
    r"hijo de puta", r"hdp", r"putas?", r"putos?",
    r"(eres|sos|pinche|maldita|vieja) (una )?(perra|zorra)",
    r"maricas?", r"maricon(es)?", r"malparid[oa]s?", r"conchatumadre", r"concha de tu madre",
    r"te voy a matar", r"te mato", r"matate", r"suicidate", r"ojala te mueras", r"muerete",
    r"se donde vives", r"te voy a buscar",
    r"nudes?", r"pasa el pack", r"manda(me)? (el )?pack", r"fotos? desnud[oa]s?",
    r"manda(me)? fotos? (tuyas? )?sin ropa", r"chupame", r"chupamela", r"verga", r"follar",
]

MILD = [
    r"idiotas?", r"estupid[oa]s?", r"tont[oa]s?", r"imbecil(es)?", r"inutil(es)?",
    r"tarad[oa]s?", r"pendej[oa]s?", r"cabron(a|es)?", r"cojud[oa]s?", r"pelotud[oa]s?",
    r"retrasad[oa]s?", r"subnormal(es)?", r"callate", r"cierra la boca",
    r"nadie te pregunto", r"que aburrid[oa] eres", r"eres (muy )?(fe[oa]|gord[oa]|rar[oa])",
    r"das asco", r"me das asco",
]

LEET = str.maketrans({"0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s"})

_SEVERE = [re.compile(rf"\b{p}\b") for p in SEVERE]
_MILD = [re.compile(rf"\b{p}\b") for p in MILD]
_SEVERE_COMPACT = [p.replace(" ", "").replace("(", "").replace(")", "") for p in SEVERE if " " in p and "?" not in p and "|" not in p]

GENTLE_MESSAGE = "Este mensaje podría sentirse duro para la otra persona. ¿Quieres reformularlo?"
BLOCKED_MESSAGE = "Este mensaje no cuida a la otra persona, así que no lo enviamos. ¿Lo intentas de otra forma?"


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text.lower().translate(LEET))
    text = "".join(c for c in text if not unicodedata.combining(c))
    words = [re.sub(r"[^a-zñ]", "", w) for w in re.split(r"\s+", text)]
    words = [re.sub(r"(.)\1{2,}", r"\1", w) for w in words if w]
    return " ".join(_join_spelled(words))


def _join_spelled(words: list[str]) -> list[str]:
    result: list[str] = []
    run: list[str] = []
    for word in words + [""]:
        if len(word) == 1:
            run.append(word)
            continue
        if len(run) >= 3:
            result.append("".join(run))
        else:
            result.extend(run)
        run = []
        if word:
            result.append(word)
    return result


def classify(text: str) -> Level:
    clean = normalize(text)
    if any(p.search(clean) for p in _SEVERE):
        return "severe"
    compact = clean.replace(" ", "")
    if any(phrase in compact for phrase in _SEVERE_COMPACT):
        return "severe"
    if any(p.search(clean) for p in _MILD):
        return "mild"
    return "ok"
