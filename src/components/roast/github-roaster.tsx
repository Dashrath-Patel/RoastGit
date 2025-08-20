'use client';

import { useState } from 'react';
import { Octokit } from '@octokit/rest';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';
import { toast } from 'sonner';
import { GitHubRoastEngine, type GitHubUser, type Repository, type CommitData } from '@/lib/roast-engine';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN, // Optional: for higher rate limits
});

const roastEngine = new GitHubRoastEngine();

export function GitHubRoaster() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [roastText, setRoastText] = useState('');
  const [error, setError] = useState('');

  const generateRoast = async (user: GitHubUser, repos: Repository[], commits: CommitData[]) => {
    const roasts = [];

    // Profile-based roasts
    if (!user.bio || user.bio.trim() === '') {
      roasts.push("🤐 No bio? Let me guess - your personality is as empty as your bio section.");
    }

    if (user.public_repos === 0) {
      roasts.push("🗂️ Zero public repos? Are you collecting stars for your private collection or just scared of code reviews?");
    } else if (user.public_repos > 100) {
      roasts.push(`📚 ${user.public_repos} repos? Quality over quantity much? It's not a competition to see who can create the most 'hello-world' projects.`);
    }

    if (user.followers === 0) {
      roasts.push("👻 Zero followers? Even your code doesn't want to follow you home.");
    } else if (user.following > user.followers * 3) {
      roasts.push("🏃‍♂️ Following way more people than following you back? That's some serious developer desperation right there.");
    }

    // Repository-based roasts
    const repoNames = repos.map(r => r.name.toLowerCase());
    const boringNames = repoNames.filter(name => 
      name.includes('test') || name.includes('hello') || name.includes('practice') || 
      name.includes('tutorial') || name === 'untitled' || name.includes('copy')
    );

    if (boringNames.length > 0) {
      roasts.push(`🥱 Repo names like "${boringNames[0]}"? Did you run out of creativity or is this your first day coding?`);
    }

    const oldRepos = repos.filter(repo => {
      const updatedDate = new Date(repo.updated_at);
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return updatedDate < yearAgo;
    });

    if (oldRepos.length > repos.length * 0.7) {
      roasts.push("🕸️ Most of your repos haven't been touched in ages. What happened? Did you discover life outside of coding?");
    }

    const noStarRepos = repos.filter(repo => repo.stargazers_count === 0);
    if (noStarRepos.length === repos.length && repos.length > 0) {
      roasts.push("⭐ Zero stars across ALL repos? Even your mom didn't star your projects!");
    }

    // Language diversity roast
    const languages = repos.map(r => r.language).filter(Boolean);
    const uniqueLanguages = [...new Set(languages)];
    if (uniqueLanguages.length === 1) {
      roasts.push(`🔒 Only coding in ${uniqueLanguages[0]}? Branching out isn't just for Git, you know.`);
    }

    // Commit message-based roasts
    const badCommitMessages = commits.filter(commit => {
      const msg = commit.message.toLowerCase();
      return msg === 'fix' || msg === 'update' || msg === 'changes' || 
             msg.includes('stuff') || msg.includes('things') || 
             msg.length < 10 || msg.includes('asdf') || msg.includes('test');
    });

    if (badCommitMessages.length > 0) {
      roasts.push(`💬 Commit messages like "${badCommitMessages[0].message}"? Your future self is crying right now.`);
    }

    // Account age roasts
    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    if (accountAge > 5 && user.public_repos < 10) {
      roasts.push(`📅 ${accountAge} years on GitHub and only ${user.public_repos} repos? What have you been doing, collecting digital dust?`);
    }

    // Final motivation with emoji overload
    roasts.push("🎯 But hey, at least you're consistent... consistently disappointing! 🎪 Keep coding though - someone has to write the bugs for the rest of us to fix! 🐛💻🔥");

    return roasts.join('\n\n');
  };

  const fetchGitHubData = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setRoastText('');

    try {
      // Fetch user data
      const { data: user } = await octokit.rest.users.getByUsername({
        username: username.trim(),
      });

      setUserData(user as GitHubUser);

      // Fetch repositories
      const { data: repos } = await octokit.rest.repos.listForUser({
        username: username.trim(),
        sort: 'updated',
        per_page: 30,
      });

      // Fetch recent commits from top repos
      const commitPromises = repos.slice(0, 5).map(async (repo) => {
        try {
          const { data: commits } = await octokit.rest.repos.listCommits({
            owner: username.trim(),
            repo: repo.name,
            per_page: 10,
          });
          return commits.map(commit => ({
            message: commit.commit.message,
            date: commit.commit.author?.date || '',
            author: commit.commit.author?.name || '',
          }));
        } catch {
          return [];
        }
      });

      const commitResults = await Promise.all(commitPromises);
      const allCommits = commitResults.flat();

      // Generate the roast
      const roast = await generateRoast(user as GitHubUser, repos as Repository[], allCommits);
      setRoastText(roast);

    } catch (err: any) {
      if (err.status === 404) {
        setError('GitHub user not found. Check the username and try again!');
      } else if (err.status === 403) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError('Something went wrong. Please try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#ffffff"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🔥 GitHub Roaster 🔥
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Ready to get roasted based on your GitHub activity? Enter your username below! 🪄
            </p>
          </div>

          {/* Input Section */}
          <BackgroundGradient className="rounded-[22px] p-1 mb-8">
            <Card className="bg-black border-none">
              <CardHeader>
                <CardTitle className="text-white">Enter GitHub Username</CardTitle>
                <CardDescription className="text-gray-400">
                  We'll analyze your repos, commits, and coding habits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    GitHub Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="octocat"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchGitHubData()}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                <Button
                  onClick={fetchGitHubData}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2" />
                      Analyzing GitHub Profile...
                    </>
                  ) : (
                    <>
                      🔍 Roast My GitHub
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </BackgroundGradient>

          {/* User Profile Card */}
          {userData && (
            <BackgroundGradient className="rounded-[22px] p-1 mb-8">
              <Card className="bg-black border-none relative overflow-hidden">
                <Meteors number={20} />
                <CardHeader className="flex flex-row items-center space-x-4">
                  <img
                    src={userData.avatar_url}
                    alt={userData.name}
                    className="w-20 h-20 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <CardTitle className="text-white text-2xl">
                      {userData.name || userData.login}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      @{userData.login}
                    </CardDescription>
                    {userData.bio && (
                      <p className="text-gray-300 mt-2">{userData.bio}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {userData.public_repos}
                      </div>
                      <div className="text-gray-400 text-sm">Repositories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        {userData.followers}
                      </div>
                      <div className="text-gray-400 text-sm">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {userData.following}
                      </div>
                      <div className="text-gray-400 text-sm">Following</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-400">
                        {new Date(userData.created_at).getFullYear()}
                      </div>
                      <div className="text-gray-400 text-sm">Joined</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          )}

          {/* Roast Results */}
          {roastText && (
            <BackgroundGradient className="rounded-[22px] p-1">
              <Card className="bg-black border-none relative overflow-hidden">
                <Meteors number={30} />
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    🔥 Your GitHub Roast 🔥
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Brace yourself... this might hurt 💀
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <TextGenerateEffect
                      words={roastText}
                      className="text-white text-lg leading-relaxed"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(roastText);
                        toast.success('Roast copied to clipboard! 📋');
                      }}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      📋 Copy Roast
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </BackgroundGradient>
          )}
        </div>
      </div>
    </div>
  );
}
