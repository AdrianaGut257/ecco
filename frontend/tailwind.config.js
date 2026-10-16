const palette = require("./src/constants/palette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/constants/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        heading: ["Poppins_400Regular"],
        "heading-medium": ["Poppins_500Medium"],
        "heading-semibold": ["Poppins_600SemiBold"],
        "heading-bold": ["Poppins_700Bold"],
        body: ["Quicksand_400Regular"],
        "body-medium": ["Quicksand_500Medium"],
        "body-semibold": ["Quicksand_600SemiBold"],
        "body-bold": ["Quicksand_700Bold"],
      },
      fontSize: {
        h1: ["36px", { lineHeight: "43px", letterSpacing: "0px" }],
        h2: ["32px", { lineHeight: "38px", letterSpacing: "0px" }],
        h3: ["28px", { lineHeight: "34px", letterSpacing: "0px" }],
        h4: ["25px", { lineHeight: "30px", letterSpacing: "0px" }],
        subtitle1: ["22px", { lineHeight: "27px", letterSpacing: "0.15px" }],
        subtitle2: ["20px", { lineHeight: "24px", letterSpacing: "0.1px" }],
        body1: ["18px", { lineHeight: "21px", letterSpacing: "0.5px" }],
        body2: ["16px", { lineHeight: "19px", letterSpacing: "0.25px" }],
        body3: ["14px", { lineHeight: "17px", letterSpacing: "0.4px" }],
        caption1: ["11px", { lineHeight: "15px", letterSpacing: "0.5px" }],
        caption2: ["11px", { lineHeight: "15px", letterSpacing: "0.5px" }],
        caption3: ["10px", { lineHeight: "13px", letterSpacing: "0.5px" }],
        button1: ["16px", { lineHeight: "19px", letterSpacing: "0.1px" }],
        button2: ["14px", { lineHeight: "17px", letterSpacing: "0.1px" }],
      },
      borderRadius: {
        chip: "999px",
        card: "20px",
        field: "14px",
      },
    },
  },
  plugins: [],
};
