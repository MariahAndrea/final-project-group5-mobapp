import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const detailsStyles = createDetailsStyles(theme);

  return (
    <ScrollView
      style={detailsStyles.container}
      contentContainerStyle={detailsStyles.contentContainer}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header}>Profile</Text>
      </View>

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}
          onPress={() => {/* Placeholder for Edit Profile */}}
        >
          <MaterialCommunityIcons
            name="account-edit"
            size={24}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.text}>Edit Profile</Text>
            <Text style={detailsStyles.textSecondary}>Update your personal information</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}
          onPress={() => {/* Placeholder for Settings */}}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.text}>Settings</Text>
            <Text style={detailsStyles.textSecondary}>App preferences and configuration</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}
          onPress={() => navigation.navigate("BookingHistory")}
        >
          <MaterialCommunityIcons
            name="history"
            size={24}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.text}>Booking History</Text>
            <Text style={detailsStyles.textSecondary}>View your past event bookings</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}