import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Animated } from "react-native";
import { useContext, useState, useRef, useEffect } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import { createHomeStyles } from "../styles/HomeScreenStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useModal } from "../context/ModalContext";

export default function HomeScreen({ navigation }: any) {
  const { visibleEvents, updateEventStatus } = useContext(EventContext);
  const { currentUser } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const homeStyles = createHomeStyles(theme);
  const isAdmin = currentUser?.role === "admin";
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showConfirm } = useModal();
  const dropdownAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (filterDropdownOpen) {
      dropdownAnimated.setValue(0);
    }
    Animated.timing(dropdownAnimated, {
      toValue: filterDropdownOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [filterDropdownOpen, dropdownAnimated]);
  
  const dashboardEvents = visibleEvents.filter((event) => event.status !== "cancelled");
  
  const filteredEvents = dashboardEvents.filter((event) => {
    if (statusFilter === "pending") return event.status === "pending";
    if (statusFilter === "completed") return event.status === "confirmed";
    return true;
  }).filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteEvent = (id: string, eventName: string) => {
    showConfirm({
      title: "Cancel Booking",
      message: `Are you sure you want to cancel the booking for "${eventName}"?`,
      cancelText: "Keep",
      confirmText: "Cancel Booking",
      confirmVariant: "danger",
      onConfirm: () => updateEventStatus(id, "cancelled"),
    });
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
    showConfirm({
      title: actionLabel,
      message: `${formatBookingDetails(event)}\n\nDo you want to ${status === "confirmed" ? "confirm" : "cancel"} this booking?`,
      cancelText: "Review Again",
      confirmText: actionLabel,
      confirmVariant: status === "cancelled" ? "danger" : "primary",
      onConfirm: () => updateEventStatus(id, status),
    });
  };

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTop}>
          <View style={homeStyles.headerTextBlock}>
            <Text style={homeStyles.headerTitle}>EventEase</Text>
            <View style={homeStyles.bookingTrackerCapsule}>
              <Text style={homeStyles.bookingTrackerText}>
                {filteredEvents.length} {filteredEvents.length === 1 ? "booking" : "bookings"}
              </Text>
            </View>
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

      <View style={homeStyles.searchBarContainer}>
        <View style={homeStyles.searchInputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={homeStyles.searchInput}
          />
        </View>
        <TouchableOpacity
          style={homeStyles.filterButton}
          onPress={() => setFilterDropdownOpen(!filterDropdownOpen)}
        >
          <MaterialCommunityIcons name="filter-variant" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {filterDropdownOpen && (
        <Animated.View
          style={{
            ...homeStyles.filterDropdown,
            opacity: dropdownAnimated,
            transform: [
              {
                translateY: dropdownAnimated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={homeStyles.filterDropdownItem}
            onPress={() => {
              setStatusFilter("all");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterDropdownItemText, { fontWeight: statusFilter === "all" ? "600" : "400" }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={homeStyles.filterDropdownItem}
            onPress={() => {
              setStatusFilter("pending");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterDropdownItemText, { fontWeight: statusFilter === "pending" ? "600" : "400" }]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[homeStyles.filterDropdownItem, { borderBottomWidth: 0 }]}
            onPress={() => {
              setStatusFilter("completed");
              setFilterDropdownOpen(false);
            }}
          >
            <Text style={[homeStyles.filterDropdownItemText, { fontWeight: statusFilter === "completed" ? "600" : "400" }]}>Completed</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {filteredEvents.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
