import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import EditEventScreen from "../screens/EditEventScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import DataManagementScreen from "../screens/DataManagementScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import CustomTabBar from "../components/CustomTabBar";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Create: undefined;
  Calendar: undefined;
  Details: { id: string };
  Edit: { id: string };
  Profile: undefined;
  BookingHistory: undefined;
  DataManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Create" component={CreateEventScreen} />
      <Stack.Screen name="Details" component={EventDetailsScreen} />
      <Stack.Screen name="Edit" component={EditEventScreen} />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Create" component={CreateEventScreen} />
      <Stack.Screen name="Details" component={EventDetailsScreen} />
      <Stack.Screen name="Edit" component={EditEventScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="DataManagement" component={DataManagementScreen} />
      <Stack.Screen name="Details" component={EventDetailsScreen} />
      <Stack.Screen name="Edit" component={EditEventScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useContext(ThemeContext);
  const { currentUser, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return <AuthStack />;
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Home" }} />
      <Tab.Screen name="Calendar" component={CalendarStack} options={{ title: "Calendar" }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
