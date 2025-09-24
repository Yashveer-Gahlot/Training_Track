// src/components/LoginDialog.tsx
"use client";

import { useState } from "react";
import useUser from "@/providers/userProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!codeforcesHandle.trim()) {
      setError("Please enter a Codeforces handle.");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await updateUser(codeforcesHandle.trim());

    if (res.success) {
      setCodeforcesHandle("");
      onOpenChange(false);
    } else {
      setError(res.error);
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setCodeforcesHandle("");
        setError("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Training Tracker</DialogTitle>
          <DialogDescription>
            Enter your Codeforces handle to get started with tracking your competitive programming progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-handle">Codeforces Handle</Label>
            <Input
              id="login-handle"
              type="text"
              placeholder="e.g., tourist"
              value={codeforcesHandle}
              onChange={(e) => setCodeforcesHandle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogin}
              disabled={isLoading || !codeforcesHandle.trim()}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
