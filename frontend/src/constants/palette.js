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

module.exports = {
  primary: scale([
    "#FEF7F1", "#FDF2EA", "#FBE5D4", "#F2AA74", "#DA9968",
    "#C2885D", "#B68057", "#916646", "#6D4D34", "#553B29",
  ]),
  secondary: scale([
    "#F6FAEF", "#F2F7E7", "#E4EFCE", "#A9CA62", "#98B658",
    "#87A24E", "#7F984A", "#65793B", "#4C5B2C", "#3B4822",
  ]),
  tertiary: scale([
    "#F5FBFD", "#F1F8FB", "#E1F1F7", "#9FD3E6", "#8FBECF",
    "#7FA9B8", "#779EAD", "#5F7E8A", "#485F68", "#384A51",
  ]),
  error: scale([
    "#FCEEEE", "#FBE6E6", "#F7CBCC", "#E5565B", "#CE4D52",
    "#B74549", "#AC4144", "#893437", "#672729", "#501E20",
  ]),
  mood: {
    fatal: "#A79BE3",
    mal: "#8EC3E6",
    normal: "#EDEFA8",
    bien: "#F7D86A",
    feliz: "#F6E45A",
  },
  white: "#FFFFFF",
};
