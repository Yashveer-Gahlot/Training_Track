// hooks/useUser.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  handle: string;
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

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log('Saving user to localStorage:', user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.log('Removing user from localStorage');
        localStorage.removeItem('user');
      }
    }
  }, [user, isLoading]);

  // Update user function - fetches full profile from Codeforces
  const updateUser = useCallback(async (handle: string) => {
    console.log('updateUser called with handle:', handle);
    
    try {
      // Fetch user info from Codeforces API
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const data = await response.json();
      
      console.log('Codeforces API response:', data);
      
      if (data.status === "OK" && data.result.length > 0) {
        const codeforcesUser = data.result[0];
        
        const enhancedUser: User = {
          handle: codeforcesUser.handle,
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
        
        console.log('Setting enhanced user:', enhancedUser);
        setUser(enhancedUser);
        return enhancedUser;
      } else {
        throw new Error('User not found on Codeforces');
      }
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }, []);

  return {
    user,
    setUser,
    isLoading,
    updateUser
  };
};

export default useUser;
