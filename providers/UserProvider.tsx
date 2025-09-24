// src/providers/userProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { User } from "@/types/User";
import getUser from "@/utils/codeforces/getUser";
import { getLevel, getLevelByRating } from "@/utils/getLevel";

type Ctx = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  updateUser: (handle: string) => Promise<{ success: true; data: User } | { success: false; error: string }>;
  updateUserLevel: (args: { delta: number }) => Promise<{ success: boolean; error?: string }>;
  changeUserLevel: (newLevelNumber: number) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const UserContext = createContext<Ctx | null>(null);

const USER_STORAGE_KEY = "training-tracker-user";

function getStoredUser(): User | null {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial user from localStorage on mount
  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const updateUser = useCallback(
    async (codeforcesHandle: string) => {
      try {
        const res = await getUser(codeforcesHandle);
        if (!res.success) {
          throw new Error(res.error || "User not found");
        }
        const profile = res.data;
        const nextUser: User = {
          codeforcesHandle: profile.handle as string,
          avatar: profile.avatar as string,
          rating: profile.rating as number,
          level: getLevelByRating(profile.rating),
        };
        setUser(nextUser);
        return { success: true as const, data: nextUser };
      } catch (e: any) {
        const msg = e?.message ?? "Failed to update user";
        setError(new Error(msg));
        return { success: false as const, error: msg };
      }
    },
    []
  );

  const changeUserLevel = useCallback(
    async (newLevelNumber: number) => {
      if (!user) return { success: false, error: "User not found" };
      const lvl = getLevel(newLevelNumber);
      setUser((u) => (u ? { ...u, level: lvl } : u));
      return { success: true };
    },
    [user]
  );

  const updateUserLevel = useCallback(
    async ({ delta }: { delta: number }) => {
      if (!user) return { success: false, error: "User not found" };
      const lvl = getLevel(+user.level.level + delta);
      if (!lvl || +lvl.level < 1 || +lvl.level > 109) {
        return { success: false, error: "Failed to update user level" };
      }
      setUser((u) => (u ? { ...u, level: lvl } : u));
      return { success: true };
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: Ctx = {
    user,
    isLoading,
    error,
    updateUser,
    updateUserLevel,
    changeUserLevel,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within <UserProvider>");
  }
  return ctx;
}