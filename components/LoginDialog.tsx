// components/LoginDialog.tsx
"use client";

import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
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
import { Loader2, CheckCircle, AlertCircle, User } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [handle, setHandle] = useState("");
  const { updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear error when handle changes
  useEffect(() => {
    if (handle.length > 0) {
      setError('');
    }
  }, [handle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handle.trim()) {
      setError('Please enter a valid handle');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('LoginDialog: Attempting to update user with handle:', handle.trim());
      
      // Use the SAME updateUser function as SimpleUserSection
      const result = await updateUser(handle.trim());
      
      if (result) {
        console.log('LoginDialog: Successfully logged in:', result);
        
        // Clear form and close dialog
        setHandle('');
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('LoginDialog: Login error:', error);
      
      if (error.message?.includes('not found')) {
        setError('❌ User not found on Codeforces. Please check your handle.');
      } else {
        setError('❌ Failed to validate user. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setHandle("");
        setError("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Login to Training Tracker
          </DialogTitle>
          <DialogDescription>
            Enter your Codeforces handle to start tracking your progress.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-handle" className="text-sm font-medium">
              Codeforces Handle
            </Label>
            <div className="relative">
              <Input
                id="login-handle"
                type="text"
                placeholder="e.g., tourist, jiangly"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                disabled={isLoading}
                required
                className={error ? 'border-red-500 focus:border-red-500' : ''}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!handle.trim() || isLoading}
              className="flex-1"
              onClick={() => {
              // Let form submit, then reload after successful login
              setTimeout(() => {
                if (!isLoading && handle.trim()) {
                window.location.reload();
                }
              }, 500);
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground border-t pt-3">
          <strong>How to find your handle:</strong><br />
          1. Go to codeforces.com and log in<br />
          2. Your handle is in the top-right corner<br />
          3. It's your username, not your display name
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
