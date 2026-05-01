import { useContext, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { createAuthStyles } from "../styles/AuthStyles";

export default function LoginScreen({ navigation }: any) {
  const { login } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const styles = useMemo(() => createAuthStyles(theme), [theme]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passwordIsValid = password.length >= 6;
  const showPasswordError = submitted && password.length > 0 && !passwordIsValid;

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("Missing Details", "Enter your username and password.");
      return;
    }

    const result = await login(username, password);
    if (!result.ok) Alert.alert("Login Failed", result.message);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.brand}>EventEase</Text>
        <Text style={styles.subtitle}>Book events, track date availability, and manage requests from one clean workspace.</Text>

        <View style={styles.panel}>
          <Text style={styles.title}>Sign in</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <View style={[ styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6}]}>
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={theme.textSecondary} secureTextEntry={!passwordVisible} style={[ showPasswordError && styles.inputError, { paddingRight: 45 , flex: 2}]} />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <MaterialCommunityIcons name={passwordVisible ? "eye-off" : "eye"} size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          {showPasswordError && <Text style={styles.errorText}>Password must be at least 6 characters.</Text>}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="login" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Create a new account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
