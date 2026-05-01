import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getStatusColor } from "../styles/statusColors";

export default function EventDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { events, updateEventStatus } = useContext(EventContext);
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const detailsStyles = createDetailsStyles(theme);
  const isAdmin = currentUser?.role === "admin";

  const event = events.find((e) => e.id === id);

  const handleDeleteEvent = () => {
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to cancel the booking for "${event?.name}"?`,
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
            navigation.goBack();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!event) return null;

  const eventDate = new Date(event.date);
  const dateString = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeString = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const endTimeString = event.endTime ? new Date(event.endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }) : null;
  const statusLabel =
    event.status === "pending"
      ? "Pending"
      : event.status === "confirmed"
      ? "Confirmed"
      : "Cancelled";
  const statusColor = getStatusColor(event.status);
  const isReadOnly = event.status === "cancelled";
  const detailItems = [
    { label: "Venue", value: event.venue, icon: "map-marker" as const },
    { label: "Date", value: dateString, icon: "calendar" as const },
    { label: "Time", value: `${timeString}${endTimeString ? ` - ${endTimeString}` : ""}`, icon: "clock-outline" as const },
    {
      label: "Guests",
      value: `${event.guests} ${event.guests === 1 ? "guest" : "guests"} attending`,
      icon: "account-multiple" as const,
    },
    { label: "Booked By", value: event.userName, icon: "account" as const },
  ];

  const bookingDetails = [
    `Event: ${event.name}`,
    `Booked by: ${event.userName}`,
    `Venue: ${event.venue}`,
    `Date: ${dateString}`,
    `Time: ${timeString}${endTimeString ? ` - ${endTimeString}` : ""}`,
    `Guests: ${event.guests}`,
    event.description ? `Description: ${event.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const confirmAdminStatusChange = (status: "confirmed" | "cancelled") => {
    const actionLabel = status === "confirmed" ? "Confirm Booking" : "Cancel Booking";

    Alert.alert(
      actionLabel,
      `${bookingDetails}\n\nDo you want to ${status === "confirmed" ? "confirm" : "cancel"} this booking?`,
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
    <ScrollView
      style={detailsStyles.container}
      contentContainerStyle={detailsStyles.contentContainer}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <Text style={detailsStyles.header} numberOfLines={2}>Event Details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.heroCard}>
        <View style={detailsStyles.heroIcon}>
          <MaterialCommunityIcons name="calendar-star" size={26} color={theme.primary} />
        </View>
        <Text style={detailsStyles.header} numberOfLines={3}>{event.name}</Text>
        <Text style={detailsStyles.textSecondary}>{event.venue}</Text>
        <View
          style={[
            detailsStyles.statusPill,
            {
              borderColor: statusColor,
              backgroundColor: event.status === "cancelled" ? theme.errorBackground : theme.primarySoft,
            },
          ]}
        >
          <Text style={[detailsStyles.statusPillText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={detailsStyles.detailsGrid}>
        {detailItems.map((item) => (
          <View key={item.label} style={detailsStyles.detailRow}>
            <View style={detailsStyles.detailIcon}>
              <MaterialCommunityIcons name={item.icon} size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={detailsStyles.detailLabel}>{item.label}</Text>
              <Text style={detailsStyles.detailValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {event.description && (
        <>
          <Text style={detailsStyles.sectionLabel}>Description</Text>
          <View style={detailsStyles.detailsCard}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <MaterialCommunityIcons
                name="text"
                size={20}
                color={theme.primary}
                style={{ marginRight: 10, marginTop: 2 }}
              />
              <Text style={detailsStyles.text} numberOfLines={5}>{event.description}</Text>
            </View>
          </View>
        </>
      )}

      {isReadOnly && (
        <View style={[detailsStyles.detailsCard, { marginTop: 20 }]}>
          <Text style={detailsStyles.text}>This booking is cancelled.</Text>
          <Text style={detailsStyles.textSecondary}>Cancelled bookings are available for viewing only.</Text>
        </View>
      )}

      {!isReadOnly && (
        <View style={detailsStyles.buttonContainer}>
          {!isAdmin && (
            <TouchableOpacity
              style={detailsStyles.editButton}
              onPress={() => navigation.navigate("Edit", { id })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={detailsStyles.editButtonText}>Edit Event</Text>
              </View>
            </TouchableOpacity>
          )}
          {isAdmin && event.status !== "confirmed" && (
            <TouchableOpacity
              style={[detailsStyles.editButton, { backgroundColor: "#2E8B57" }]}
              onPress={() => confirmAdminStatusChange("confirmed")}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={detailsStyles.editButtonText}>Confirm Booking</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={detailsStyles.deleteButton}
            onPress={isAdmin ? () => confirmAdminStatusChange("cancelled") : handleDeleteEvent}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name={isAdmin ? "cancel" : "trash-can"} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={detailsStyles.deleteButtonText}>Cancel Booking</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
