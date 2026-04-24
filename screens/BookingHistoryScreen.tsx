import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import EventCard from "../components/EventCard";
import { createHomeStyles } from "../styles/HomeScreenStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function BookingHistoryScreen({ navigation }: any) {
  const { events } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);
  const homeStyles = createHomeStyles(theme);

  // Filter past events (date before today)
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTop}>
          <View>
            <Text style={homeStyles.headerTitle}>Booking History</Text>
            <Text style={homeStyles.headerDescription}>
              View your past event bookings.
            </Text>
            <Text style={homeStyles.headerSubtitle}>
              {pastEvents.length} {pastEvents.length === 1 ? "event" : "events"}
            </Text>
          </View>
          <TouchableOpacity
            style={homeStyles.themeButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {pastEvents.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={homeStyles.emptyContainer}>
            <MaterialCommunityIcons
              name="history"
              size={64}
              color={theme.textSecondary}
              style={{ marginBottom: 16 }}
            />
            <Text style={homeStyles.emptyText}>No past events</Text>
            <Text style={homeStyles.emptySubtext}>
              Your booking history will appear here
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={pastEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("Details", { id: item.id })}
              onDelete={(id, name) => {/* Handle delete if needed */}}
              showDeleteButton={false} // Probably don't allow deleting past events
            />
          )}
          contentContainerStyle={homeStyles.listContainer}
        />
      )}
    </View>
  );
}