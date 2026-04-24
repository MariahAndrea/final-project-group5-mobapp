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

  return (
    <ScrollView
      style={detailsStyles.container}
      contentContainerStyle={detailsStyles.contentContainer}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header} numberOfLines={2}>{event.name}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.text} numberOfLines={3}>{event.venue}</Text>
        </View>
      </View>

      <Text style={detailsStyles.sectionLabel}>Date</Text>
      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.dateText} numberOfLines={2}>{dateString}</Text>
        </View>
      </View>

      <Text style={detailsStyles.sectionLabel}>Time</Text>
      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={theme.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={detailsStyles.timeText} numberOfLines={1}>
            {timeString}{endTimeString ? ` - ${endTimeString}` : ''}
          </Text>
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
          <Text style={detailsStyles.text} numberOfLines={2}>
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
          <Text style={detailsStyles.text} numberOfLines={1}>
            {event.status === "pending"
              ? "Pending"
              : event.status === "confirmed"
              ? "Confirmed"
              : "Cancelled"}
          </Text>
        </View>
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
