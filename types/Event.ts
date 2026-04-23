export type Event = {
  id: string;
  name: string;
  venue: string;
  date: string;
  guests: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  status: "pending" | "confirmed" | "cancelled";
};