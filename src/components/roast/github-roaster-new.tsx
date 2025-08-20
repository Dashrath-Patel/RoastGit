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
    <AuroraBackground>
      <div className="min-h-screen relative">
        {/* Lamp Header Effect */}
        <LampContainer>
          <div className="flex flex-col items-center justify-center relative z-10">
            <h1 className="mt-8 bg-gradient-to-br from-red-300 via-orange-400 to-red-600 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
              🔥 GitHub Roaster 🔥
            </h1>
            <p className="text-neutral-300 max-w-lg mx-auto my-2 text-lg text-center relative z-10">
              Ready to get absolutely <span className="text-red-400 font-bold">destroyed</span> based on your GitHub activity? 
              Enter your username and prepare for the roast of a lifetime! 🪄📟🦴💾🫠
            </p>
          </div>
        </LampContainer>

        {/* Background Effects */}
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
            
            {/* Main Input Section */}
            <div className="mb-16">
              <CardSpotlight className="h-auto w-full max-w-2xl mx-auto">
                <div className="relative h-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <Meteors number={15} />
                  
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Target Selection
                    </h2>
                    <p className="text-gray-300 text-lg">
                      We'll analyze repos, commits, and coding habits with surgical precision
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-white font-medium text-lg">
                        GitHub Username
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="username"
                          placeholder="octocat"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !loading && handleRoastRequest()}
                          className="bg-black/50 border-gray-700 text-white placeholder-gray-400 flex-1 backdrop-blur-sm text-lg p-4 rounded-xl"
                          disabled={loading}
                        />
                        <Button
                          onClick={handleRandomExample}
                          variant="outline"
                          className="bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700 backdrop-blur-sm p-4 rounded-xl"
                          disabled={loading}
                          title="Try a random GitHub user"
                        >
                          🎲
                        </Button>
                      </div>
                      
                      {/* Example Pills */}
                      <div className="flex flex-wrap gap-3 mt-6">
                        {exampleUsers.map((user) => (
                          <button
                            key={user}
                            onClick={() => setUsername(user)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-500/30 backdrop-blur-sm"
                            disabled={loading}
                          >
                            {user}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      {!loading ? (
                        <HoverBorderGradient
                          containerClassName="rounded-full w-full"
                          as="button"
                          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white flex items-center justify-center space-x-3 py-4 text-xl font-bold shadow-2xl"
                          onClick={handleRoastRequest}
                        >
                          <span>🔥 ROAST MY GITHUB 🔥</span>
                        </HoverBorderGradient>
                      ) : (
                        <div className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white flex items-center justify-center space-x-3 py-4 rounded-full border border-gray-600 shadow-xl">
                          <LoaderTwo />
                          <span className="text-lg">🚀 Launching Roast Analysis...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-4">
                  What We Analyze
                </h2>
                <p className="text-xl text-gray-400">
                  Our AI-powered roasting engine examines every aspect of your GitHub presence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <BackgroundGradient className="rounded-[22px] p-1">
                  <div className="bg-black/80 rounded-[22px] p-8 text-center space-y-4">
                    <div className="text-6xl">📚</div>
                    <h3 className="text-2xl font-bold text-white">Repository Analysis</h3>
                    <p className="text-gray-400">
                      We examine your repos, naming conventions, README quality, and project organization
                    </p>
                  </div>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] p-1">
                  <div className="bg-black/80 rounded-[22px] p-8 text-center space-y-4">
                    <div className="text-6xl">💻</div>
                    <h3 className="text-2xl font-bold text-white">Commit Messages</h3>
                    <p className="text-gray-400">
                      Your commit history reveals your coding habits, discipline, and attention to detail
                    </p>
                  </div>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] p-1">
                  <div className="bg-black/80 rounded-[22px] p-8 text-center space-y-4">
                    <div className="text-6xl">👤</div>
                    <h3 className="text-2xl font-bold text-white">Profile & Activity</h3>
                    <p className="text-gray-400">
                      Bio, followers, contribution patterns - everything is fair game for our roasting algorithm
                    </p>
                  </div>
                </BackgroundGradient>
              </div>
            </div>

            {/* Enhanced Footer with Statistics */}
            <div className="mt-24 mb-12">
              <GlowingStarsBackgroundCard className="max-w-5xl mx-auto">
                <div className="p-12 text-center">
                  <h3 className="text-4xl font-bold text-white mb-8">
                    🔥 Roasting Statistics 🔥
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-red-800/10 rounded-2xl border border-red-500/20">
                      <div className="text-6xl font-bold text-red-400 mb-3">∞</div>
                      <div className="text-white font-medium text-xl">Developers Roasted</div>
                      <div className="text-gray-400">And counting...</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-800/10 rounded-2xl border border-orange-500/20">
                      <div className="text-6xl font-bold text-orange-400 mb-3">💯</div>
                      <div className="text-white font-medium text-xl">Accuracy Rate</div>
                      <div className="text-gray-400">Brutally honest</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-800/10 rounded-2xl border border-yellow-500/20">
                      <div className="text-6xl font-bold text-yellow-400 mb-3">🔥</div>
                      <div className="text-white font-medium text-xl">Fire Level</div>
                      <div className="text-gray-400">Maximum heat</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-8">
                    <p className="text-gray-300 mb-4 text-lg">
                      🔥 Built with Next.js, Aceternity UI, and a healthy dose of sarcasm 🔥
                    </p>
                    <p className="text-gray-500">
                      No developers were permanently harmed in the making of this roast. 
                      Side effects may include: improved coding practices, better commit messages, and slightly bruised ego.
                    </p>
                  </div>
                </div>
              </GlowingStarsBackgroundCard>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
