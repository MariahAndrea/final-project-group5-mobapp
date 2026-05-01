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
      paddingTop: 54,
      paddingBottom: 20,
      backgroundColor: theme.surface,
      borderBottomWidth: 0,
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    headerDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 21,
      marginBottom: 8,
      maxWidth: 300,
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
      paddingVertical: 12,
      borderRadius: 8,
      flex: 1,
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
      borderRadius: 8,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    primaryActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    secondaryButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontWeight: "700",
      textAlign: "center",
      fontSize: 14,
      marginLeft: 6,
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
      paddingBottom: 28,
    },
  });
