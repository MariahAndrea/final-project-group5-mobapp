import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function EventDetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { events, deleteEvent } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);
  const detailsStyles = createDetailsStyles(theme);

  const event = events.find((e) => e.id === id);

  const handleDeleteEvent = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to cancel the booking for "${event?.name}"? This action cannot be undone.`,
      [
        {
          text: "Keep",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteEvent(id);
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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeString = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <ScrollView style={detailsStyles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header}>{event.name}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.text}>{event.venue}</Text>
        </View>
      </View>

      <Text style={detailsStyles.sectionLabel}>Date & Time</Text>
      <View style={detailsStyles.detailsCard}>
        <View style={detailsStyles.dateTimeContainer}>
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.textSecondary}>Date</Text>
            <Text style={detailsStyles.dateText}>{dateString}</Text>
          </View>
          <View>
            <Text style={detailsStyles.textSecondary}>Time</Text>
            <Text style={detailsStyles.timeText}>{timeString}</Text>
          </View>
        </View>
      </View>

      <Text style={detailsStyles.sectionLabel}>Guests</Text>
      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="account-multiple"
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.text}>
            {event.guests} {event.guests === 1 ? "guest" : "guests"} attending
          </Text>
        </View>
      </View>

      <Text style={detailsStyles.sectionLabel}>Status</Text>
      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={
              event.status === "pending"
                ? "clock-outline"
                : event.status === "confirmed"
                ? "check-circle"
                : "cancel"
            }
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.text}>
            {event.status === "pending"
              ? "Pending"
              : event.status === "confirmed"
              ? "Confirmed"
              : "Cancelled"}
          </Text>
        </View>
      </View>

      <View style={detailsStyles.buttonContainer}>
        <TouchableOpacity
          style={detailsStyles.editButton}
          onPress={() => navigation.navigate("Edit", { id })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={detailsStyles.editButtonText}>Edit Event</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={detailsStyles.deleteButton}
          onPress={handleDeleteEvent}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="trash-can" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={detailsStyles.deleteButtonText}>Cancel Booking</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}