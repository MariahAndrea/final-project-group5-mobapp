import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useContext, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { createCardStyles } from "../styles/EventCardStyles";
import { Event } from "../types/Event";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getStatusBackground, getStatusColor } from "../styles/statusColors";

export default function EventCard({
  event,
  onPress,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}: {
  event: Event;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const { theme } = useContext(ThemeContext);
  const cardStyles = createCardStyles(theme);
  const [showActions, setShowActions] = useState(false);
  const actionAnim = useRef(new Animated.Value(0)).current;

  const startDate = new Date(event.date);
  const endDate = new Date(event.endTime);
  
  const startDateString = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDateString = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  const startTimeString = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeString = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Display efficiently: if same day, show "May 1, 2:00 PM - 4:00 PM"
  // If different days, show "May 1 - May 2, 2:00 PM - 4:00 PM"
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  const dateDisplay = isSameDay 
    ? startDateString 
    : `${startDateString} - ${endDateString}`;
  const timeDisplay = `${startTimeString} - ${endTimeString}`;

  const handleLongPress = () => {
    setShowActions(true);
    actionAnim.setValue(0);
    Animated.spring(actionAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleActionClose = () => {
    Animated.timing(actionAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowActions(false);
    });
  };

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => {
        if (showActions) {
          handleActionClose();
          return;
        }
        onPress();
      }}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <View style={cardStyles.header}>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.title}>{event.name}</Text>
          {event.userName && <Text style={cardStyles.meta}>Booked by {event.userName}</Text>}
        </View>
        <View
          style={[
            cardStyles.status,
            {
              backgroundColor: getStatusBackground(event.status),
              borderColor: getStatusColor(event.status),
            },
          ]}
        >
          <Text style={[cardStyles.statusText, { color: getStatusColor(event.status) }]}>
            {event.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={cardStyles.detailsContainer}>
        <View style={cardStyles.detailRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color={theme.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={cardStyles.details}>{event.venue}</Text>
        </View>
        <View style={cardStyles.detailRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={14}
            color={theme.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={cardStyles.details}>{dateDisplay}</Text>
        </View>
        <View style={cardStyles.detailRow}>
          <MaterialCommunityIcons
            name="clock"
            size={14}
            color={theme.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={cardStyles.details}>{timeDisplay}</Text>
        </View>
      </View>
      {showActions && (
        <Animated.View
          style={[
            styles.actionRow,
            {
              opacity: actionAnim,
              transform: [
                {
                  scale: actionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {onEdit && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => { handleActionClose(); onEdit(); }}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onConfirm && event.status !== "confirmed" && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#2E8B57" }]} onPress={() => { handleActionClose(); onConfirm(); }}>
              <Text style={styles.actionText}>Confirm</Text>
            </TouchableOpacity>
          )}
          {onCancel && event.status !== "cancelled" && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF6B6B" }]} onPress={() => { handleActionClose(); onCancel(); }}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF6B6B" }]} onPress={() => { handleActionClose(); onDelete(); }}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
