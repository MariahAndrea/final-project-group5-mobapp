import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import EventCard from "../components/EventCard";
import { createHomeStyles } from "../styles/HomeScreenStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }: any) {
  const { events, deleteEvent } = useContext(EventContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const homeStyles = createHomeStyles(theme);

  const handleDeleteEvent = (id: string, eventName: string) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to cancel the booking for "${eventName}"? This action cannot be undone.`,
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
          },
          style: "destructive",
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
              Create or add an event to keep your schedule organized.
            </Text>
            <Text style={homeStyles.headerSubtitle}>
              {events.length} {events.length === 1 ? "event" : "events"}
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
          <TouchableOpacity
            style={homeStyles.createButton}
            onPress={() => navigation.navigate("Create")}
          >
            <Text style={homeStyles.createButtonText}>+ Add Event</Text>
          </TouchableOpacity>
        </View>
      </View>

      {events.length === 0 ? (
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
            <Text style={homeStyles.emptyText}>No events yet</Text>
            <Text style={homeStyles.emptySubtext}>
              Create your first event to get started
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={homeStyles.listContent}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("Details", { id: item.id })}
              onEdit={() => navigation.navigate("Edit", { id: item.id })}
              onDelete={() => handleDeleteEvent(item.id, item.name)}
            />
          )}
        />
      )}
    </View>
  );
}
