import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <StatusBar style={theme.statusBar as any} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
