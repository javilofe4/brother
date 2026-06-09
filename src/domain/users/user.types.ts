export type UserId = "javier" | "rival";

export interface User {
  id: UserId;
  name: string;
  avatar: string; // emoji or initials
  color: string; // accent color hex
}

export const USERS: Record<UserId, User> = {
  javier: {
    id: "javier",
    name: "Javier",
    avatar: "⚡",
    color: "#00e5ff",
  },
  rival: {
    id: "rival",
    name: "Rival",
    avatar: "🔥",
    color: "#7c3aed",
  },
};
