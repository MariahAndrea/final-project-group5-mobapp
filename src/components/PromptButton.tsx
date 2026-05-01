import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, GestureResponderEvent } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

type Variant = "primary" | "secondary" | "danger";

type PromptButtonProps = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  icon?: React.ReactNode;
};

export default function PromptButton({ title, onPress, variant = "primary", disabled, loading, style, icon }: PromptButtonProps) {
  const { theme } = useContext(ThemeContext);

  const colors = {
    primary: { background: theme.primary, text: theme.surface },
    secondary: { background: theme.surface, text: theme.text },
    danger: { background: theme.primary, text: theme.surface },
  } as Record<Variant, { background: string; text: string }>;

  const chosen = colors[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: chosen.background, borderColor: theme.border },
        variant === "secondary" && { backgroundColor: theme.surface, borderWidth: 1 },
        variant === "danger" && { borderWidth: 0 },
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={chosen.text} style={{ marginRight: 8 }} />
        ) : (
          icon && <View style={{ marginRight: 8 }}>{icon}</View>
        )}
        <Text style={[styles.title, { color: chosen.text }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
