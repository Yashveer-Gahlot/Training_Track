// providers/UserProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Enhanced user interface with Codeforces data
// Enhanced user interface with Codeforces data
interface User {
  
  handle?: string;  // Add this property
  level?: string | number;    // Add this property
  firstName?: string;
  lastName?: string;
  email?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution?: number;
  lastOnlineTimeSeconds?: number;
  registrationTimeSeconds?: number;
  friendOfCount?: number;
  avatar?: string;
  titlePhoto?: string;
}


interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  updateUser: (handle: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch detailed user information from Codeforces API
  const updateUser = async (handle: string) => {
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();
    
    if (data.status === "OK" && data.result.length > 0) {
      const codeforcesUser = data.result[0];
      
      const enhancedUser: User = {
        handle: codeforcesUser.handle,
 
        level: codeforcesUser.rank || codeforcesUser.rating || 'unrated', // Add this line
        firstName: codeforcesUser.firstName,
        lastName: codeforcesUser.lastName,
        email: codeforcesUser.email,
        rating: codeforcesUser.rating,
        maxRating: codeforcesUser.maxRating,
        rank: codeforcesUser.rank,
        maxRank: codeforcesUser.maxRank,
        country: codeforcesUser.country,
        city: codeforcesUser.city,
        organization: codeforcesUser.organization,
        contribution: codeforcesUser.contribution,
        lastOnlineTimeSeconds: codeforcesUser.lastOnlineTimeSeconds,
        registrationTimeSeconds: codeforcesUser.registrationTimeSeconds,
        friendOfCount: codeforcesUser.friendOfCount,
        avatar: codeforcesUser.avatar,
        titlePhoto: codeforcesUser.titlePhoto,
      };
      
      setUser(enhancedUser);
    }
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    // Fallback to basic user object
    setUser({ 
      handle,

      level: 'unrated' // Add this line
    });
  }
};


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // If stored user doesn't have rating info, fetch it
        if (parsedUser.handle && !parsedUser.rating && parsedUser.rating !== 0) {
          updateUser(parsedUser.handle);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, isLoading]);

  const value = { user, setUser, isLoading, updateUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
