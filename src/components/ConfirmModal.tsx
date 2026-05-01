import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import PromptButton from "./PromptButton";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: "primary" | "danger" | "secondary";
  tone?: "default" | "success" | "danger";
};

export default function ConfirmModal({
  visible,
  title = "Confirm",
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "OK",
  confirmVariant = "primary",
  tone = "default",
}: ConfirmModalProps) {
  const { theme } = useContext(ThemeContext);

  const single = cancelText === null;
  const resolvedTone = tone === "default" && confirmVariant === "danger" ? "danger" : tone;
  const toneColor =
    resolvedTone === "success"
      ? theme.accent
      : resolvedTone === "danger"
      ? theme.primaryLight
      : theme.primary;
  const toneSurface =
    resolvedTone === "success"
      ? theme.primarySoft
      : resolvedTone === "danger"
      ? theme.errorBackground
      : theme.primarySoft;
  const toneBorder = resolvedTone === "danger" ? theme.primarySoft : theme.border;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.container, { backgroundColor: theme.surface, borderColor: toneBorder, shadowColor: theme.shadowColor }]}>
          <View style={[styles.headerDot, { backgroundColor: toneSurface }]}> 
            <View style={[styles.headerDotInner, { backgroundColor: toneColor }]} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text> : null}
          <View style={[styles.actions, single && { justifyContent: "center" }]}>
            {single ? (
              <PromptButton title={confirmText || "OK"} variant={confirmVariant as any} onPress={onConfirm} style={{ flex: 1 }} />
            ) : (
              <>
                <PromptButton title={cancelText || "Cancel"} variant="secondary" onPress={onCancel} style={{ flex: 1, marginRight: 8 }} />
                <PromptButton title={confirmText || "OK"} variant={confirmVariant as any} onPress={onConfirm} style={{ flex: 1 }} />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  container: {
    width: "100%",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 10,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  headerDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerDotInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
