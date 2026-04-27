import { StyleSheet } from "react-native";
import { Theme } from "./themes";

export const createCalendarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 54,
      paddingBottom: 18,
      backgroundColor: theme.surface,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.06,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    monthBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    monthTitleContainer: {
      alignItems: "center",
    },
    monthTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
    },
    todayLink: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 4,
    },
    calendarCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 22,
    },
    weekRow: {
      flexDirection: "row",
      marginBottom: 8,
    },
    weekDay: {
      flex: 1,
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: "700",
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },
    emptyDayCell: {
      opacity: 0,
    },
    selectedDayCell: {
      backgroundColor: theme.primary,
    },
    unavailableDayCell: {
      backgroundColor: theme.border,
    },
    dayText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "700",
    },
    selectedDayText: {
      color: "#FFFFFF",
    },
    todayText: {
      color: theme.primary,
    },
    eventDots: {
      flexDirection: "row",
      marginTop: 5,
      height: 5,
    },
    eventDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.primary,
      marginHorizontal: 1.5,
    },
    selectedEventDot: {
      backgroundColor: "#FFFFFF",
    },
    agendaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    agendaTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.text,
    },
    agendaSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 3,
    },
    addButton: {
      width: 42,
      height: 42,
      borderRadius: 8,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyState: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 34,
      alignItems: "center",
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 15,
      marginTop: 10,
    },
    agendaItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      marginBottom: 10,
    },
    timePill: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.primary,
      marginRight: 12,
    },
    timeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 4,
    },
    eventVenue: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
  });
