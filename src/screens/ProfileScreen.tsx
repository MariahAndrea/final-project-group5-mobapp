import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useContext, useState } from "react";
import * as ImagePickerLib from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { createDetailsStyles } from "../styles/EventDetailsStyles";
import { useModal } from "../context/ModalContext";

const ImagePicker = ImagePickerLib;

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { currentUser, updateAccount, updateProfilePhoto, logout, deleteAccount } = useContext(AuthContext);
  const { deleteEventsForUser } = useContext(EventContext);
  const { showAlert, showConfirm, showSuccess } = useModal();
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

  const safeGoBack = () => {
    if (navigation && typeof navigation.canGoBack === "function" && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Home");
    }
  };

  const saveProfile = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !emailIsValid || !passwordIsValid) {
      showAlert("Check Details", "Fill all fields, use a valid email address, and use a password with at least 6 characters.");
      return;
    }

    const result = await updateAccount({ name, username, email, password });
    if (!result.ok) {
      showAlert("Unable to Save", result.message);
      return;
    }

    setIsEditing(false);
    showSuccess("Saved", "Your account details were updated.");
  };

  const confirmSaveProfile = () => {
    if (!hasAccountChanges) {
      showAlert("No Changes", "There are no account detail changes to save.");
      return;
    }

    showConfirm({
      title: "Change Account Details",
      message: `Name: ${name.trim()}\nUsername: ${username.trim()}\nEmail: ${email.trim()}\n\nDo you really want to change these account details?`,
      cancelText: "Review Again",
      confirmText: "Change Details",
      onConfirm: saveProfile,
    });
  };

  const confirmDelete = () => {
    showConfirm({
      title: "Delete Account",
      message: "Do you really want to delete this account? This permanently deletes your account and all of your booking data.",
      cancelText: "Keep Account",
      confirmText: "Delete",
      confirmVariant: "danger",
      onConfirm: async () => {
        const deletedUserId = await deleteAccount();
        if (deletedUserId) deleteEventsForUser(deletedUserId);
      },
    });
  };

  const confirmLogout = () => {
    showConfirm({
      title: "Log Out",
      message: "Do you want to log out?",
      cancelText: "Stay Logged In",
      confirmText: "Log Out",
      confirmVariant: "danger",
      onConfirm: () => {
        logout();
      },
    });
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert("Permission Required", `We need access to your ${useCamera ? "camera" : "photo library"} to change your profile photo.`);
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
          showSuccess("Photo Updated", "Your profile photo has been updated!");
        } else {
          showAlert("Error", response.message || "Failed to update profile photo.");
        }
      }
    } catch {
      showAlert("Error", "Failed to pick image. Please try again.");
    }
  };

  const showPhotoOptions = () => {
    showConfirm({
      title: "Change Profile Photo",
      message: "How would you like to update your profile photo?",
      cancelText: "Choose from Gallery",
      confirmText: "Take a Photo",
      onConfirm: () => pickImage(true),
      onCancel: () => pickImage(false),
    });
  };

  return (
    <ScrollView style={detailsStyles.container} contentContainerStyle={detailsStyles.contentContainer} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={detailsStyles.header}>Profile</Text>
        <TouchableOpacity onPress={safeGoBack}>
          <MaterialCommunityIcons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <TouchableOpacity onPress={showPhotoOptions} style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: theme.primarySoft,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
                marginTop: 4,
                overflow: "hidden",
              }}
            >
              {currentUser?.profilePhoto ? (
                <Image source={{ uri: currentUser.profilePhoto }} style={{ width: 64, height: 64, borderRadius: 32 }} />
              ) : (
                <MaterialCommunityIcons name="account" size={40} color={theme.primary} />
              )}
            </View>
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: 12,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: theme.primary,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: theme.surface,
              }}
            >
              <MaterialCommunityIcons name="pencil" size={14} color={theme.surface} />
            </View>
          </View>
          <View style={{ flex: 1, paddingTop: 4 }}>
            <Text style={detailsStyles.text}>{currentUser?.name}</Text>
            <Text style={detailsStyles.textSecondary}>
              {currentUser?.username} - {currentUser?.role}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={detailsStyles.detailsCard}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: theme.primarySoft,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              marginTop: 2,
            }}
          >
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
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[detailsStyles.input, email.length > 0 && !emailIsValid && detailsStyles.inputError]}
            />
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
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }} onPress={() => navigation.navigate("DataManagement")}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: theme.primarySoft,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
                marginTop: 2,
              }}
            >
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
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }} onPress={() => navigation.navigate("BookingHistory")}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: theme.primarySoft,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              marginTop: 2,
            }}
          >
            <MaterialCommunityIcons name="history" size={20} color={theme.primary} />
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
