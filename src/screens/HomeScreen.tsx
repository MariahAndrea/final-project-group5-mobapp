import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Modal } from "react-native";
import { useContext, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  const dashboardEvents = visibleEvents.filter((event) => event.status !== "cancelled");
  
  const filteredEvents = dashboardEvents.filter((event) => {
    if (statusFilter === "pending") return event.status === "pending";
    if (statusFilter === "completed") return event.status === "confirmed";
    return true;
  });

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
          <View style={homeStyles.headerTextBlock}>
            <Text style={homeStyles.headerTitle}>EventEase</Text>
            <Text style={homeStyles.headerDescription}>
              {isAdmin
                ? "Review booking requests and keep availability accurate."
                : "Create bookings and keep your schedule organized."}
            </Text>
            <Text style={homeStyles.headerSubtitle}>
              {filteredEvents.length} {filteredEvents.length === 1 ? "booking" : "bookings"}
            </Text>
          </View>
          <View style={homeStyles.headerButtons}>
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
        </View>
      </View>

      {filteredEvents.length === 0 ? (
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
          data={filteredEvents}
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

      <TouchableOpacity 
        style={homeStyles.floatingFilterButton}
        onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
      >
        <MaterialCommunityIcons name="filter-variant" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {filterDropdownOpen && (
        <View style={homeStyles.filterDropdownFloating}>
          <TouchableOpacity 
            style={homeStyles.filterOption}
            onPress={() => {
              setStatusFilter("all");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterOptionText, statusFilter === "all" && homeStyles.filterOptionActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={homeStyles.filterOption}
            onPress={() => {
              setStatusFilter("pending");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterOptionText, statusFilter === "pending" && homeStyles.filterOptionActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={homeStyles.filterOption}
            onPress={() => {
              setStatusFilter("completed");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterOptionText, statusFilter === "completed" && homeStyles.filterOptionActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isAdmin && (
        <TouchableOpacity
          style={homeStyles.floatingAddButton}
          onPress={() => navigation.navigate("Create")}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
