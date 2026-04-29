import { useContext, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { createAuthStyles } from "../styles/AuthStyles";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const styles = useMemo(() => createAuthStyles(theme), [theme]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordIsValid = password.length >= 6;
  const showEmailError = submitted && email.trim().length > 0 && !emailIsValid;
  const showPasswordError = submitted && password.length > 0 && !passwordIsValid;

  const handleRegister = async () => {
    setSubmitted(true);

    if (!name.trim() || !username.trim() || !email.trim() || !emailIsValid || !passwordIsValid) {
      Alert.alert("Check Details", "Fill all fields, use a valid email address, and use a password with at least 6 characters.");
      return;
    }

    const result = await register({ name, username, email, password });
    if (!result.ok) Alert.alert("Registration Failed", result.message);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <MaterialCommunityIcons
            name={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
        <Text style={styles.brand}>EventEase</Text>
        <Text style={styles.subtitle}>Create your account to start booking and tracking your events.</Text>

        <View style={styles.panel}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={theme.textSecondary} style={styles.input} />
          <Text style={styles.label}>Username</Text>
          <TextInput value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor={theme.textSecondary} autoCapitalize="none" style={styles.input} />
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={theme.textSecondary} autoCapitalize="none" keyboardType="email-address" style={[styles.input, showEmailError && styles.inputError]} />
          {showEmailError && <Text style={styles.errorText}>Enter a valid email address.</Text>}
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={theme.textSecondary} secureTextEntry style={[styles.input, showPasswordError && styles.inputError]} />
          {showPasswordError && <Text style={styles.errorText}>Password must be at least 6 characters.</Text>}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="account-plus" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Create Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
