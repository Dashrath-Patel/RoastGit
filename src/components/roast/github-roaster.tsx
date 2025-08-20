'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LoaderTwo } from '@/components/ui/loader';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { SparklesCore } from '@/components/ui/sparkles';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { GlowingStarsBackgroundCard } from '@/components/ui/glowing-stars';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { LampContainer } from '@/components/ui/lamp';
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
      {/* Aurora Background Effect */}
      <AuroraBackground>
        <div className="min-h-screen flex flex-col">
          
          {/* Header Section */}
          <div className="flex-1 flex items-center justify-center relative z-20">
            <div className="w-full max-w-4xl mx-auto px-4">
              
              {/* Title with Lamp Effect */}
              <div className="text-center mb-16 relative">
                <LampContainer>
                  <div className="relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-orange-500 to-red-600 mb-6 leading-tight">
                      🔥 GitHub Roaster 🔥
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                      Ready to get <span className="text-red-400 font-bold">absolutely roasted</span> based on your GitHub activity?
                      <br />
                      <span className="text-lg text-gray-400">
                        Enter your username and prepare for the roast of a lifetime! 🪄📟🦴💾🫠
                      </span>
                    </p>
                  </div>
                </LampContainer>
              </div>

              {/* Main Card */}
              <div className="relative z-10">
                <CardSpotlight className="w-full max-w-2xl mx-auto">
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                    <Meteors number={20} />
                    
                    {/* Card Header */}
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <h2 className="text-4xl font-bold text-white mb-4">
                        Target Selection
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        We&apos;ll analyze your repos, commits, and coding habits with surgical precision
                      </p>
                    </div>
                    
                    {/* Input Section */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label htmlFor="username" className="text-white font-semibold text-xl block">
                          GitHub Username
                        </Label>
                        
                        {/* Input Row */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              id="username"
                              placeholder="octocat"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && !loading && handleRoastRequest()}
                              className="bg-black/60 border-2 border-gray-600 hover:border-purple-500 focus:border-red-500 text-white placeholder-gray-400 text-xl p-6 rounded-2xl backdrop-blur-sm transition-all duration-300"
                              disabled={loading}
                            />
                          </div>
                          <Button
                            onClick={handleRandomExample}
                            variant="outline"
                            className="bg-gray-800/80 hover:bg-gray-700 border-2 border-gray-600 hover:border-purple-500 text-white backdrop-blur-sm px-6 py-6 rounded-2xl text-xl transition-all duration-300 shadow-lg"
                            disabled={loading}
                            title="Try a random GitHub user"
                          >
                            🎲
                          </Button>
                        </div>
                        
                        {/* Example Users Pills */}
                        <div className="mt-8">
                          <p className="text-gray-400 text-sm mb-4 text-center">Try these popular developers:</p>
                          <div className="flex flex-wrap justify-center gap-3">
                            {exampleUsers.map((user) => (
                              <button
                                key={user}
                                onClick={() => setUsername(user)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-500/40 hover:to-pink-500/40 text-purple-200 hover:text-white rounded-full transition-all duration-300 border border-purple-500/40 hover:border-purple-400 backdrop-blur-sm font-medium text-base shadow-lg hover:shadow-purple-500/25"
                                disabled={loading}
                              >
                                @{user}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="pt-6">
                        {!loading ? (
                          <HoverBorderGradient
                            containerClassName="rounded-full w-full"
                            as="button"
                            className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-500 hover:via-orange-500 hover:to-red-600 text-white flex items-center justify-center space-x-4 py-6 text-2xl font-black shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                            onClick={handleRoastRequest}
                          >
                            <span>🔥 ROAST MY GITHUB 🔥</span>
                          </HoverBorderGradient>
                        ) : (
                          <div className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white flex items-center justify-center space-x-4 py-6 rounded-full border-2 border-gray-600 shadow-2xl">
                            <LoaderTwo />
                            <span className="text-xl font-semibold">🚀 Launching Roast Analysis...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20 relative z-10">
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
                <BackgroundGradient className="rounded-[30px] p-1">
                  <div className="bg-black/80 backdrop-blur-xl rounded-[30px] p-10 text-center space-y-6 h-full">
                    <div className="text-8xl mb-4">📚</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Repository Analysis</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      We examine your repos, naming conventions, README quality, and project organization to find every weakness
                    </p>
                  </div>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[30px] p-1">
                  <div className="bg-black/80 backdrop-blur-xl rounded-[30px] p-10 text-center space-y-6 h-full">
                    <div className="text-8xl mb-4">💻</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Commit Messages</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Your commit history reveals your coding habits, discipline, and attention to detail (or lack thereof)
                    </p>
                  </div>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[30px] p-1">
                  <div className="bg-black/80 backdrop-blur-xl rounded-[30px] p-10 text-center space-y-6 h-full">
                    <div className="text-8xl mb-4">👤</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Profile & Activity</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Bio, followers, contribution patterns - everything is fair game for our roasting algorithm
                    </p>
                  </div>
                </BackgroundGradient>
              </div>
            </div>
          </div>

          {/* Stats Footer */}
          <div className="py-16 relative z-10">
            <GlowingStarsBackgroundCard className="max-w-6xl mx-auto">
              <div className="p-16 text-center">
                <h3 className="text-5xl font-black text-white mb-12">
                  🔥 Roasting Statistics 🔥
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <div className="text-center p-8 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-3xl border-2 border-red-500/30 backdrop-blur-sm">
                    <div className="text-8xl font-black text-red-400 mb-4">∞</div>
                    <div className="text-white font-bold text-2xl mb-2">Developers Roasted</div>
                    <div className="text-gray-400 text-lg">And counting...</div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-3xl border-2 border-orange-500/30 backdrop-blur-sm">
                    <div className="text-8xl font-black text-orange-400 mb-4">💯</div>
                    <div className="text-white font-bold text-2xl mb-2">Accuracy Rate</div>
                    <div className="text-gray-400 text-lg">Brutally honest</div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-3xl border-2 border-yellow-500/30 backdrop-blur-sm">
                    <div className="text-8xl font-black text-yellow-400 mb-4">🔥</div>
                    <div className="text-white font-bold text-2xl mb-2">Fire Level</div>
                    <div className="text-gray-400 text-lg">Maximum heat</div>
                  </div>
                </div>
                
                <div className="border-t-2 border-gray-700 pt-12">
                  <p className="text-gray-300 mb-6 text-xl font-medium">
                    🔥 Built with Next.js, Aceternity UI, and a healthy dose of sarcasm 🔥
                  </p>
                  <p className="text-gray-500 text-lg max-w-4xl mx-auto leading-relaxed">
                    No developers were permanently harmed in the making of this roast. 
                    Side effects may include: improved coding practices, better commit messages, and a slightly bruised ego.
                  </p>
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </div>

        </div>

        {/* Background Sparkles */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={30}
            className="w-full h-full"
            particleColor="#ffffff"
          />
        </div>
      </AuroraBackground>
    </div>
  );
}
