import type { IUser } from "@/interfaces";

export function profileSlugFromUser(u: IUser): string {
  const name = u.display_name?.trim();
  if (name) {
    return name.replace(/\s+/g, "");
  }
  const local = u.email.split("@")[0] ?? "user";
  return local;
}

export function profileHandleFromUser(u: IUser): string {
  return `@${profileSlugFromUser(u)}`;
}

export function initialsFromUser(u: IUser): string {
  const name = u.display_name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return u.email.slice(0, 2).toUpperCase();
}

export function displayNameFromUser(u: IUser): string {
  const name = u.display_name?.trim();
  if (name) {
    return name;
  }
  return u.email.split("@")[0] ?? "Người dùng";
}
