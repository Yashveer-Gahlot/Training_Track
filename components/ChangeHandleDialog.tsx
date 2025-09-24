// src/components/ChangeHandleDialog.tsx
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

interface ChangeHandleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangeHandleDialog = ({ open, onOpenChange }: ChangeHandleDialogProps) => {
  const [newHandle, setNewHandle] = useState("");
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    if (!newHandle.trim()) {
      setError("Please enter a new Codeforces handle.");
      return;
    }

    if (newHandle.trim() === user?.codeforcesHandle) {
      setError("New handle cannot be the same as current handle.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    const res = await updateUser(newHandle.trim());

    if (res.success) {
      setSuccess(true);
      setNewHandle("");
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } else {
      setError(res.error);
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleChange();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setNewHandle("");
        setError("");
        setSuccess(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Codeforces Handle</DialogTitle>
          <DialogDescription>
            Enter a new Codeforces handle to update your profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="current-handle">Current Handle</Label>
            <Input
              id="current-handle"
              type="text"
              value={user?.codeforcesHandle || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-handle">New Handle</Label>
            <Input
              id="new-handle"
              type="text"
              placeholder="Enter new handle"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>Handle updated successfully!</AlertDescription>
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
              onClick={handleChange}
              disabled={isLoading || !newHandle.trim()}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Handle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeHandleDialog;
