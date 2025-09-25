// app/statistics/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useUser from "@/hooks/useUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, TrendingUp, Target, Clock, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SessionPerformance {
  sessionId: string;
  date: string;
  totalProblems: number;
  solvedProblems: number;
  tags: string[];
  userRating: number;
  solveTime: number;
}

export default function StatisticsPage() {
  const { user, isLoading } = useUser();
  const [performance, setPerformance] = useState<SessionPerformance[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalProblems: 0,
    totalSolved: 0,
    averageAccuracy: 0,
    totalTime: 0,
    topTags: [] as { tag: string; count: number }[]
  });

  useEffect(() => {
    const savedPerformance = JSON.parse(localStorage.getItem('trainingPerformance') || '[]');
    setPerformance(savedPerformance);

    if (savedPerformance.length > 0) {
      const totalSessions = savedPerformance.length;
      const totalProblems = savedPerformance.reduce((sum: number, session: SessionPerformance) => sum + session.totalProblems, 0);
      const totalSolved = savedPerformance.reduce((sum: number, session: SessionPerformance) => sum + session.solvedProblems, 0);
      const totalTime = savedPerformance.reduce((sum: number, session: SessionPerformance) => sum + session.solveTime, 0);
      const averageAccuracy = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

      const tagCounts: { [key: string]: number } = {};
      savedPerformance.forEach((session: SessionPerformance) => {
        session.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      setStats({
        totalSessions,
        totalProblems,
        totalSolved,
        averageAccuracy,
        totalTime,
        topTags
      });
    }
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
              Please setup your Codeforces profile first to view statistics.
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
        <h1 className="text-3xl font-bold">Training Statistics</h1>
        <p className="text-muted-foreground">
          Track your competitive programming progress
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Problems Attempted</p>
                <p className="text-2xl font-bold">{stats.totalProblems}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Problems Solved</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalSolved}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.averageAccuracy}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.topTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Practiced Topics</CardTitle>
            <CardDescription>Your focus areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topTags.map(({ tag, count }) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="font-medium">{tag}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(count / stats.totalSessions) * 100} className="w-24" />
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {performance.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance.slice(-10).reverse().map((session) => (
                <div key={session.sessionId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.solvedProblems}/{session.totalProblems} problems • 
                      Time: {formatTime(session.solveTime)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((session.solvedProblems / session.totalProblems) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete training sessions to see statistics.
            </p>
            <Button asChild>
              <Link href="/training">Start Training</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
