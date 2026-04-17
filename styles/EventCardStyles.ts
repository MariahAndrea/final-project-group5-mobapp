import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginVertical: 8,
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    details: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    status: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.primary,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });