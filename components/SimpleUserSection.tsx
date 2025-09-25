// components/SimpleUserSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useUser from "@/hooks/useUser";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Target, CheckCircle, AlertCircle } from 'lucide-react';

const SimpleUserSection = () => {
  const { user, updateUser, isLoading: userLoading } = useUser();
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages when handle changes
  useEffect(() => {
    if (handle.length > 0) {
      setError('');
      setSuccess('');
    }
  }, [handle]);

  // Handle form submission - UNIFIED WITH LOGIN DIALOG
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handle.trim()) {
      setError('Please enter a valid handle');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('SimpleUserSection: Attempting to update user with handle:', handle.trim());
      
      // Use the same updateUser function as LoginDialog
      const result = await updateUser(handle.trim());
      
      if (result) {
        setSuccess(`✅ Successfully logged in as ${result.handle}!`);
        setHandle('');
        
        // Optional: Show success message for a few seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error: any) {
      console.error('SimpleUserSection: Login error:', error);
      
      if (error.message?.includes('not found')) {
        setError('❌ User not found on Codeforces. Please check your handle.');
      } else {
        setError('❌ Failed to validate user. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  // Show user profile if logged in
  if (user && !userLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Profile Ready
          </CardTitle>
          <CardDescription>
            Your competitive programming training is configured
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Summary */}
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold">{user.handle}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Training problems will be generated based on your skill level
            </div>
            {user.rating ? (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Target className="h-4 w-4" />
                <span className="font-mono text-lg">Rating: {user.rating}</span>
                <span className="text-sm text-muted-foreground">({user.rank || 'Unrated'})</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Target className="h-4 w-4" />
                <span className="font-mono text-lg">Unrated</span>
              </div>
            )}
          </div>

          {/* Training Info */}
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Problem Difficulty Range</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {user.rating ? 
                `${Math.max(800, user.rating - 400)} to ${user.rating + 200} rating` : 
                '800 to 1600 rating (default for unrated)'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button size="lg" asChild>
              <a href="/training">🎯 Start Training</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/statistics">📊 Statistics</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/upsolve">📚 Upsolve</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (userLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your profile...</p>
        </CardContent>
      </Card>
    );
  }

  // Show setup form
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <User className="h-6 w-6" />
          Setup Your Training Profile
        </CardTitle>
        <CardDescription>
          Enter your Codeforces handle to personalize problem difficulty
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="handle" className="text-sm font-medium">
              Codeforces Handle
            </label>
            <div className="relative">
              <Input
                id="handle"
                type="text"
                placeholder="e.g., tourist, jiangly"
                value={handle}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className={error ? 'border-red-500 focus:border-red-500' : 
                          success ? 'border-green-500 focus:border-green-500' : ''}
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

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={!handle.trim() || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Validating & Setting Up...' : 'Setup Profile'}
          </Button>
        </form>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">How to find your handle:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Go to <strong>codeforces.com</strong> and log in</li>
            <li>• Your handle is shown in the top-right corner</li>
            <li>• It's your username, not your display name</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleUserSection;
