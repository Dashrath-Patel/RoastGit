'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Octokit } from '@octokit/rest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { GlowingStarsBackgroundCard } from '@/components/ui/glowing-stars';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { EvervaultCard } from '@/components/ui/evervault-card';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { LoaderTwo } from '@/components/ui/loader';
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

  useEffect(() => {
    if (username) {
      fetchGitHubData();
    }
  }, [username, fetchGitHubData]);

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
      <AuroraBackground>
        <div className="min-h-screen flex items-center justify-center">
          <CardSpotlight className="w-96 h-48">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <LoaderTwo className="w-12 h-12" />
              <h2 className="text-2xl font-bold text-white">Analyzing {username}...</h2>
              <p className="text-gray-400 text-center">Preparing the roast of a lifetime 🔥</p>
            </div>
          </CardSpotlight>
        </div>
      </AuroraBackground>
    );
  }

  if (error) {
    return (
      <AuroraBackground>
        <div className="min-h-screen flex items-center justify-center">
          <CardSpotlight className="w-96">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl">😕</div>
              <h2 className="text-2xl font-bold text-white">Oops!</h2>
              <p className="text-red-300">{error}</p>
              <Button 
                onClick={() => router.push('/')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Try Again
              </Button>
            </div>
          </CardSpotlight>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#ffffff"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-600 mb-4">
                🔥 ROAST COMPLETE 🔥
              </h1>
              <p className="text-2xl text-gray-300">
                Analysis results for <span className="text-purple-400 font-bold">@{username}</span>
              </p>
            </div>

            {/* User Profile Card */}
            {userData && (
              <div className="mb-12">
                <BackgroundGradient className="rounded-[22px] p-1 max-w-4xl mx-auto">
                  <div className="bg-black/80 backdrop-blur-sm border-none relative overflow-hidden rounded-[22px] p-8">
                    <Meteors number={20} />
                    
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-8">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-1">
                          <img
                            src={userData.avatar_url}
                            alt={userData.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 blur animate-pulse -z-10"></div>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-white mb-2">
                          {userData.name || userData.login}
                        </h2>
                        <p className="text-xl text-gray-400 mb-4">@{userData.login}</p>
                        {userData.bio && (
                          <p className="text-gray-300 text-lg mb-4 max-w-2xl">{userData.bio}</p>
                        )}
                        {(userData.company || userData.location) && (
                          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-400">
                            {userData.company && <span className="flex items-center gap-2"><span>🏢</span> {userData.company}</span>}
                            {userData.location && <span className="flex items-center gap-2"><span>📍</span> {userData.location}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[15rem]">
                      <BentoGridItem
                        title="Repositories"
                        description={`${userData.public_repos} public repos`}
                        header={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-5xl font-bold text-purple-400">
                              {userData.public_repos}
                            </div>
                          </div>
                        }
                        className="bg-gradient-to-br from-purple-500/10 to-purple-800/10 border-purple-500/20"
                        icon={<span className="text-xl">📚</span>}
                      />
                      <BentoGridItem
                        title="Followers"
                        description={`${userData.followers} followers`}
                        header={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-5xl font-bold text-blue-400">
                              {userData.followers}
                            </div>
                          </div>
                        }
                        className="bg-gradient-to-br from-blue-500/10 to-blue-800/10 border-blue-500/20"
                        icon={<span className="text-xl">👥</span>}
                      />
                      <BentoGridItem
                        title="Following"
                        description={`Following ${userData.following}`}
                        header={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-5xl font-bold text-green-400">
                              {userData.following}
                            </div>
                          </div>
                        }
                        className="bg-gradient-to-br from-green-500/10 to-green-800/10 border-green-500/20"
                        icon={<span className="text-xl">🔔</span>}
                      />
                      <BentoGridItem
                        title={`Roast Score`}
                        description={getScoreLabel(roastScore)}
                        header={
                          <div className="flex items-center justify-center h-full">
                            <div className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(roastScore)} bg-clip-text text-transparent`}>
                              {roastScore}
                            </div>
                          </div>
                        }
                        className={`bg-gradient-to-br ${getScoreColor(roastScore).replace('to-', 'to-').replace(/\d+/g, (match) => `${match}/10`)} border-red-500/20`}
                        icon={<span className="text-xl">🔥</span>}
                      />
                    </BentoGrid>
                  </div>
                </BackgroundGradient>
              </div>
            )}

            {/* Roast Results */}
            <div className="mb-12">
              <CardSpotlight className="min-h-[600px] w-full max-w-6xl mx-auto">
                <div className="relative h-full bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8">
                  <Meteors number={30} />
                  
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-600 mb-4">
                      THE ROAST
                    </h2>
                    <p className="text-gray-400 text-xl">
                      Brace yourself... this might hurt 💀
                    </p>
                  </div>
                  
                  <EvervaultCard text="ROASTED" className="mb-8">
                    <div className="p-8">
                      <div className="text-white text-xl leading-relaxed font-medium">
                        <TextGenerateEffect words={roastText} />
                      </div>
                    </div>
                  </EvervaultCard>
                  
                  {/* Badges */}
                  {badges.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-4 text-center">🏆 Achievement Badges</h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {badges.map((badge, index) => (
                          <div key={index} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-full text-yellow-300 font-medium">
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-6 mt-8">
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center space-x-2 px-8 py-4 font-semibold"
                      onClick={() => {
                        navigator.clipboard.writeText(roastText);
                        toast.success('Roast copied to clipboard! 📋');
                      }}
                    >
                      <span>📋 Copy Roast</span>
                    </HoverBorderGradient>
                    
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      className="bg-gradient-to-r from-green-600 to-teal-600 text-white flex items-center space-x-2 px-8 py-4 font-semibold"
                      onClick={shareRoast}
                    >
                      <span>🚀 Share Roast</span>
                    </HoverBorderGradient>
                    
                    <Button
                      onClick={() => router.push('/')}
                      className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border border-gray-600 px-8 py-4 font-semibold rounded-full"
                    >
                      🔄 Roast Another Victim
                    </Button>
                  </div>
                </div>
              </CardSpotlight>
            </div>

            {/* Repository Analysis */}
            {repositories.length > 0 && (
              <div className="mb-12">
                <GlowingStarsBackgroundCard className="max-w-6xl mx-auto">
                  <div className="p-8">
                    <h3 className="text-4xl font-bold text-white mb-8 text-center">
                      📚 Repository Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {repositories.slice(0, 6).map((repo) => (
                        <Card key={repo.id} className="bg-black/50 border-gray-700 hover:border-purple-500/50 transition-colors">
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
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            )}

            {/* Recent Commits */}
            {commits.length > 0 && (
              <div className="mb-12">
                <GlowingStarsBackgroundCard className="max-w-6xl mx-auto">
                  <div className="p-8">
                    <h3 className="text-4xl font-bold text-white mb-8 text-center">
                      💻 Recent Commit Messages
                    </h3>
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
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            )}

          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
