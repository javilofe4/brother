import type { UserId, User } from "@/domain/users/user.types";
import { USERS } from "@/domain/users/user.types";

export type { User, UserId };
export const DEFAULT_ACTIVE_USER_ID: UserId = "javier";
export const USER_LIST: Record<UserId, User> = USERS;
