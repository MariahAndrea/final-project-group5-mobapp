import { View, TouchableOpacity, Text, useWindowDimensions, Animated } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const tabWidth = width / state.routes.length;
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: state.index * tabWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [state.index, tabWidth, indicatorPosition]);

  const getIconName = (routeName: string, focused: boolean) => {
    let iconName: any;
    if (routeName === "Home") {
      iconName = focused ? "home" : "home-outline";
    } else if (routeName === "Calendar") {
      iconName = focused ? "calendar" : "calendar-outline";
    } else if (routeName === "Profile") {
      iconName = focused ? "account" : "account-outline";
    }
    return iconName;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.surface,
        borderTopColor: theme.border,
        borderTopWidth: 1,
        position: "relative",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: indicatorPosition,
          width: tabWidth,
          height: 3,
          backgroundColor: theme.primary,
        }}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            preventDefault: false,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 8,
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={getIconName(route.name, isFocused)}
              size={24}
              color={isFocused ? theme.primary : theme.textSecondary}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={{
                fontSize: 11,
                color: isFocused ? theme.primary : theme.textSecondary,
                fontWeight: isFocused ? "600" : "400",
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
