// components/UserIndicator.tsx

'use client';

import React from 'react';
import { useUser } from '@/providers/UserProvider';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// A safer function to get initials that handles undefined or empty names.
const getInitials = (name?: string): string => {
  // If name is null, undefined, or an empty string, return a default character.
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return '?';
  }
  
  // If the name is valid, return the first letter, capitalized.
  return name.trim().slice(0, 1).toUpperCase();
};

const UserIndicator = () => {
  const { user, isLoading } = useUser();

  // 1. First, handle the loading state.
  // While the user object is being loaded from localStorage, show a placeholder.
  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  // 2. Next, handle the case where the user is not logged in.
  // If loading is finished and the user is still null, render nothing.
  if (!user) {
    return null; 
  }

  // 3. Only if loading is complete AND a user exists, render the avatar.
  const initials = getInitials(user.handle);

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default UserIndicator;
