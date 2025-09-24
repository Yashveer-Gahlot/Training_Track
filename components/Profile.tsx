"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideEdit, LogOut} from "lucide-react";
import HandleForm from "./HandleForm";
import useUser from "@/hooks/useUser"; // It now uses the hook directly

const Profile = () => {
  // All user data and functions are now sourced directly from the context via the hook.
  const { user, logout, changeUserLevel, updateUser } = useUser();
  
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [isChangingHandle, setIsChangingHandle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Ensure we have a user before trying to access its properties
  const [newLevelNumber, setNewLevelNumber] = useState<number>(user ? +user.level.level : 1);

  const onSaveLevel = async () => {
    if (!user) return;
    setIsLoading(true);
    await changeUserLevel(newLevelNumber);
    setIsEditingLevel(false);
    setIsLoading(false);
  };

  const handleUpdateSuccess = async (handle: string) => {
    const result = await updateUser(handle);
    if (result.success) {
      setIsChangingHandle(false);
    }
    // Optional: Add error handling UI if result.success is false
  };

  // If for some reason the user is null, this component will not render.
  if (!user) {
    return null;
  }

  if (isChangingHandle) {
    return (
      <div className="w-full flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold">Change Codeforces Handle</h2>
        <HandleForm onUpdateSuccess={handleUpdateSuccess} />
        <Button variant="ghost" onClick={() => setIsChangingHandle(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
      <Avatar className="w-24 h-24 md:w-40 md:h-40 border-4 border-primary/50 shadow-lg">
        <AvatarImage src={user.avatar} alt="avatar" />
        <AvatarFallback>{user.codeforcesHandle?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center md:items-start justify-center gap-3">
        <div className="text-3xl font-bold text-foreground tracking-tight">
          {user.codeforcesHandle}
        </div>
        <div className="text-lg text-muted-foreground">
          Rating: {user.rating}
        </div>
        <div>
          {isEditingLevel ? (
            <div className="flex items-center gap-2">
              <span className="font-bold">Level:</span>
              <Input
                className="w-20"
                type="number"
                value={newLevelNumber}
                onChange={(e) => setNewLevelNumber(parseInt(e.target.value))}
              />
              <Button onClick={onSaveLevel} disabled={isLoading} size="sm">
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold">Level:</span> {user.level.level}
              <LucideEdit className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" onClick={() => setIsEditingLevel(true)} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button onClick={() => setIsChangingHandle(true)} variant="secondary">
            {/* <UserSwitch className="mr-2 h-4 w-4" /> */}
            Change Handle
          </Button>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

