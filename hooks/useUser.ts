import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/User";
import getUser from "@/utils/codeforces/getUser";
import { getLevel, getLevelByRating } from "@/utils/getLevel";
import { SuccessResponse, ErrorResponse, Response } from "@/types/Response";

const USER_STORAGE_KEY = "training-tracker-user";

const getStoredUser = (): User | null => {
  try {
    // This check prevents errors during server-side rendering
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // This effect runs once on the client to load the initial user from localStorage.
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // This effect syncs the user state back to localStorage whenever it changes.
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, [user]);

  const updateUser = useCallback(async (codeforcesHandle: string): Promise<Response<User>> => {
    try {
      const res = await getUser(codeforcesHandle);
      if (!res.success) {
        throw new Error(res.error || "User not found");
      }
      
      const profile = res.data;
      const newUser = {
        codeforcesHandle: profile.handle as string,
        avatar: profile.avatar as string,
        rating: profile.rating as number,
        level: getLevelByRating(profile.rating),
      };
      
      // Explicitly set the state. This will trigger the re-render.
      setUser(newUser);
      return SuccessResponse(newUser);
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update user";
      setError(new Error(errorMessage));
      return ErrorResponse(errorMessage);
    }
  }, []);

  const changeUserLevel = useCallback(async (newLevelNumber: number) => {
    if (!user) return ErrorResponse("User not found");
    const newLevel = getLevel(newLevelNumber);
    setUser((currentUser) => currentUser ? { ...currentUser, level: newLevel } : null);
    return SuccessResponse("User level updated successfully");
  }, [user]);

  const updateUserLevel = useCallback(async ({ delta }: { delta: number }) => {
    if (!user) return ErrorResponse("User not found");
    const newLevel = getLevel(+user.level.level + delta);
    if (!newLevel || +newLevel.level < 1 || +newLevel.level > 109) {
      return ErrorResponse("Failed to update user level");
    }
    setUser((currentUser) => currentUser ? { ...currentUser, level: newLevel } : null);
    return SuccessResponse("User level updated successfully");
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    updateUser,
    updateUserLevel,
    changeUserLevel,
    logout,
  };
};

export default useUser;

