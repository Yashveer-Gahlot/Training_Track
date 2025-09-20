"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const { updateUser } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeCodeforcesHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeforcesHandle(e.target.value);
  };

  const onUpdateUser = async () => {
    if (!codeforcesHandle.trim()) {
      setErrorMessage("Please enter a Codeforces handle.");
      return;
    }

    setIsUpdating(true);
    setErrorMessage(""); // Clear previous errors on a new attempt

    const res = await updateUser(codeforcesHandle);

    if (!res.success) {
      setErrorMessage(res.error);
    }
    // If the update is successful, the parent component (page.tsx)
    // will automatically re-render and replace this component with the Profile.
    
    setIsUpdating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUpdateUser();
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4 w-full max-w-md mx-auto">
      <div className="w-full space-y-2">
        <label htmlFor="codeforcesHandle" className="text-sm font-medium text-muted-foreground">
          Codeforces Handle
        </label>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
          <Input
            id="codeforcesHandle"
            type="text"
            className="w-full"
            value={codeforcesHandle}
            onChange={onChangeCodeforcesHandle}
            onKeyDown={handleKeyDown}
            placeholder="e.g., tourist"
          />
          <Button
            className="w-full sm:w-auto"
            onClick={onUpdateUser}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
      {errorMessage && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
    </div>
  );
};

export default Settings;
