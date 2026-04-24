import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createDetailsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 20,
      paddingTop: 54,
      paddingBottom: 36,
    },
    header: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.text,
      flex: 1,
      marginRight: 12,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.textSecondary,
      textTransform: "uppercase",
      marginTop: 20,
      marginBottom: 8,
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
      padding: 18,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 2,
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
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    editButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    deleteButton: {
      backgroundColor: "#FF6B6B",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export const detailsStyles = createDetailsStyles;
