// components/LoginButton.tsx
"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import LoginDialog from "./LoginDialog";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

const LoginButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, setUser, isLoading } = useUser();

  const handleLogout = () => {
    console.log('LoginButton: Logging out user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (user) {
    console.log('LoginButton: User is logged in:', user);
    return (
      <div className="flex items-center space-x-3">
        {/* User Info */}
        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <span className="font-medium">{user.handle}</span>
          {user.rating && (
            <span className="text-muted-foreground font-mono">
              ({user.rating})
            </span>
          )}
        </div>
        
        {/* Mobile: Just handle */}
        <div className="sm:hidden text-sm font-medium">
          {user.handle}
        </div>
        
        {/* Logout Button */}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Out</span>
        </Button>
      </div>
    );
  }

  console.log('LoginButton: No user, showing login button');
  return (
    <>
      <Button size="sm" onClick={() => setIsDialogOpen(true)}>
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
      <LoginDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};

export default LoginButton;

