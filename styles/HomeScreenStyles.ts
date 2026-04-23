import { StyleSheet } from "react-native";
import { Theme, lightTheme } from "./themes";

export const createHomeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 18,
      backgroundColor: theme.surface,
      borderBottomWidth: 0,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    headerDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
      maxWidth: 280,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    createButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      marginRight: 8,
    },
    createButtonText: {
      color: "#FFFFFF",
      fontWeight: "600",
      textAlign: "center",
      fontSize: 14,
    },
    themeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 18,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 12,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    listContent: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
  });