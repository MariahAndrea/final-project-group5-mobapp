import React, { createContext, useContext, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

type ConfirmOptions = {
  title?: string;
  message?: string;
  cancelText?: string | null;
  confirmText?: string;
  confirmVariant?: "primary" | "danger" | "secondary";
  tone?: "default" | "success" | "danger";
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ModalContextType = {
  showConfirm: (opts: ConfirmOptions) => void;
  showAlert: (title: string, message?: string) => void;
  showSuccess: (title: string, message?: string, onConfirm?: () => void) => void;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({});

  const showConfirm = (options: ConfirmOptions) => {
    setOpts(options);
    setVisible(true);
  };

  const showAlert = (title: string, message?: string) => {
    setOpts({ title, message, cancelText: null, confirmText: "OK", confirmVariant: "primary", tone: "default" });
    setVisible(true);
  };

  const showSuccess = (title: string, message?: string, onConfirm?: () => void) => {
    setOpts({ title, message, cancelText: null, confirmText: "OK", confirmVariant: "primary", tone: "success", onConfirm });
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    opts.onCancel && opts.onCancel();
  };

  const handleConfirm = () => {
    setVisible(false);
    opts.onConfirm && opts.onConfirm();
  };

  return (
    <ModalContext.Provider value={{ showConfirm, showAlert, showSuccess }}>
      {children}
      <ConfirmModal
        visible={visible}
        title={opts.title}
        message={opts.message}
        cancelText={opts.cancelText === undefined ? "Cancel" : opts.cancelText ?? undefined}
        confirmText={opts.confirmText}
        confirmVariant={opts.confirmVariant}
        tone={opts.tone}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </ModalContext.Provider>
  );
};
