import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createEditEventStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 24,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: 14,
      marginBottom: 16,
      borderRadius: 10,
      fontSize: 16,
      color: theme.text,
    },
    label: {
      marginBottom: 10,
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    resultsContainer: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      marginBottom: 16,
      backgroundColor: theme.surface,
      overflow: "hidden",
    },
    results: {
      maxHeight: 140,
    },
    resultItem: {
      padding: 14,
      borderBottomWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    resultText: {
      fontSize: 14,
      color: theme.text,
    },
    buttonContainer: {
      marginTop: 20,
      backgroundColor: theme.primary,
      borderRadius: 10,
      overflow: "hidden",
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      textAlign: "center",
      paddingVertical: 14,
      fontSize: 16,
    },
  });

export const editStyles = createEditEventStyles;
