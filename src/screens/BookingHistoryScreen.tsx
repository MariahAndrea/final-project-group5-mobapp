import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useContext } from "react";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import EventCard from "../components/EventCard";
import { createHomeStyles } from "../styles/HomeScreenStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function BookingHistoryScreen({ navigation }: any) {
  const { visibleEvents } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);
  const homeStyles = createHomeStyles(theme);

  const historyEvents = visibleEvents
    .filter((event) => event.status === "cancelled" || new Date(event.date) < new Date())
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTop}>
          <View>
            <Text style={homeStyles.headerTitle}>Booking History</Text>
            <View style={{ backgroundColor: theme.primarySoft, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, alignSelf: "flex-start", marginTop: 4 }}>
              <Text style={[homeStyles.headerSubtitle, { color: theme.primary, fontSize: 13 }]}>
                {historyEvents.length} {historyEvents.length === 1 ? "booking" : "bookings"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={homeStyles.closeButton}
            onPress={() => {
              if (navigation && typeof navigation.canGoBack === "function" && navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate("Home");
              }
            }}
          >
            <MaterialCommunityIcons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {historyEvents.length === 0 ? (
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
              name="history"
              size={64}
              color={theme.textSecondary}
              style={{ marginBottom: 16 }}
            />
            <Text style={homeStyles.emptyText}>No booking history</Text>
            <Text style={homeStyles.emptySubtext}>
              Past and deleted bookings will appear here
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={historyEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate("Details", { id: item.id })}
            />
          )}
          contentContainerStyle={homeStyles.listContent}
        />
      )}
    </View>
  );
}
