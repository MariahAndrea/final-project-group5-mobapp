import { Event } from "../types/Event";

export const getStatusColor = (status: Event["status"]) => {
  if (status === "confirmed") return "#2E8B57";
  if (status === "pending") return "#D6A400";
  return "#D94B4B";
};

export const getStatusBackground = (status: Event["status"]) => {
  if (status === "confirmed") return "#E8F5EE";
  if (status === "pending") return "#FFF6D8";
  return "#FDEAEA";
};
