// app/training/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useUser from "@/hooks/useUser";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Timer, Play, Square, Target, CheckCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  url: string;
}

interface TrainingSession {
  id: string;
  startTime: number;
  duration: number;
  problems: Problem[];
  solvedProblems: string[];
  selectedTags: string[];
  userRating: number;
}

const AVAILABLE_TAGS = [
  'implementation', 'math', 'greedy', 'dp', 'data structures',
  'brute force', 'constructive algorithms', 'graphs', 'sortings',
  'binary search', 'dfs and similar', 'trees', 'strings', 'number theory',
  'combinatorics', 'geometry', 'bitmasks', 'two pointers', 'dsu',
  'shortest paths', 'probabilities', 'divide and conquer'
];

// Suggested tags based on user rating
const getRecommendedTags = (rating: number = 1200) => {
  if (rating < 1000) {
    return ['implementation', 'math', 'brute force', 'greedy'];
  } else if (rating < 1400) {
    return ['implementation', 'math', 'greedy', 'sortings', 'binary search'];
  } else if (rating < 1800) {
    return ['dp', 'data structures', 'graphs', 'dfs and similar', 'trees'];
  } else {
    return ['dp', 'graphs', 'number theory', 'combinatorics', 'geometry'];
  }
};

export default function TrainingPage() {
  const { user, isLoading } = useUser();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  // Load active session
  useEffect(() => {
    const savedSession = localStorage.getItem('activeTrainingSession');
    if (savedSession) {
      const session: TrainingSession = JSON.parse(savedSession);
      const now = Date.now();
      const elapsed = now - session.startTime;
      
      if (elapsed < session.duration) {
        setCurrentSession(session);
        setProblems(session.problems);
        setTimeLeft(session.duration - elapsed);
        setSolvedProblems(new Set(session.solvedProblems));
        setSelectedTags(session.selectedTags);
      } else {
        localStorage.removeItem('activeTrainingSession');
        moveToUpsolve(session);
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (currentSession && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            endSession();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentSession, timeLeft]);

  const generateProblems = async () => {
    if (selectedTags.length === 0) {
      alert('Please select at least one tag to generate problems.');
      return;
    }
    
    if (selectedTags.length > 6) {
      alert('Please select maximum 6 tags for better problem filtering.');
      return;
    }

    if (!user) return;

    setIsGenerating(true);
    try {
      const response = await fetch('https://codeforces.com/api/problemset.problems');
      const data = await response.json();
      
      if (data.status === "OK") {
        const userRating = user.rating || 1200;
        const minRating = Math.max(800, userRating - 400);
        const maxRating = userRating + 200;
        
        console.log(`Filtering problems: Rating ${minRating}-${maxRating}, Tags: ${selectedTags.join(', ')}`);
        
        const filteredProblems = data.result.problems
          .filter((problem: any) => 
            problem.rating && 
            problem.rating >= minRating && 
            problem.rating <= maxRating &&
            selectedTags.some(tag => problem.tags?.includes(tag))
          )
          .map((problem: any) => ({
            contestId: problem.contestId,
            index: problem.index,
            name: problem.name,
            rating: problem.rating,
            tags: problem.tags,
            url: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`
          }))
          .sort(() => Math.random() - 0.5) // Shuffle problems
          .slice(0, 8);

        console.log(`Found ${filteredProblems.length} problems`);

        if (filteredProblems.length < 3) {
          alert(`Only found ${filteredProblems.length} problems for your selected tags and rating range (${minRating}-${maxRating}). Try selecting different tags or check if your rating range is too narrow.`);
          setIsGenerating(false);
          return;
        }

        const session: TrainingSession = {
          id: Date.now().toString(),
          startTime: Date.now(),
          duration: 2 * 60 * 60 * 1000, // 2 hours
          problems: filteredProblems,
          solvedProblems: [],
          selectedTags,
          userRating
        };

        setCurrentSession(session);
        setProblems(filteredProblems);
        setTimeLeft(session.duration);
        localStorage.setItem('activeTrainingSession', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      alert('Failed to fetch problems. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectRecommendedTags = () => {
    const recommended = getRecommendedTags(user?.rating);
    setSelectedTags(recommended);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 6) {
        alert('Maximum 6 tags allowed for better problem filtering.');
        return;
      }
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const toggleProblemSolved = (problemKey: string) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(problemKey)) {
      newSolved.delete(problemKey);
    } else {
      newSolved.add(problemKey);
    }
    setSolvedProblems(newSolved);
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        solvedProblems: Array.from(newSolved)
      };
      setCurrentSession(updatedSession);
      localStorage.setItem('activeTrainingSession', JSON.stringify(updatedSession));
    }
  };

  const endSession = () => {
    if (currentSession) {
      moveToUpsolve(currentSession);
      localStorage.removeItem('activeTrainingSession');
      setCurrentSession(null);
      setProblems([]);
      setTimeLeft(0);
      setSolvedProblems(new Set());
      setSelectedTags([]);
    }
  };

  const moveToUpsolve = (session: TrainingSession) => {
    const upsolveProblems = session.problems.filter(
      problem => !session.solvedProblems.includes(`${problem.contestId}${problem.index}`)
    );
    
    if (upsolveProblems.length > 0) {
      const upsolveSession = {
        id: session.id,
        date: new Date(session.startTime).toISOString(),
        problems: upsolveProblems,
        tags: session.selectedTags,
        completedProblems: []
      };
      
      const existingUpsolve = JSON.parse(localStorage.getItem('upsolveSessions') || '[]');
      existingUpsolve.push(upsolveSession);
      localStorage.setItem('upsolveSessions', JSON.stringify(existingUpsolve));
    }
    
    const performance = {
      sessionId: session.id,
      date: new Date(session.startTime).toISOString(),
      totalProblems: session.problems.length,
      solvedProblems: session.solvedProblems.length,
      tags: session.selectedTags,
      userRating: session.userRating,
      solveTime: Date.now() - session.startTime
    };
    
    const existingPerformance = JSON.parse(localStorage.getItem('trainingPerformance') || '[]');
    existingPerformance.push(performance);
    localStorage.setItem('trainingPerformance', JSON.stringify(existingPerformance));
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Setup Required</h2>
            <p className="text-muted-foreground mb-4">
              Please setup your Codeforces profile first to start training.
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Setup
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Training Session</h1>
        <p className="text-muted-foreground">
          2-hour focused practice with problems matching your level
        </p>
      </div>

      {!currentSession ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Setup Training Session
            </CardTitle>
            <CardDescription>
              Select problem tags and generate problems matching your skill level
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Profile Info */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold">Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Handle: <strong>{user.handle}</strong> | 
                Rating: <strong>{user.rating || 'Unrated'}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Problems will be generated from {user.rating ? Math.max(800, user.rating - 400) : 800} to {user.rating ? user.rating + 200 : 1600} difficulty
              </p>
            </div>

            {/* Tag Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select Problem Tags ({selectedTags.length}/6)</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectRecommendedTags}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Use Recommended
                </Button>
              </div>
              
              {/* Recommended Tags Info */}
              {user.rating && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Recommended for your rating ({user.rating}):</strong> {getRecommendedTags(user.rating).join(', ')}
                  </p>
                </div>
              )}

              {/* Tag Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AVAILABLE_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  const isRecommended = getRecommendedTags(user.rating).includes(tag);
                  
                  return (
                    <div 
                      key={tag} 
                      className={`flex items-center space-x-2 p-2 rounded border ${
                        isRecommended ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                      }`}
                    >
                      <Checkbox
                        id={tag}
                        checked={isSelected}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <label 
                        htmlFor={tag} 
                        className={`text-sm cursor-pointer flex-1 ${
                          isSelected ? 'font-medium' : ''
                        }`}
                      >
                        {tag}
                        {isRecommended && <span className="text-blue-600 dark:text-blue-400 ml-1">⭐</span>}
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag} ✕
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateProblems}
              disabled={selectedTags.length === 0 || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Problems for Your Level...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start 2-Hour Training Session ({selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'})
                </>
              )}
            </Button>

            {/* Alerts */}
            {selectedTags.length === 0 && (
              <Alert>
                <AlertDescription>
                  Please select at least 1 tag to generate problems. We recommend 2-4 tags for the best variety.
                </AlertDescription>
              </Alert>
            )}

            {selectedTags.length > 6 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Too many tags selected! Please select maximum 6 tags for better problem filtering.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        /* ACTIVE SESSION */
        <div className="space-y-6">
          {/* Timer and Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span className="text-2xl font-mono font-bold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {solvedProblems.size} of {problems.length} solved
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {currentSession.selectedTags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="destructive" onClick={endSession}>
                  <Square className="mr-2 h-4 w-4" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          <div className="grid gap-4">
            {problems.map((problem, index) => {
              const problemKey = `${problem.contestId}${problem.index}`;
              const isSolved = solvedProblems.has(problemKey);
              
              return (
                <Card key={problemKey} className={isSolved ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isSolved}
                            onCheckedChange={() => toggleProblemSolved(problemKey)}
                          />
                          {isSolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {String.fromCharCode(65 + index)}. {problem.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Rating: {problem.rating}</Badge>
                            <Badge variant="outline">{problem.contestId}{problem.index}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {problem.tags.slice(0, 4).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {problem.tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{problem.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button asChild>
                        <a href={problem.url} target="_blank" rel="noopener noreferrer">
                          Solve
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
