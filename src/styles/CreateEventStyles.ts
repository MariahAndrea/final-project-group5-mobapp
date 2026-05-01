import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createCreateEventStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 54,
      paddingBottom: 40,
    },
    header: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      paddingHorizontal: 14,
      paddingVertical: 15,
      marginBottom: 16,
      borderRadius: 8,
      fontSize: 16,
      color: theme.text,
    },
    label: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: "800",
      color: theme.text,
    },
    resultsContainer: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
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
      borderRadius: 8,
      overflow: "hidden",
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      textAlign: "center",
      paddingVertical: 15,
      fontSize: 16,
    },
  });

export const createStyles = createCreateEventStyles;
