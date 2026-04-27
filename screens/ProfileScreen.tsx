import { Alert, TextInput, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { currentUser, users, updateAccount, logout, deleteAccount } = useContext(AuthContext);
  const { visibleEvents, deleteEventsForUser } = useContext(EventContext);
  const detailsStyles = createDetailsStyles(theme);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const isAdmin = currentUser?.role === "admin";

  const saveProfile = async () => {
    const result = await updateAccount({ name, username, email, password });
    if (!result.ok) {
      Alert.alert("Unable to Save", result.message);
      return;
    }
    setIsEditing(false);
    Alert.alert("Saved", "Your account details were updated.");
  };

  const confirmSaveProfile = () => {
    Alert.alert(
      "Update Account",
      `Name: ${name}\nUsername: ${username}\nEmail: ${email}\n\nDo you want to save these account changes?`,
      [
        { text: "Review Again", style: "cancel" },
        { text: "Save", onPress: saveProfile },
      ]
    );
  };

  const confirmDelete = () => {
    Alert.alert("Delete Account", "Do you really want to delete this account? This permanently deletes your account and all of your booking data.", [
      { text: "Keep Account", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const deletedUserId = await deleteAccount();
          if (deletedUserId) deleteEventsForUser(deletedUserId);
        },
      },
    ]);
  };

  const confirmLogout = () => {
    Alert.alert("Log Out", "Do you want to log out?", [
      { text: "Stay Logged In", style: "cancel" },
      {
        text: "Log Out",
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView
      style={detailsStyles.container}
      contentContainerStyle={detailsStyles.contentContainer}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header}>Profile</Text>
      </View>

      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
          <MaterialCommunityIcons
            name={isAdmin ? "shield-account" : "account-circle"}
            size={24}
            color={theme.primary}
            style={{ marginRight: 16 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.text}>{currentUser?.name}</Text>
            <Text style={detailsStyles.textSecondary}>{currentUser?.username} - {currentUser?.role}</Text>
          </View>
        </View>
      </View>

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }} onPress={() => setIsEditing(!isEditing)}>
          <MaterialCommunityIcons name="account-edit" size={24} color={theme.primary} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={detailsStyles.text}>Account Details</Text>
            <Text style={detailsStyles.textSecondary}>Update your name, username, email, and password</Text>
          </View>
          <MaterialCommunityIcons name={isEditing ? "chevron-up" : "chevron-right"} size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        {isEditing && (
          <View>
            {[
              ["Name", name, setName, false],
              ["Username", username, setUsername, false],
              ["Email", email, setEmail, false],
              ["Password", password, setPassword, true],
            ].map(([label, value, setter, secure]) => (
              <View key={label as string}>
                <Text style={detailsStyles.sectionLabel}>{label as string}</Text>
                <TextInput
                  value={value as string}
                  onChangeText={setter as (text: string) => void}
                  secureTextEntry={secure as boolean}
                  placeholderTextColor={theme.textSecondary}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    marginBottom: 8,
                  }}
                />
              </View>
            ))}
            <TouchableOpacity style={detailsStyles.editButton} onPress={confirmSaveProfile}>
              <Text style={detailsStyles.editButtonText}>Save Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isAdmin && (
        <View style={detailsStyles.detailsCard}>
          <Text style={detailsStyles.text}>Data Management</Text>
          <Text style={detailsStyles.textSecondary}>{users.length} accounts stored locally</Text>
          <Text style={detailsStyles.textSecondary}>{visibleEvents.length} bookings in the local database</Text>
        </View>
      )}

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

      <View style={detailsStyles.buttonContainer}>
        {!isAdmin && (
          <TouchableOpacity style={detailsStyles.deleteButton} onPress={confirmDelete}>
            <Text style={detailsStyles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={detailsStyles.editButton} onPress={confirmLogout}>
          <Text style={detailsStyles.editButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
