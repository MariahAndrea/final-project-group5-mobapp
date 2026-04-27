import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createAuthStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 22,
    },
    brand: {
      fontSize: 34,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 28,
    },
    panel: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 16,
    },
    label: {
      color: theme.text,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 15,
      marginBottom: 14,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },
    linkButton: {
      paddingVertical: 16,
      alignItems: "center",
    },
    linkText: {
      color: theme.primary,
      fontWeight: "800",
    },
  });
