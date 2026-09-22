/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryClear: "#FDF6F2",
        primaryLight: "#F6DBC9",
        primaryLightHover: "#F2CCB2",
        primaryLightActive: "#ECB691",
        primaryNormal: "#E8A77B",
        primaryNormalHover: "#A27556",
        primaryNormalActive: "#8E664B",
        secondaryClear: "#F5F7F3",
        secondaryLight: "#D6DECE",
        secondaryLightHover: "#C6D1BA",
        secondaryLightActive: "#ADBD9C",
        secondaryNormal: "#9CAF88",
        secondaryNormalHover: "#6D7A5F",
        secondaryNormalActive: "#5F6B53",
        success: "#9CAF88",
        warning: "#E8C468",
        destructive: "#C97B63",
      },
      fontFamily: {
        heading: ["Poppins-Medium"],
        "heading-semibold": ["Poppins-SemiBold"],
        body: ["Inter-Regular"],
        "body-medium": ["Inter-Medium"],
      },
      borderRadius: {
        chip: "999px",
        card: "18px",
        field: "12px",
      },
    },
  },
  plugins: [],
};
