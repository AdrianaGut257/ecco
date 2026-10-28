"""Genera los sonidos de ECHOOM (sintetizados, sin muestras de terceros). Uso: python scripts/generateSounds.py assets/sounds"""
import sys, wave
from pathlib import Path
import numpy as np

SR = 32000
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def hz(note):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    n, octave = note[:-1], int(note[-1])
    semis = names[n[0]] + (1 if "#" in n else 0) + (octave - 4) * 12
    return 440 * 2 ** (semis / 12)


def buf(seconds):
    return np.zeros(int(SR * seconds))


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    a = np.sin(a * np.pi / 2) ** 2
    return a * np.exp(-t / decay)


def place(out, sig, at, gain=1.0):
    i = int(at * SR)
    end = min(len(out), i + len(sig))
    out[i:end] += sig[: end - i] * gain


def pluck(f, dur=0.9, decay=0.28, bright=0.35):
    """Kalimba/marimba suave: fundamental + parciales que se apagan antes."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * env(n, 0.004, decay)
    s += 0.5 * np.sin(2 * np.pi * f * 2 * t) * env(n, 0.003, decay * 0.45)
    if f * 5.9 < 15000:
        s += bright * 0.25 * np.sin(2 * np.pi * f * 5.9 * t) * env(n, 0.002, decay * 0.12)
    return s


def bell(f, dur=3.0, decay=1.1, attack=0.03):
    """Campana tipo cuenco: parciales inarmónicos con caída larga."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, d in [(1, 1, 1), (2.0, 0.35, 0.6), (2.76, 0.18, 0.4), (5.4, 0.06, 0.15)]:
        if f * ratio < 15000:
            s += amp * np.sin(2 * np.pi * f * ratio * t + ratio) * env(n, attack, decay * d)
    # Leve vibrato de batido, como un cuenco real.
    return s * (1 + 0.04 * np.sin(2 * np.pi * 3.2 * t))


def pop(f0, f1, dur=0.12):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** 0.6
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * env(n, 0.003, dur * 0.35)


def shimmer(out, at, notes, gap=0.05, gain=0.18):
    for i, note in enumerate(notes):
        place(out, pluck(hz(note), 0.5, 0.12, bright=0.1), at + i * gap, gain)


def reverb(x, size=0.35, mix=0.18):
    n = int(SR * size)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (size / 5))
    # Pasa bajos sencillo para que la cola sea cálida.
    ir = np.convolve(ir, np.ones(12) / 12, mode="same")
    ir /= np.sqrt(np.sum(ir**2))
    wet = np.convolve(x, ir)[: len(x)]
    return x + mix * wet


def save(name, x, peak):
    x = reverb(x)
    fade = int(SR * 0.04)
    x[-fade:] *= np.linspace(1, 0, fade)
    x = x / np.max(np.abs(x)) * peak
    data = (x * 32767).astype(np.int16)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"{name:14s} {len(x) / SR:.2f}s")


# Planta: dos notas que suben y un destello.
x = buf(1.1)
place(x, pluck(hz("G5")), 0)
place(x, pluck(hz("C6")), 0.09)
shimmer(x, 0.2, ["E7", "G7", "C8"], gap=0.06)
save("grow", x, 0.6)

# Florecer: arpegio cálido sobre un acorde suave y destellos.
x = buf(2.4)
for note in ["C4", "E4", "G4"]:
    place(x, bell(hz(note), 2.4, 0.9, attack=0.08), 0, 0.25)
for i, note in enumerate(["C5", "E5", "G5", "C6", "E6"]):
    place(x, pluck(hz(note), 1.4, 0.4), 0.05 + i * 0.09, 0.8)
shimmer(x, 0.55, ["G7", "C8", "E7", "G7"], gap=0.07)
save("bloom", x, 0.6)

# Encontraron pareja: dos notas que se responden.
x = buf(1.3)
place(x, pluck(hz("E5"), 1.0, 0.35), 0)
place(x, pluck(hz("A5"), 1.0, 0.4), 0.13)
shimmer(x, 0.3, ["E7", "A7"], gap=0.07, gain=0.14)
save("match", x, 0.6)

# Mensajes y reacciones: breves y discretos.
x = buf(0.32)
place(x, pop(420, 880, 0.13), 0)
save("send", x, 0.42)

x = buf(0.75)
place(x, pluck(hz("G5"), 0.6, 0.18), 0)
place(x, pluck(hz("C6"), 0.6, 0.22), 0.1)
save("receive", x, 0.45)

x = buf(0.2)
place(x, pop(650, 1300, 0.07), 0)
save("react", x, 0.38)

# Ánimos: cada uno con su carácter, sin juzgar ninguno.
x = buf(1.0)
for i, note in enumerate(["C5", "E5", "G5", "C6"]):
    place(x, pluck(hz(note), 0.7, 0.25), i * 0.065)
save("mood-happy", x, 0.5)

x = buf(0.85)
place(x, pluck(hz("E5"), 0.7, 0.28), 0)
place(x, pluck(hz("G5"), 0.7, 0.3), 0.1)
save("mood-good", x, 0.46)

x = buf(0.75)
place(x, pluck(hz("D5"), 0.7, 0.3, bright=0.2), 0)
save("mood-okay", x, 0.42)

x = buf(1.1)
place(x, pluck(hz("A4"), 0.9, 0.38, bright=0.1), 0)
place(x, pluck(hz("F4"), 0.9, 0.45, bright=0.1), 0.18)
save("mood-bad", x, 0.4)

x = buf(1.6)
place(x, bell(hz("D4"), 1.6, 0.6, attack=0.06), 0)
save("mood-awful", x, 0.38)

# Respiración: cuencos suaves al empezar a inhalar y a exhalar, y un cierre.
x = buf(3.2)
place(x, bell(hz("G4"), 3.2, 1.0, attack=0.25), 0)
save("breathe-in", x, 0.4)

x = buf(3.8)
place(x, bell(hz("D4"), 3.8, 1.2, attack=0.3), 0)
save("breathe-out", x, 0.4)

x = buf(3.0)
for i, note in enumerate(["C5", "G5", "C6"]):
    place(x, bell(hz(note), 2.8 - i * 0.2, 0.8, attack=0.02), i * 0.22, 0.7)
save("breathe-done", x, 0.45)

# Jardín: al abrir el recuerdo de una planta, una cajita de música que baja suave.
x = buf(1.9)
for i, note in enumerate(["E6", "C6", "G5", "E5"]):
    place(x, pluck(hz(note), 1.3, 0.45, bright=0.2), i * 0.13, 0.75)
place(x, bell(hz("C5"), 1.6, 0.7, attack=0.05), 0.5, 0.35)
save("memory", x, 0.45)
