import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { ThemeContext } from "../context/ThemeContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";

export default function DataManagementScreen({ navigation }: any) {
  const { users } = useContext(AuthContext);
  const { visibleEvents } = useContext(EventContext);
  const { theme } = useContext(ThemeContext);
  const detailsStyles = createDetailsStyles(theme);

  return (
    <ScrollView style={detailsStyles.container} contentContainerStyle={detailsStyles.contentContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header}>Data Management</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <Text style={detailsStyles.text}>Local Database</Text>
        <Text style={detailsStyles.textSecondary}>{users.length} accounts stored locally</Text>
        <Text style={detailsStyles.textSecondary}>{visibleEvents.length} bookings in the local database</Text>
      </View>

      <Text style={detailsStyles.sectionLabel}>Accounts</Text>
      <View style={detailsStyles.detailsCard}>
        {users.map((user, index) => (
          <View key={user.id} style={[detailsStyles.accountRow, index === 0 && { borderTopWidth: 0, marginTop: 0, paddingTop: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={detailsStyles.accountName}>{user.name}</Text>
              <Text style={detailsStyles.accountDetail}>Username: {user.username}</Text>
              <Text style={detailsStyles.accountDetail}>Email: {user.email}</Text>
              <Text style={detailsStyles.accountDetail}>Password: {user.password}</Text>
            </View>
            <Text style={detailsStyles.roleBadge}>{user.role}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
