export type Event = {
  id: string;
  userId: string;
  userName: string;
  name: string;
  venue: string;
  date: string;
  guests: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  profilePhoto?: string; // Base64 encoded image or URI
};
