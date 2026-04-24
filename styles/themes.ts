export const lightTheme = {
  background: "#F7F4F2",
  surface: "#FFFFFF",
  text: "#211C1B",
  textSecondary: "#746966",
  primary: "#A43E32",
  primaryLight: "#D95849",
  accent: "#E8A23A",
  border: "#E7DEDA",
  cardBackground: "#FFFFFF",
  shadowColor: "#2D1813",
  statusBar: "dark",
};

export const darkTheme = {
  background: "#151313",
  surface: "#211F1E",
  text: "#FAF7F5",
  textSecondary: "#BDB3AF",
  primary: "#F06F5F",
  primaryLight: "#FF9487",
  accent: "#F1B45A",
  border: "#35302E",
  cardBackground: "#252220",
  shadowColor: "#000000",
  statusBar: "light",
};

export type Theme = typeof lightTheme;
