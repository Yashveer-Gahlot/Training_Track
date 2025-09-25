// components/EnhancedUserSectionFull.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useUser from "@/hooks/useUser";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, User, Trophy, Star, Medal, MapPin, Building2, Calendar, TrendingUp, Award, Target } from 'lucide-react';

interface ValidationState {
  isValid: boolean;
  isValidating: boolean;
  message: string;
  type: 'idle' | 'validating' | 'success' | 'error';
  userData?: any;
}

const EnhancedUserSectionFull = () => {
  const { user, updateUser } = useUser();
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    isValidating: false,
    message: "",
    type: 'idle'
  });

  const getRankColor = (rank?: string) => {
    if (!rank) return 'text-gray-500';
    const lowerRank = rank.toLowerCase();
    if (lowerRank.includes('legendary')) return 'text-red-600';
    if (lowerRank.includes('international')) return 'text-red-500';
    if (lowerRank.includes('grandmaster')) return 'text-red-400';
    if (lowerRank.includes('master')) return 'text-orange-500';
    if (lowerRank.includes('candidate')) return 'text-violet-500';
    if (lowerRank.includes('expert')) return 'text-blue-500';
    if (lowerRank.includes('specialist')) return 'text-cyan-500';
    if (lowerRank.includes('pupil')) return 'text-green-500';
    return 'text-gray-500';
  };

  const getRankBgColor = (rank?: string) => {
    if (!rank) return 'bg-gray-500';
    const lowerRank = rank.toLowerCase();
    if (lowerRank.includes('legendary')) return 'bg-red-600';
    if (lowerRank.includes('international')) return 'bg-red-500';
    if (lowerRank.includes('grandmaster')) return 'bg-red-400';
    if (lowerRank.includes('master')) return 'bg-orange-500';
    if (lowerRank.includes('candidate')) return 'bg-violet-500';
    if (lowerRank.includes('expert')) return 'bg-blue-500';
    if (lowerRank.includes('specialist')) return 'bg-cyan-500';
    if (lowerRank.includes('pupil') || lowerRank.includes('newbie')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getRankIcon = (rank?: string) => {
    if (!rank) return <User className="h-6 w-6" />;
    const lowerRank = rank.toLowerCase();
    if (lowerRank.includes('legendary') || lowerRank.includes('international')) {
      return <Trophy className="h-6 w-6" />;
    }
    if (lowerRank.includes('grandmaster')) {
      return <Medal className="h-6 w-6" />;
    }
    if (lowerRank.includes('master') || lowerRank.includes('candidate')) {
      return <Star className="h-6 w-6" />;
    }
    return <User className="h-6 w-6" />;
  };

  const validateHandle = async (inputHandle: string) => {
    if (!inputHandle.trim()) {
      setValidation({
        isValid: false,
        isValidating: false,
        message: "",
        type: 'idle'
      });
      return;
    }

    if (inputHandle.length < 3) {
      setValidation({
        isValid: false,
        isValidating: false,
        message: "Handle must be at least 3 characters long",
        type: 'error'
      });
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(inputHandle)) {
      setValidation({
        isValid: false,
        isValidating: false,
        message: "Handle can only contain letters, numbers, dots, hyphens, and underscores",
        type: 'error'
      });
      return;
    }

    setValidation({
      isValid: false,
      isValidating: true,
      message: "Fetching user profile from Codeforces...",
      type: 'validating'
    });

    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${inputHandle}`);
      const data = await response.json();

      if (data.status === "OK" && data.result.length > 0) {
        const codeforcesUser = data.result[0];
        const displayName = codeforcesUser.firstName && codeforcesUser.lastName 
          ? `${codeforcesUser.firstName} ${codeforcesUser.lastName}` 
          : codeforcesUser.handle;
        
        const ratingText = codeforcesUser.rating 
          ? `${codeforcesUser.rating} (${codeforcesUser.rank || 'Unrated'})` 
          : 'Unrated';

        setValidation({
          isValid: true,
          isValidating: false,
          message: `✓ Found: ${displayName} • Rating: ${ratingText}`,
          type: 'success',
          userData: codeforcesUser
        });
      } else {
        setValidation({
          isValid: false,
          isValidating: false,
          message: "User not found on Codeforces. Please check the handle.",
          type: 'error'
        });
      }
    } catch (error) {
      setValidation({
        isValid: false,
        isValidating: false,
        message: "Failed to validate user. Please try again.",
        type: 'error'
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (handle.trim()) {
        validateHandle(handle.trim());
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [handle]);

  const handleSubmit = async () => {
    if (!validation.isValid || !validation.userData) return;

    setIsLoading(true);
    try {
      // 🔧 FIX: Pass only the handle string, not the entire user object
      // Your updateUser function likely expects just the handle string
      await updateUser(validation.userData.handle);
      
      setHandle('');
      setValidation({
        isValid: false,
        isValidating: false,
        message: "",
        type: 'idle'
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setValidation({
        isValid: false,
        isValidating: false,
        message: "Failed to save user data. Please try again.",
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationIcon = () => {
    switch (validation.type) {
      case 'validating':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return validation.userData?.rank ? 
          <span className={getRankColor(validation.userData.rank)}>
            {getRankIcon(validation.userData.rank)}
          </span> :
          <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  // If user is already logged in, show their enhanced profile
  if (user) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-full text-white ${getRankBgColor(user.rank)}`}>
              {getRankIcon(user.rank)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-4">
                {user.firstName && user.lastName ? 
                  `${user.firstName} ${user.lastName}` : 
                  user.handle
                }
                {user.rank && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRankBgColor(user.rank)} text-white`}>
                    {user.rank}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-lg mt-1">
                @{user.handle}
                {user.rating && (
                  <span className={`ml-3 font-mono font-bold text-xl ${getRankColor(user.rank)}`}>
                    {user.rating}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.rating && (
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className={`text-2xl font-bold ${getRankColor(user.rank)} flex items-center justify-center gap-2`}>
                  <Target className="h-5 w-5" />
                  {user.rating}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Current Rating</div>
              </div>
            )}
            {user.maxRating && (
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
                <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {user.maxRating}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Max Rating</div>
                {user.maxRank && (
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">({user.maxRank})</div>
                )}
              </div>
            )}
            {user.contribution !== undefined && (
              <div className={`text-center p-4 bg-gradient-to-br ${user.contribution >= 0 ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700' : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'} rounded-xl border`}>
                <div className={`text-2xl font-bold ${user.contribution >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center justify-center gap-2`}>
                  <Award className="h-5 w-5" />
                  {user.contribution > 0 ? '+' : ''}{user.contribution}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Contribution</div>
              </div>
            )}
            {user.friendOfCount && (
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="text-2xl font-bold text-purple-500 flex items-center justify-center gap-2">
                  <User className="h-5 w-5" />
                  {user.friendOfCount}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Friends</div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(user.country || user.organization || user.registrationTimeSeconds) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              {user.country && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">
                    {user.city && `${user.city}, `}{user.country}
                  </span>
                </div>
              )}
              {user.organization && (
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{user.organization}</span>
                </div>
              )}
              {user.registrationTimeSeconds && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">
                    Joined {new Date(user.registrationTimeSeconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button size="lg" asChild className="flex-1 min-w-fit">
              <a href="/training">🚀 Start Training</a>
            </Button>
            <Button variant="outline" size="lg" asChild className="flex-1 min-w-fit">
              <a href="/statistics">📊 View Statistics</a>
            </Button>
            <Button variant="outline" size="lg" asChild className="flex-1 min-w-fit">
              <a href={`https://codeforces.com/profile/${user.handle}`} target="_blank" rel="noopener noreferrer">
                🔗 CF Profile
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Enhanced username input form
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="text-2xl">Enter Your Codeforces Handle</CardTitle>
        <CardDescription className="text-lg">
          We'll fetch your complete profile, rating, and statistics from Codeforces
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., tourist, jiangly, benq, ecnerwala"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && validation.isValid && handleSubmit()}
              disabled={isLoading}
              className={`text-lg py-6 pr-14 ${
                validation.type === 'success' ? 'border-green-500 focus:border-green-500' :
                validation.type === 'error' ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {getValidationIcon()}
            </div>
          </div>
          
          {/* Real-time feedback */}
          {validation.message && (
            <div className={`text-sm flex items-start gap-2 p-3 rounded-lg ${
              validation.type === 'success' ? 'text-green-700 bg-green-50 border border-green-200' :
              validation.type === 'error' ? 'text-red-700 bg-red-50 border border-red-200' :
              validation.type === 'validating' ? 'text-blue-700 bg-blue-50 border border-blue-200' :
              'text-gray-700 bg-gray-50 border border-gray-200'
            }`}>
              <span className="leading-5 font-medium">{validation.message}</span>
            </div>
          )}

          {!handle.trim() && (
            <div className="text-sm text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
              💡 <strong>Tip:</strong> Your handle is your username visible in Codeforces contests and profile
            </div>
          )}
        </div>

        {/* Preview Section - Shows when user is found */}
        {validation.type === 'success' && validation.userData && (
          <div className="space-y-6 border-t pt-6">
            {/* User Preview */}
            <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <div className={`p-3 rounded-full text-white ${getRankBgColor(validation.userData.rank)}`}>
                {getRankIcon(validation.userData.rank)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  {validation.userData.firstName && validation.userData.lastName ? 
                    `${validation.userData.firstName} ${validation.userData.lastName}` : 
                    validation.userData.handle
                  }
                  {validation.userData.rank && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getRankBgColor(validation.userData.rank)} text-white`}>
                      {validation.userData.rank}
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground">
                  @{validation.userData.handle}
                  {validation.userData.rating && (
                    <span className={`ml-2 font-mono font-bold ${getRankColor(validation.userData.rank)}`}>
                      {validation.userData.rating}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Stats Preview */}
            {(validation.userData.rating || validation.userData.maxRating) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {validation.userData.rating && (
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className={`text-lg font-bold ${getRankColor(validation.userData.rank)}`}>
                      {validation.userData.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                )}
                {validation.userData.maxRating && (
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="text-lg font-bold text-orange-500">
                      {validation.userData.maxRating}
                    </div>
                    <div className="text-xs text-muted-foreground">Max</div>
                  </div>
                )}
                {validation.userData.contribution !== undefined && (
                  <div className={`text-center p-3 rounded-lg border ${
                    validation.userData.contribution >= 0 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  }`}>
                    <div className={`text-lg font-bold ${validation.userData.contribution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {validation.userData.contribution > 0 ? '+' : ''}{validation.userData.contribution}
                    </div>
                    <div className="text-xs text-muted-foreground">Contrib</div>
                  </div>
                )}
                {validation.userData.friendOfCount && (
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-lg font-bold text-purple-500">
                      {validation.userData.friendOfCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Friends</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {validation.type === 'error' && validation.message.includes('not found') && (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              <strong>User not found!</strong><br />
              • Double-check your handle spelling<br />
              • Make sure you have a Codeforces account<br />
              • Visit: <code>codeforces.com/profile/[your-handle]</code>
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!validation.isValid || isLoading || validation.isValidating}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isLoading ? "Setting Up Your Profile..." : 
           validation.isValid ? "🎉 Use This Profile" : 
           "Get My Codeforces Profile"}
        </Button>

        {!handle.trim() && (
          <div className="text-center space-y-2 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <strong>What we'll show you:</strong>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span>📊 Rating & Rank</span>
              <span>🏆 Contest Stats</span>
              <span>🌍 Profile Info</span>
              <span>📅 Registration Date</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedUserSectionFull;
