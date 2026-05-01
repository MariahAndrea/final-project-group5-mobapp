import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { createHomeStyles } from "../styles/HomeScreenStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }: any) {
  const { visibleEvents, updateEventStatus } = useContext(EventContext);
  const { currentUser } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const homeStyles = createHomeStyles(theme);
  const isAdmin = currentUser?.role === "admin";
  const dashboardEvents = visibleEvents.filter((event) => event.status !== "cancelled");

  const handleDeleteEvent = (id: string, eventName: string) => {
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to cancel the booking for "${eventName}"?`,
      [
        {
          text: "Keep",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          onPress: () => {
            updateEventStatus(id, "cancelled");
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatBookingDetails = (event: (typeof dashboardEvents)[number]) => {
    const startDate = new Date(event.date);
    const endDate = new Date(event.endTime);

    return [
      `Event: ${event.name}`,
      `Booked by: ${event.userName}`,
      `Venue: ${event.venue}`,
      `Date: ${startDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
      `Time: ${startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })} - ${endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`,
      `Guests: ${event.guests}`,
      event.description ? `Description: ${event.description}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const confirmAdminStatusChange = (id: string, status: "confirmed" | "cancelled") => {
    const event = dashboardEvents.find((item) => item.id === id);
    if (!event) return;

    const actionLabel = status === "confirmed" ? "Confirm Booking" : "Cancel Booking";
    Alert.alert(
      actionLabel,
      `${formatBookingDetails(event)}\n\nDo you want to ${status === "confirmed" ? "confirm" : "cancel"} this booking?`,
      [
        { text: "Review Again", style: "cancel" },
        {
          text: actionLabel,
          style: status === "cancelled" ? "destructive" : "default",
          onPress: () => updateEventStatus(id, status),
        },
      ]
    );
  };

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTop}>
          <View>
            <Text style={homeStyles.headerTitle}>EventEase</Text>
            <Text style={homeStyles.headerDescription}>
              {isAdmin
                ? "Review booking requests and keep availability accurate."
                : "Create bookings and keep your schedule organized."}
            </Text>
            <Text style={homeStyles.headerSubtitle}>
              {dashboardEvents.length} {dashboardEvents.length === 1 ? "booking" : "bookings"}
            </Text>
          </View>
          <TouchableOpacity
            style={homeStyles.themeButton}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons
              name={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"}
              size={20}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={homeStyles.primaryActions}>
          <TouchableOpacity
            style={homeStyles.secondaryButton}
            onPress={() => navigation.navigate("Calendar")}
          >
            <MaterialCommunityIcons name="calendar-month" size={18} color={theme.primary} />
            <Text style={homeStyles.secondaryButtonText}>Calendar</Text>
          </TouchableOpacity>
          {!isAdmin && (
            <TouchableOpacity
              style={homeStyles.createButton}
              onPress={() => navigation.navigate("Create")}
            >
              <Text style={homeStyles.createButtonText}>+ Add Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {dashboardEvents.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={homeStyles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={64}
              color={theme.textSecondary}
              style={{ marginBottom: 16 }}
            />
            <Text style={homeStyles.emptyText}>No bookings yet</Text>
            <Text style={homeStyles.emptySubtext}>
              {isAdmin ? "New user requests will appear here" : "Create your first booking to get started"}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={dashboardEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={homeStyles.listContent}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("Details", { id: item.id })}
              onEdit={!isAdmin ? () => navigation.navigate("Edit", { id: item.id }) : undefined}
              onDelete={() => handleDeleteEvent(item.id, item.name)}
              onConfirm={isAdmin ? () => confirmAdminStatusChange(item.id, "confirmed") : undefined}
              onCancel={isAdmin ? () => confirmAdminStatusChange(item.id, "cancelled") : undefined}
            />
          )}
        />
      )}
    </View>
  );
}
