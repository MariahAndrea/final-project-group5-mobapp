import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { User } from "../types/Event";

const USERS_KEY = "eventease.users";
const SESSION_KEY = "eventease.session";

const adminUser: User = {
  id: "admin",
  name: "Administrator",
  username: "ADMIN",
  email: "admin@eventease.local",
  password: "admin123",
  role: "admin",
};

type AuthContextType = {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (details: Omit<User, "id" | "role">) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateAccount: (details: Omit<User, "id" | "role">) => Promise<{ ok: boolean; message?: string }>;
  deleteAccount: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const withoutDuplicateAdmin = (users: User[]) =>
  users.filter((user) => user.username.toUpperCase() !== "ADMIN" && user.id !== "admin");

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const readItem = async (key: string): Promise<string | null> => {
  const result = await AsyncStorage.getItem(key);
  if (result === null || result === undefined) return null;
  if (typeof result === "string") return result;

  if (typeof result === "object" && "value" in (result as any)) {
    return (result as any).value ?? null;
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([adminUser]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedUsers, storedSession] = await Promise.all([
          readItem(USERS_KEY),
          readItem(SESSION_KEY),
        ]);
        const parsedUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];
        const nextUsers = [adminUser, ...withoutDuplicateAdmin(parsedUsers)];
        setUsers(nextUsers);

        if (storedSession) {
          const sessionUser = nextUsers.find((user) => user.id === storedSession);
          setCurrentUser(sessionUser || null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }, [users, isLoading]);

  const login = async (username: string, password: string) => {
    const user = users.find(
      (item) =>
        item.username.toLowerCase() === username.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return { ok: false, message: "Username or password is incorrect." };
    }

    setCurrentUser(user);
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return { ok: true };
  };

  const register = async (details: Omit<User, "id" | "role">) => {
    const username = details.username.trim();
    const email = details.email.trim();

    if (!details.name.trim() || !username || !isValidEmail(email) || details.password.length < 6) {
      return { ok: false, message: "Use a valid email address and a password with at least 6 characters." };
    }

    if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, message: "That username is already taken." };
    }

    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: "That email is already registered." };
    }

    const user: User = {
      id: Date.now().toString(),
      name: details.name.trim(),
      username,
      email,
      password: details.password,
      role: "user",
    };

    setUsers((previous) => [...previous, user]);
    setCurrentUser(user);
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return { ok: true };
  };

  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const updateAccount = async (details: Omit<User, "id" | "role">) => {
    if (!currentUser) return { ok: false, message: "You must be logged in." };

    const username = details.username.trim();
    const email = details.email.trim();

    if (!details.name.trim() || !username || !isValidEmail(email) || details.password.length < 6) {
      return { ok: false, message: "Use a valid email address and a password with at least 6 characters." };
    }

    const duplicate = users.find(
      (user) =>
        user.id !== currentUser.id &&
        (user.username.toLowerCase() === username.toLowerCase() ||
          user.email.toLowerCase() === email.toLowerCase())
    );

    if (duplicate) {
      return { ok: false, message: "Username or email is already used." };
    }

    const updatedUser: User = {
      ...currentUser,
      name: details.name.trim(),
      username,
      email,
      password: details.password,
    };

    setUsers((previous) => previous.map((user) => (user.id === currentUser.id ? updatedUser : user)));
    setCurrentUser(updatedUser);
    return { ok: true };
  };

  const deleteAccount = async () => {
    if (!currentUser || currentUser.role === "admin") return null;
    const deletedUserId = currentUser.id;
    setUsers((previous) => previous.filter((user) => user.id !== deletedUserId));
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
    return deletedUserId;
  };

  const value = useMemo(
    () => ({ currentUser, users, isLoading, login, register, logout, updateAccount, deleteAccount }),
    [currentUser, users, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
