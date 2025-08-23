'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Octokit } from '@octokit/rest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { GitHubRoastEngine, type GitHubUser, type Repository, type CommitData } from '@/lib/roast-engine';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const roastEngine = new GitHubRoastEngine();

export default function RoastResultsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [roastText, setRoastText] = useState('');
  const [roastScore, setRoastScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [error, setError] = useState('');

  const fetchGitHubData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user data
      const { data: user } = await octokit.rest.users.getByUsername({
        username: username,
      });

      // Fetch repositories
      const { data: repos } = await octokit.rest.repos.listForUser({
        username: username,
        sort: 'updated',
        per_page: 10,
      });

      // Fetch commits from the most recent repositories
      const commitPromises = repos.slice(0, 3).map(async (repo) => {
        try {
          const { data: repoCommits } = await octokit.rest.repos.listCommits({
            owner: username,
            repo: repo.name,
            author: username,
            per_page: 10,
          });
          return repoCommits.map(commit => ({
            message: commit.commit.message,
            date: commit.commit.author?.date || '',
            repo: repo.name,
            sha: commit.sha,
          }));
        } catch {
          return [];
        }
      });

      const allCommits = (await Promise.all(commitPromises)).flat();

      setUserData(user);
      setRepositories(repos);
      setCommits(allCommits);

      // Generate roast using the engine
      const roastResult = roastEngine.generateRoast(user, repos, allCommits);
      setRoastText(roastResult.roast);
      setRoastScore(roastResult.score);
      setBadges(roastResult.badges);

    } catch (err: unknown) {
      console.error('Error fetching GitHub data:', err);
      const error = err as { status?: number };
      if (error.status === 404) {
        setError(`GitHub user "${username}" not found. Check the username and try again.`);
      } else if (error.status === 403) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError('Failed to fetch GitHub data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchGitHubData();
    }
  }, [username, fetchGitHubData]);

  const shareRoast = () => {
    if (navigator.share) {
      navigator.share({
        title: `🔥 ${username}'s GitHub Roast`,
        text: roastText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`🔥 ${username}'s GitHub Roast:\n\n${roastText}\n\nGenerated at: ${window.location.href}`);
      toast.success('Roast copied to clipboard!');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-red-700';
    if (score >= 60) return 'from-orange-500 to-orange-700';
    if (score >= 40) return 'from-yellow-500 to-yellow-700';
    return 'from-green-500 to-green-700';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ABSOLUTELY ROASTED 🔥';
    if (score >= 60) return 'WELL DONE 🌶️';
    if (score >= 40) return 'LIGHTLY TOASTED 🍞';
    return 'BARELY WARMED UP 😎';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-slate-950/80 flex items-center justify-center">
        <Card className="w-96 bg-black/60 backdrop-blur-xl border-2 border-white/10">
          <CardContent className="p-12 text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto"></div>
            <h2 className="text-3xl font-bold text-white">Analyzing {username}...</h2>
            <p className="text-gray-400 text-lg">Preparing the roast of a lifetime 🔥</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-slate-950/80 flex items-center justify-center">
        <Card className="w-96 bg-black/60 backdrop-blur-xl border-2 border-red-500/20">
          <CardContent className="p-12 text-center space-y-6">
            <div className="text-6xl">😕</div>
            <h2 className="text-3xl font-bold text-white">Oops!</h2>
            <p className="text-red-300 text-lg">{error}</p>
            <Button 
              onClick={() => router.push('/')} 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-slate-950/80">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-900/50 to-black/80"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-600">
            🔥 ROAST COMPLETE 🔥
          </h1>
          <p className="text-2xl text-gray-300">
            Analysis results for <span className="text-purple-400 font-bold">@{username}</span>
          </p>
        </div>

        {/* User Profile Card */}
        {userData && (
          <Card className="max-w-5xl mx-auto bg-black/60 backdrop-blur-xl border-2 border-white/10">
            <CardContent className="p-10 space-y-8">
              
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <Avatar className="w-32 h-32 border-4 border-purple-500 shadow-2xl">
                  <AvatarImage src={userData.avatar_url} alt={userData.name || userData.login} />
                  <AvatarFallback className="text-4xl">
                    {userData.name?.charAt(0) || userData.login.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h2 className="text-4xl font-bold text-white">
                    {userData.name || userData.login}
                  </h2>
                  <p className="text-xl text-gray-400">@{userData.login}</p>
                  {userData.bio && (
                    <p className="text-gray-300 text-lg max-w-2xl">{userData.bio}</p>
                  )}
                  {(userData.company || userData.location) && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-400">
                      {userData.company && <span className="flex items-center gap-2">🏢 {userData.company}</span>}
                      {userData.location && <span className="flex items-center gap-2">📍 {userData.location}</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {userData.public_repos}
                  </div>
                  <div className="text-gray-400">Repositories</div>
                </div>
                <div className="text-center p-6 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {userData.followers}
                  </div>
                  <div className="text-gray-400">Followers</div>
                </div>
                <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {userData.following}
                  </div>
                  <div className="text-gray-400">Following</div>
                </div>
                <div className={`text-center p-6 bg-gradient-to-br ${getScoreColor(roastScore).replace('to-', 'to-').replace(/\d+/g, (match) => `${match}/20`)} rounded-xl border-2 border-red-500/30`}>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor(roastScore)} bg-clip-text text-transparent mb-2`}>
                    {roastScore}
                  </div>
                  <div className="text-gray-400">Roast Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roast Results */}
        <Card className="max-w-6xl mx-auto bg-black/60 backdrop-blur-xl border-2 border-red-500/20">
          <CardHeader className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">🔥</span>
            </div>
            <CardTitle className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-600">
              THE ROAST
            </CardTitle>
            <CardDescription className="text-gray-400 text-xl">
              Brace yourself... this might hurt 💀
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Roast Text */}
            <div className="bg-black/40 p-8 rounded-2xl border border-red-500/30">
              <div className="text-white text-xl leading-relaxed font-medium whitespace-pre-wrap">
                {roastText}
              </div>
            </div>
            
            {/* Score Display */}
            <div className="text-center p-6 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-2xl border-2 border-red-500/30">
              <div className={`text-6xl font-black bg-gradient-to-r ${getScoreColor(roastScore)} bg-clip-text text-transparent mb-4`}>
                {roastScore}/100
              </div>
              <div className="text-white font-bold text-2xl mb-2">{getScoreLabel(roastScore)}</div>
            </div>
            
            {/* Badges */}
            {badges.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white text-center">🏆 Achievement Badges</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-full text-yellow-300 font-medium">
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(roastText);
                  toast.success('Roast copied to clipboard! 📋');
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📋 Copy Roast
              </Button>
              
              <Button
                onClick={shareRoast}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🚀 Share Roast
              </Button>
              
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                🔄 Roast Another Victim
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Repository Analysis */}
        {repositories.length > 0 && (
          <Card className="max-w-6xl mx-auto bg-black/60 backdrop-blur-xl border-2 border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white">
                📚 Repository Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repositories.slice(0, 6).map((repo) => (
                  <Card key={repo.id} className="bg-black/40 border border-gray-700 hover:border-purple-500/50 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <span className="text-2xl">{repo.private ? '🔒' : '📖'}</span>
                        {repo.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {repo.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>{repo.language}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Commits */}
        {commits.length > 0 && (
          <Card className="max-w-6xl mx-auto bg-black/60 backdrop-blur-xl border-2 border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-white">
                💻 Recent Commit Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commits.slice(0, 10).map((commit, index) => (
                  <div key={index} className="bg-black/30 border border-gray-700 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{commit.message}</p>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>📁 {commit.repo}</span>
                          <span>📅 {new Date(commit.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
