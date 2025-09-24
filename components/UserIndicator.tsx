// src/components/UserIndicator.tsx
"use client";

import { useState } from "react";
import useUser from "@/providers/userProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import ChangeHandleDialog from "./ChangeHandleDialog";

const UserIndicator = () => {
  const { user, logout } = useUser();
  const [showChangeHandle, setShowChangeHandle] = useState(false);

  if (!user) return null;

  const getInitials = (handle: string) => {
    return handle.slice(0, 2).toUpperCase();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return "text-red-600";
    if (rating >= 2100) return "text-orange-600";
    if (rating >= 1900) return "text-purple-600";
    if (rating >= 1600) return "text-blue-600";
    if (rating >= 1400) return "text-cyan-600";
    if (rating >= 1200) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.codeforcesHandle} />
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {getInitials(user.codeforcesHandle)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user.codeforcesHandle}</p>
              <p className={`text-xs ${getRatingColor(user.rating || 0)}`}>
                Rating: {user.rating || "Unrated"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.codeforcesHandle}</p>
              <p className={`text-xs ${getRatingColor(user.rating || 0)}`}>
                Rating: {user.rating || "Unrated"}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowChangeHandle(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Change Handle
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeHandleDialog open={showChangeHandle} onOpenChange={setShowChangeHandle} />
    </>
  );
};

export default UserIndicator;
