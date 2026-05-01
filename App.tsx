import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { EventProvider } from "./src/context/EventContext";
import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
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
