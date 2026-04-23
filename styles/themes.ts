export const lightTheme = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#1a1a1a",
  textSecondary: "#666666",
  primary: "#AF3D2F",
  primaryLight: "#E84C3D",
  accent: "#FF6B6B",
  border: "#EEEEEE",
  cardBackground: "#FFFFFF",
  shadowColor: "#000000",
  statusBar: "dark-content",
};

export const darkTheme = {
  background: "#121212",
  surface: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#BBBBBB",
  primary: "#FF6B6B",
  primaryLight: "#FF8A80",
  accent: "#FF6B6B",
  border: "#2E2E2E",
  cardBackground: "#2C2C2C",
  shadowColor: "#FFFFFF",
  statusBar: "light-content",
};

export type Theme = typeof lightTheme;
