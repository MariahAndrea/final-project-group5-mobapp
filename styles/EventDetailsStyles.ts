import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createDetailsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginTop: 20,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    text: {
      fontSize: 16,
      marginBottom: 12,
      color: theme.text,
      lineHeight: 24,
    },
    textSecondary: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    detailsCard: {
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    dateTimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.primary,
    },
    timeText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.primary,
    },
    buttonContainer: {
      marginTop: 24,
      gap: 12,
    },
    editButton: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    editButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    deleteButton: {
      backgroundColor: "#FF6B6B",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export const detailsStyles = createDetailsStyles;