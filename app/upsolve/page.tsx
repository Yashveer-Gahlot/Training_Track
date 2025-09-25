// app/upsolve/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useUser from "@/hooks/useUser";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Trash2, CheckCircle, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UpsolveProblem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  url: string;
}

interface UpsolveSession {
  id: string;
  date: string;
  problems: UpsolveProblem[];
  tags: string[];
  completedProblems: string[];
}

export default function UpsolvePage() {
  const { user, isLoading } = useUser();
  const [upsolveSessions, setUpsolveSessions] = useState<UpsolveSession[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('upsolveSessions') || '[]');
    setUpsolveSessions(saved);
  }, []);

  const toggleProblemCompleted = (sessionId: string, problemKey: string) => {
    const updated = upsolveSessions.map(session => {
      if (session.id === sessionId) {
        const completedSet = new Set(session.completedProblems);
        if (completedSet.has(problemKey)) {
          completedSet.delete(problemKey);
        } else {
          completedSet.add(problemKey);
        }
        return {
          ...session,
          completedProblems: Array.from(completedSet)
        };
      }
      return session;
    });
    
    setUpsolveSessions(updated);
    localStorage.setItem('upsolveSessions', JSON.stringify(updated));
  };

  const deleteUpsolveSession = (sessionId: string) => {
    const updated = upsolveSessions.filter(session => session.id !== sessionId);
    setUpsolveSessions(updated);
    localStorage.setItem('upsolveSessions', JSON.stringify(updated));
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
              Please setup your Codeforces profile first to view upsolve problems.
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
        <h1 className="text-3xl font-bold">Upsolve Problems</h1>
        <p className="text-muted-foreground">
          Complete problems you couldn't solve during training
        </p>
      </div>

      {upsolveSessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Problems to Upsolve</h3>
            <p className="text-muted-foreground mb-4">
              Unsolved problems from training sessions will appear here.
            </p>
            <Button asChild>
              <Link href="/training">Start Training</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {upsolveSessions.map((session) => {
            const totalProblems = session.problems.length;
            const completedProblems = session.completedProblems.length;
            const completionRate = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

            return (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {new Date(session.date).toLocaleDateString()}
                      </CardTitle>
                      <CardDescription>
                        {completedProblems}/{totalProblems} completed ({completionRate}%)
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUpsolveSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {session.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {session.problems.map((problem) => {
                      const problemKey = `${problem.contestId}${problem.index}`;
                      const isCompleted = session.completedProblems.includes(problemKey);

                      return (
                        <div 
                          key={problemKey} 
                          className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() => toggleProblemCompleted(session.id, problemKey)}
                                />
                                {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                              </div>
                              
                              <div className="flex-1">
                                <h3 className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                  {problem.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">
                                    {problem.rating}
                                  </Badge>
                                  <Badge variant="outline">
                                    {problem.contestId}{problem.index}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {problem.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              variant={isCompleted ? "outline" : "default"}
                              asChild
                            >
                              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {isCompleted ? 'Review' : 'Solve'}
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
