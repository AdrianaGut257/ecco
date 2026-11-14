// Una pregunta por día de la semana, de lo más liviano a lo más personal: la apertura gradual
// genera cercanía entre desconocidos (Aron et al., 1997). Ninguna pide datos personales.
const QUESTIONS = [
  "¿Qué fue lo mejor de tu semana hasta ahora?",
  "Si pudieras aprender algo nuevo sin esfuerzo, ¿qué sería?",
  "¿Qué pequeña cosa te hace feliz y casi nadie sabe?",
  "¿Hay alguien que te haya inspirado? ¿Por qué?",
  "¿De qué te sientes orgullo últimamente?",
  "¿Qué te gustaría que la gente supiera de ti al conocerte?",
  "¿Qué te llevas de esta semana conversando?",
];

export const questionFor = (day: number) =>
  day >= 1 && day <= QUESTIONS.length ? QUESTIONS[day - 1] : null;
