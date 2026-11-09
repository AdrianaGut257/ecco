// Paleta de ECHOOM en sus dos modos. Tailwind usa variables CSS (ver themeVars), así que las clases
// cambian solas al pasar a modo oscuro; en el código, los colores se leen con useColors().
const scale = (c) => ({
  light: c[0],
  "light-hover": c[1],
  "light-active": c[2],
  normal: c[3],
  "normal-hover": c[4],
  "normal-active": c[5],
  dark: c[6],
  "dark-hover": c[7],
  "dark-active": c[8],
  darker: c[9],
});

// `ink` es el texto sobre los botones de color: oscuro en ambos modos. `error.text` es el rojo de los mensajes
// de error, que en modo oscuro se aclara (el de los botones de error no se lee sobre el fondo oscuro).
const light = {
  primary: { ...scale(["#FEF7F1", "#FDF2EA", "#FBE5D4", "#F2AA74", "#DA9968", "#C2885D", "#B68057", "#916646", "#6D4D34", "#553B29"]), ink: "#553B29" },
  secondary: { ...scale(["#F6FAEF", "#F2F7E7", "#E4EFCE", "#A9CA62", "#98B658", "#87A24E", "#7F984A", "#65793B", "#4C5B2C", "#3B4822"]), ink: "#3B4822" },
  tertiary: { ...scale(["#F5FBFD", "#F1F8FB", "#E1F1F7", "#9FD3E6", "#8FBECF", "#7FA9B8", "#779EAD", "#5F7E8A", "#485F68", "#384A51"]), ink: "#384A51" },
  error: { ...scale(["#FCEEEE", "#FBE6E6", "#F7CBCC", "#E5565B", "#CE4D52", "#B74549", "#AC4144", "#893437", "#672729", "#501E20"]), ink: "#FFFFFF", text: "#B74549" },
  // Tarjetas, campos y burbujas.
  surface: "#FFFFFF",
  // Velo detrás de las hojas.
  scrim: "#553B29",
};

// Modo oscuro: fondos café muy oscuros y cálidos, los mismos acentos y textos en tonos claros de cada familia.
// Al presionar, los botones se aclaran (no se oscurecen) para que su texto conserve el contraste.
const dark = {
  primary: { ...scale(["#1B1512", "#231B16", "#33271F", "#F2AA74", "#F4B786", "#F6C49C", "#C99A76", "#EDB98F", "#EBDCCF", "#FBEFE5"]), ink: "#553B29" },
  secondary: { ...scale(["#151A11", "#1B2216", "#26311C", "#A9CA62", "#B6D374", "#C2DB87", "#94AD6C", "#C2DA8E", "#DCEAC0", "#EEF6E0"]), ink: "#3B4822" },
  tertiary: { ...scale(["#12181B", "#172024", "#1F2E35", "#9FD3E6", "#ADDAEA", "#BBE1EE", "#86AAB8", "#AFD8E7", "#D3EBF3", "#E9F6FA"]), ink: "#384A51" },
  error: { ...scale(["#231314", "#2B1718", "#3E1F21", "#E5565B", "#D84C51", "#B74549", "#E57D81", "#F29A9D", "#F7C2C4", "#FCE0E1"]), ink: "#FFFFFF", text: "#F29A9D" },
  surface: "#261E19",
  scrim: "#000000",
};

// Iguales en ambos modos.
const fixed = {
  mood: {
    fatal: "#A79BE3",
    mal: "#8EC3E6",
    normal: "#EDEFA8",
    bien: "#F7D86A",
    feliz: "#F6E45A",
  },
  white: "#FFFFFF",
};

const FAMILIES = ["primary", "secondary", "tertiary", "error"];
const varName = (family, step) => (step ? `--${family}-${step}` : `--${family}`);
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

// Variables CSS de un modo: { "--primary-light": "254 247 241", ... }.
function themeVars(theme) {
  const out = {};
  for (const family of FAMILIES) {
    for (const [step, hex] of Object.entries(theme[family])) out[varName(family, step)] = rgb(hex);
  }
  out[varName("surface")] = rgb(theme.surface);
  out[varName("scrim")] = rgb(theme.scrim);
  return out;
}

// Colores para tailwind.config.js: cada uno apunta a su variable.
function tailwindColors() {
  const ref = (name) => `rgb(var(${name}) / <alpha-value>)`;
  const out = { ...fixed };
  for (const family of FAMILIES) {
    out[family] = Object.fromEntries(Object.keys(light[family]).map((step) => [step, ref(varName(family, step))]));
  }
  out.surface = ref(varName("surface"));
  out.scrim = ref(varName("scrim"));
  return out;
}

module.exports = {
  light: { ...light, ...fixed },
  dark: { ...dark, ...fixed },
  themeVars,
  tailwindColors,
};
