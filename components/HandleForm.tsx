"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Response } from "@/types/Response";

interface HandleFormProps {
  onUpdateSuccess: (handle: string) => Promise<Response<string>>;
}

const HandleForm = ({ onUpdateSuccess }: HandleFormProps) => {
  const [codeforcesHandle, setCodeforcesHandle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async () => {
    if (!codeforcesHandle.trim()) {
      setErrorMessage("Please enter a Codeforces handle.");
      return;
    }

    setErrorMessage("");
    setIsUpdating(true);
    const result = await onUpdateSuccess(codeforcesHandle);
    if (!result.success) {
      setErrorMessage(result.error);
    }
    setIsUpdating(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <Input
          type="text"
          value={codeforcesHandle}
          onChange={(e) => setCodeforcesHandle(e.target.value)}
          placeholder="Enter Codeforces handle"
          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
        />
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full md:w-auto"
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
    </div>
  );
};

export default HandleForm;

