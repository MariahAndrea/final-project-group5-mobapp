import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginVertical: 7,
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    meta: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: "700",
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
    details: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    status: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.primary,
    },
  });
