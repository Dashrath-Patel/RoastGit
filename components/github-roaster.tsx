'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export function GitHubRoaster() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const exampleUsers = ['torvalds', 'gaearon', 'sindresorhus', 'tj', 'addyosmani', 'kentcdodds'];

  const handleRandomExample = () => {
    const randomUser = exampleUsers[Math.floor(Math.random() * exampleUsers.length)];
    setUsername(randomUser);
  };

  const handleRoastRequest = async () => {
    if (!username.trim()) {
      toast.error('Please enter a GitHub username!');
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!usernameRegex.test(username)) {
      toast.error('Please enter a valid GitHub username!');
      return;
    }

    setLoading(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      router.push(`/roast/${username.toLowerCase()}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-full max-w-4xl mx-auto px-4 space-y-12">
            
            {/* Title Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-orange-500 to-red-600 leading-tight">
                  🔥 GitHub Roaster 🔥
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl text-gray-200 font-bold">
                  Ready to get <span className="text-red-400 underline decoration-wavy">absolutely roasted</span>?
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Enter your GitHub username and prepare for the most brutal analysis of your coding life.
                  We&apos;ll examine your repos, commits, and habits with surgical precision! 🪄📟🦴💾🫠
                </p>
              </div>
            </div>

            {/* Main Input Card */}
            <Card className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-4xl">🎯</span>
                </div>
                <CardTitle className="text-4xl font-bold text-white">
                  Target Selection
                </CardTitle>
                <CardDescription className="text-gray-300 text-xl">
                  We&apos;ll analyze your repos, commits, and coding habits with surgical precision
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Input Section */}
                <div className="space-y-4">
                  <Label htmlFor="username" className="text-white font-semibold text-xl">
                    GitHub Username
                  </Label>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        id="username"
                        placeholder="octocat"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && handleRoastRequest()}
                        className="bg-black/60 border-2 border-gray-600 hover:border-purple-500 focus:border-red-500 text-white text-xl h-14 rounded-xl"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      onClick={handleRandomExample}
                      variant="outline"
                      size="lg"
                      className="bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-600 hover:border-purple-500 text-white h-14 px-6 text-xl"
                      disabled={loading}
                      title="Try a random GitHub user"
                    >
                      🎲
                    </Button>
                  </div>
                  
                  {/* Example Users */}
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm text-center">Try these popular developers:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {exampleUsers.map((user) => (
                        <Button
                          key={user}
                          onClick={() => setUsername(user)}
                          variant="ghost"
                          size="sm"
                          className="bg-purple-600/30 hover:bg-purple-500/40 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 rounded-full"
                          disabled={loading}
                        >
                          @{user}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="pt-4">
                  {!loading ? (
                    <Button
                      onClick={handleRoastRequest}
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-500 hover:via-orange-500 hover:to-red-600 text-white text-2xl font-black h-16 shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      🔥 ROAST MY GITHUB 🔥
                    </Button>
                  ) : (
                    <Button
                      disabled
                      size="lg"
                      className="w-full bg-gray-700 text-white text-xl h-16"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>🚀 Launching Roast Analysis...</span>
                      </div>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 mb-6">
                What We Analyze
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our AI-powered roasting engine examines every aspect of your GitHub presence with ruthless precision
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-black/60 backdrop-blur-xl border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors h-full">
                <CardHeader className="text-center space-y-4">
                  <div className="text-8xl">📚</div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Repository Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-lg leading-relaxed text-center">
                    We examine your repos, naming conventions, README quality, and project organization to find every weakness
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-xl border-2 border-orange-500/20 hover:border-orange-500/40 transition-colors h-full">
                <CardHeader className="text-center space-y-4">
                  <div className="text-8xl">💻</div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Commit Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-lg leading-relaxed text-center">
                    Your commit history reveals your coding habits, discipline, and attention to detail (or lack thereof)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 backdrop-blur-xl border-2 border-red-500/20 hover:border-red-500/40 transition-colors h-full">
                <CardHeader className="text-center space-y-4">
                  <div className="text-8xl">👤</div>
                  <CardTitle className="text-3xl font-bold text-white">
                    Profile & Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-lg leading-relaxed text-center">
                    Bio, followers, contribution patterns - everything is fair game for our roasting algorithm
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="py-16 border-t border-gray-800">
          <Card className="max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border-2 border-white/10">
            <CardContent className="p-16 text-center space-y-12">
              <h3 className="text-5xl font-black text-white">
                🔥 Roasting Statistics 🔥
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-3xl border-2 border-red-500/30">
                  <div className="text-8xl font-black text-red-400 mb-4">∞</div>
                  <div className="text-white font-bold text-2xl mb-2">Developers Roasted</div>
                  <div className="text-gray-400 text-lg">And counting...</div>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-3xl border-2 border-orange-500/30">
                  <div className="text-8xl font-black text-orange-400 mb-4">💯</div>
                  <div className="text-white font-bold text-2xl mb-2">Accuracy Rate</div>
                  <div className="text-gray-400 text-lg">Brutally honest</div>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-3xl border-2 border-yellow-500/30">
                  <div className="text-8xl font-black text-yellow-400 mb-4">🔥</div>
                  <div className="text-white font-bold text-2xl mb-2">Fire Level</div>
                  <div className="text-gray-400 text-lg">Maximum heat</div>
                </div>
              </div>
              
              <div className="border-t-2 border-gray-700 pt-12 space-y-4">
                <p className="text-gray-300 text-xl font-medium">
                  🔥 Built with Next.js, your pre-built components, and a healthy dose of sarcasm 🔥
                </p>
                <p className="text-gray-500 text-lg max-w-4xl mx-auto leading-relaxed">
                  No developers were permanently harmed in the making of this roast. 
                  Side effects may include: improved coding practices, better commit messages, and a slightly bruised ego.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
