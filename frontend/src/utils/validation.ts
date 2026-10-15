export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());

export const PASSWORD_RULES = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "Un carácter especial (!@#$...)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export const isStrongPassword = (value: string) =>
  PASSWORD_RULES.every((rule) => rule.test(value));
