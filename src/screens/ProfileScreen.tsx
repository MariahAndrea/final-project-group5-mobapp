import { Alert, TextInput, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useContext, useState } from "react";
import * as ImagePickerLib from "expo-image-picker";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ImagePicker = ImagePickerLib;

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { currentUser, updateAccount, updateProfilePhoto, logout, deleteAccount } = useContext(AuthContext);
  const { deleteEventsForUser } = useContext(EventContext);
  const detailsStyles = createDetailsStyles(theme);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const isAdmin = currentUser?.role === "admin";
  const hasAccountChanges =
    name.trim() !== (currentUser?.name || "") ||
    username.trim() !== (currentUser?.username || "") ||
    email.trim() !== (currentUser?.email || "") ||
    password !== (currentUser?.password || "");
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordIsValid = password.length >= 6;

  const saveProfile = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !emailIsValid || !passwordIsValid) {
      Alert.alert("Check Details", "Fill all fields, use a valid email address, and use a password with at least 6 characters.");
      return;
    }

    const result = await updateAccount({ name, username, email, password });
    if (!result.ok) {
      Alert.alert("Unable to Save", result.message);
      return;
    }
    setIsEditing(false);
    Alert.alert("Saved", "Your account details were updated.");
  };

  const confirmSaveProfile = () => {
    if (!hasAccountChanges) {
      Alert.alert("No Changes", "There are no account detail changes to save.");
      return;
    }

    Alert.alert(
      "Change Account Details",
      `Name: ${name.trim()}\nUsername: ${username.trim()}\nEmail: ${email.trim()}\n\nDo you really want to change these account details?`,
      [
        { text: "Review Again", style: "cancel" },
        { text: "Change Details", onPress: saveProfile },
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

  const pickImage = async (useCamera: boolean) => {
    try {
      const permission = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Required", `We need access to your ${useCamera ? "camera" : "photo library"} to change your profile photo.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const response = await updateProfilePhoto(result.assets[0].uri);
        if (response.ok) {
          Alert.alert("Success", "Your profile photo has been updated!");
        } else {
          Alert.alert("Error", response.message || "Failed to update profile photo.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const showPhotoOptions = () => {
    Alert.alert("Change Profile Photo", "How would you like to update your profile photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Take a Photo",
        onPress: () => pickImage(true),
      },
      {
        text: "Choose from Gallery",
        onPress: () => pickImage(false),
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
        <TouchableOpacity onPress={showPhotoOptions} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.primarySoft,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
            marginTop: 4,
            overflow: "hidden",
          }}>
            {currentUser?.profilePhoto ? (
              <Image
                source={{ uri: currentUser.profilePhoto }}
                style={{ width: 64, height: 64, borderRadius: 32 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={40}
                color={theme.primary}
              />
            )}
          </View>
          <View style={{ flex: 1, paddingTop: 4 }}>
            <Text style={detailsStyles.text}>{currentUser?.name}</Text>
            <Text style={detailsStyles.textSecondary}>{currentUser?.username} - {currentUser?.role}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: theme.primarySoft,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
            marginTop: 2,
          }}>
            <MaterialCommunityIcons name="account-edit" size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}>
            <Text style={detailsStyles.text}>Account Details</Text>
            <Text style={detailsStyles.textSecondary}>Review your name, username, email, and password</Text>
          </View>
          <MaterialCommunityIcons name={isEditing ? "chevron-up" : "lock-outline"} size={24} color={theme.textSecondary} style={{ marginLeft: 8 }} />
        </View>
        {!isEditing && (
          <TouchableOpacity style={detailsStyles.secondaryButton} onPress={() => setIsEditing(true)}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="account-edit-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
              <Text style={detailsStyles.secondaryButtonText}>Change Account details</Text>
            </View>
          </TouchableOpacity>
        )}
        {isEditing && (
          <View>
            <Text style={detailsStyles.sectionLabel}>Name</Text>
            <TextInput value={name} onChangeText={setName} placeholderTextColor={theme.textSecondary} style={detailsStyles.input} />
            <Text style={detailsStyles.sectionLabel}>Username</Text>
            <TextInput value={username} onChangeText={setUsername} placeholderTextColor={theme.textSecondary} autoCapitalize="none" style={detailsStyles.input} />
            <Text style={detailsStyles.sectionLabel}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} placeholderTextColor={theme.textSecondary} autoCapitalize="none" keyboardType="email-address" style={[detailsStyles.input, email.length > 0 && !emailIsValid && detailsStyles.inputError]} />
            {email.length > 0 && !emailIsValid && <Text style={detailsStyles.errorText}>Enter a valid email address.</Text>}
            <Text style={detailsStyles.sectionLabel}>Password</Text>
            <View style={[detailsStyles.passwordInputContainer, password.length > 0 && !passwordIsValid && detailsStyles.inputError]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={theme.textSecondary}
                style={detailsStyles.passwordInput}
              />
              <TouchableOpacity style={detailsStyles.iconButton} onPress={() => setShowPassword((value) => !value)}>
                <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {password.length > 0 && !passwordIsValid && <Text style={detailsStyles.errorText}>Password must be at least 6 characters.</Text>}
            <TouchableOpacity style={detailsStyles.editButton} onPress={confirmSaveProfile}>
              <Text style={detailsStyles.editButtonText}>Save Account Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={detailsStyles.secondaryButton} onPress={() => setIsEditing(false)}>
              <Text style={detailsStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isAdmin && (
        <View style={detailsStyles.detailsCard}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}
            onPress={() => navigation.navigate("DataManagement")}
          >
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: theme.primarySoft,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              marginTop: 2,
            }}>
              <MaterialCommunityIcons name="database-cog" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, paddingTop: 2 }}>
              <Text style={detailsStyles.text}>Data Management</Text>
              <Text style={detailsStyles.textSecondary}>View all accounts and local booking data</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}
          onPress={() => navigation.navigate("BookingHistory")}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: theme.primarySoft,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
            marginTop: 2,
          }}>
            <MaterialCommunityIcons
              name="history"
              size={20}
              color={theme.primary}
            />
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}>
            <Text style={detailsStyles.text}>Booking History</Text>
            <Text style={detailsStyles.textSecondary}>View your past event bookings</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} style={{ marginLeft: 8 }} />
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
