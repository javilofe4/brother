export type UserId = "javier" | "rival";

export interface User {
  id: UserId;
  name: string;
  avatar: string;
  color: string;
}

export const USERS: Record<UserId, User> = {
  javier: {
    id: "javier",
    name: "Javier",
    avatar: "J",
    color: "#00e5ff",
  },
  rival: {
    id: "rival",
    name: "Rival",
    avatar: "R",
    color: "#f43f5e",
  },
};

export function normalizeUserId(value: unknown): UserId {
  return value === "rival" || value === "hermano" ? "rival" : "javier";
}
