// Escribe en src/global.css las variables del modo claro (valores por defecto). Uso: node scripts/generateThemeCss.js
const fs = require("fs");
const path = require("path");
const { light, themeVars } = require("../src/constants/palette");

const file = path.join(__dirname, "../src/global.css");
const vars = Object.entries(themeVars(light)).map(([k, v]) => `  ${k}: ${v};`).join("\n");
const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Generado con scripts/generateThemeCss.js desde src/constants/palette.js: modo claro por defecto.
   El modo oscuro cambia estas variables desde src/theme. */
:root {
${vars}
}
`;
fs.writeFileSync(file, css);
console.log("ok", Object.keys(themeVars(light)).length, "variables");
