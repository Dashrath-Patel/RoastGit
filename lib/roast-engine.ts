export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface CommitData {
  message: string;
  date: string;
  repo: string;
  sha: string;
}

export interface RoastResult {
  roast: string;
  score: number;
  badges: string[];
}

export class GitHubRoastEngine {
  private readonly emojiPatterns = [
    /[😂🤣😭💀]/g, // Laughing emojis
    /[🔥💯✨]/g, // Fire/achievement emojis  
    /[❤️💕💖]/g, // Heart emojis
    /[😍🥰😘]/g, // Love emojis
    /[💩🤮🤢]/g, // Gross emojis
    /[🎉🎊🥳]/g, // Party emojis
    /[👑💎]/g, // Luxury emojis
  ];

  private readonly questionableCommitPatterns = [
    /fix/i,
    /work/i,
    /stuff/i,
    /things/i,
    /update/i,
    /change/i,
    /minor/i,
    /quick/i,
    /oops/i,
    /wtf/i,
    /shit/i,
    /damn/i,
    /fuck/i,
    /asdf/i,
    /test/i,
    /temp/i,
    /tmp/i,
    /final/i,
    /done/i,
    /whatever/i,
    /^\.$/,
    /^[a-zA-Z]$/,
    /^\d+$/,
  ];

  // Fun personality types based on GitHub behavior
  private readonly personalityTypes = [
    {
      name: "The Perfectionist",
      trigger: (user: GitHubUser, repos: Repository[], commits: CommitData[]) =>
        commits.filter(c => c.message.includes('fix')).length > commits.length * 0.6,
      roast: "You're the type who refactors 'Hello World' 15 times before committing it! 🔍"
    },
    {
      name: "The Collector",
      trigger: (user: GitHubUser, repos: Repository[], commits: CommitData[]) =>
        user.public_repos > 50 && repos.filter(r => r.stargazers_count === 0).length > repos.length * 0.8,
      roast: "You collect repositories like Pokemon cards, but nobody wants to trade with you! 📦"
    },
    {
      name: "The Ghost",
      trigger: (user: GitHubUser, repos: Repository[], commits: CommitData[]) =>
        commits.length < 5 && user.public_repos > 0,
      roast: "You're so invisible on GitHub, even your own repos don't recognize you! 👻"
    },
    {
      name: "The Emoji Enthusiast",
      trigger: (user: GitHubUser, repos: Repository[], commits: CommitData[]) => {
        let emojiCount = 0;
        commits.forEach(commit => {
          this.emojiPatterns.forEach(pattern => {
            const matches = commit.message.match(pattern);
            if (matches) emojiCount += matches.length;
          });
        });
        return emojiCount > commits.length;
      },
      roast: "Your commit messages have more emojis than a teenage girl's Instagram story! 📱✨"
    },
    {
      name: "The Optimist",
      trigger: (user: GitHubUser, repos: Repository[], commits: CommitData[]) =>
        repos.filter(r => r.name.toLowerCase().includes('awesome') || r.name.toLowerCase().includes('amazing') || r.name.toLowerCase().includes('super')).length > 2,
      roast: "Everything is 'awesome' and 'amazing' in your repos. Reality called - it wants its expectations back! 🌈"
    }
  ];

  // Programming language stereotypes for fun roasting
  private readonly languageStereotypes = {
    'JavaScript': "JavaScript developer? Let me guess, you've reinvented the wheel 47 times and called it 'modern architecture' 🎡",
    'TypeScript': "TypeScript user? You're the person who puts warning labels on coffee cups saying 'this is hot' ☕",
    'Python': "Python developer? You write 3 lines of code and call it 'elegant simplicity' while Java devs cry in 50-line constructors 🐍",
    'Java': "Java developer? You're still explaining why your Hello World program needs 5 design patterns and an XML config 📋",
    'C++': "C++ developer? You manually manage memory while the rest of us moved on to having actual lives 🧠",
    'Rust': "Rust developer? You probably mention memory safety at dinner parties and wonder why nobody invites you back 🦀",
    'Go': "Go developer? You chose a language designed by Google for people who find C too exciting 🐹",
    'PHP': "PHP developer in 2025? That's like being a VHS repair specialist - technically impressive but questionably relevant 💿",
    'C#': "C# developer? Microsoft's Java with extra corporate flavor and meetings about meetings 🏢",
    'Ruby': "Ruby developer? You're coding like it's 2010 and wondering why your startup ideas feel so... vintage 💎"
  };

  generateRoast(user: GitHubUser, repos: Repository[], commits: CommitData[]): RoastResult {
    const roastElements = [];
    let score = 0;
    const badges = [];

    // Add personality-based roasting (NEW!)
    const personalityRoast = this.detectPersonality(user, repos, commits);
    if (personalityRoast) {
      roastElements.push(personalityRoast.text);
      score += personalityRoast.score;
      badges.push(...personalityRoast.badges);
    }

    // Add programming language stereotype roasting (NEW!)
    const languageRoast = this.roastByLanguage(repos);
    if (languageRoast) {
      roastElements.push(languageRoast.text);
      score += languageRoast.score;
      badges.push(...languageRoast.badges);
    }

    // Add time-based coding patterns (NEW!)
    const timeRoast = this.analyzeTimePatterns(commits);
    if (timeRoast) {
      roastElements.push(timeRoast.text);
      score += timeRoast.score;
      badges.push(...timeRoast.badges);
    }

    // Add repository naming creativity analysis (NEW!)
    const namingRoast = this.analyzeNamingCreativity(repos);
    if (namingRoast) {
      roastElements.push(namingRoast.text);
      score += namingRoast.score;
      badges.push(...namingRoast.badges);
    }

    // Profile roasting
    const profileRoast = this.roastProfile(user);
    roastElements.push(profileRoast.text);
    score += profileRoast.score;
    badges.push(...profileRoast.badges);

    // Repository roasting
    const repoRoast = this.roastRepositories(repos);
    roastElements.push(repoRoast.text);
    score += repoRoast.score;
    badges.push(...repoRoast.badges);

    // Commit roasting
    const commitRoast = this.roastCommits(commits);
    roastElements.push(commitRoast.text);
    score += commitRoast.score;
    badges.push(...commitRoast.badges);

    // Activity roasting
    const activityRoast = this.roastActivity(user, repos, commits);
    roastElements.push(activityRoast.text);
    score += activityRoast.score;
    badges.push(...activityRoast.badges);

    const roast = roastElements.filter(Boolean).join('\n\n');
    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
      roast: this.addFinalBurn(roast, finalScore),
      score: finalScore,
      badges: [...new Set(badges)], // Remove duplicates
    };
  }

  private roastProfile(user: GitHubUser): { text: string; score: number; badges: string[] } {
    const roasts = [];
    let score = 0;
    const badges = [];

    // Bio analysis
    if (!user.bio) {
      roasts.push(`No bio? Let me guess - you're "too cool" for descriptions or just can't think of anything interesting to say about yourself? 🤐`);
      score += 10;
      badges.push('🤐 Strong Silent Type');
    } else if (user.bio.length < 20) {
      roasts.push(`"${user.bio}" - Wow, such depth! Shakespeare is quaking in his grave at this literary masterpiece. 📚`);
      score += 8;
    } else if (user.bio.includes('Full Stack') || user.bio.includes('Fullstack')) {
      roasts.push(`"Full Stack Developer" - Let me translate: "I can copy-paste from Stack Overflow in both frontend AND backend!" 🥞`);
      score += 5;
      badges.push('🥞 Stack Overflow Warrior');
    }

    // Username roasting
    if (user.login.includes('dev') || user.login.includes('code')) {
      roasts.push(`Username contains "${user.login.includes('dev') ? 'dev' : 'code'}" - How original! Did you also consider "programmer123"? 🏷️`);
      score += 7;
      badges.push('🏷️ Generic Username Club');
    }

    if (/\d{2,}/.test(user.login)) {
      roasts.push(`Those numbers in your username - is that your birth year or just how many times your first choice was taken? 🔢`);
      score += 6;
    }

    // Account age vs activity
    const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365));
    if (accountAge > 5 && user.public_repos < 10) {
      roasts.push(`${accountAge} years on GitHub and only ${user.public_repos} public repos? What have you been doing, planning the perfect "Hello World"? ⏰`);
      score += 15;
      badges.push('⏰ Chronic Procrastinator');
    }

    // Follower analysis
    const followerRatio = user.followers / Math.max(user.following, 1);
    if (followerRatio < 0.1) {
      roasts.push(`Following ${user.following} people but only ${user.followers} follow you back? Even your code has commitment issues! 💔`);
      score += 12;
      badges.push('💔 Forever Alone Coder');
    }

    return {
      text: roasts.join(' '),
      score,
      badges,
    };
  }

  private roastRepositories(repos: Repository[]): { text: string; score: number; badges: string[] } {
    const roasts = [];
    let score = 0;
    const badges = [];

    if (repos.length === 0) {
      return {
        text: `No public repositories? What are you, a government spy or just embarrassed by your code? 🕵️`,
        score: 20,
        badges: ['🕵️ Ghost Coder'],
      };
    }

    // Fork analysis
    const forkCount = repos.filter(repo => repo.forks_count > 0).length;
    if (forkCount === 0) {
      roasts.push(`Zero forks across all repositories? Even copy-paste tutorials get more love than your code! 🍴`);
      score += 15;
      badges.push('🍴 Fork-less Wonder');
    }

    // Star analysis
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    if (totalStars === 0) {
      roasts.push(`Zero stars on any project? Not even a pity star from your mom? ⭐`);
      score += 10;
      badges.push('⭐ Starless Night');
    }

    // Language diversity
    const languages = new Set(repos.map(repo => repo.language).filter(Boolean));
    if (languages.size === 1) {
      const lang = Array.from(languages)[0];
      roasts.push(`Only ${lang}? Branching out is scary, I get it. Maybe try HTML next - baby steps! 🚼`);
      score += 8;
      badges.push('🚼 One-Trick Pony');
    }

    // Repository names
    const genericNames = repos.filter(repo => 
      ['test', 'hello', 'demo', 'practice', 'learning', 'tutorial', 'temp', 'new', 'old', 'backup']
        .some(generic => repo.name.toLowerCase().includes(generic))
    ).length;

    if (genericNames > repos.length * 0.5) {
      roasts.push(`Half your repos have names like "test" and "demo"? Creative bankruptcy called - it wants its dignity back! 💡`);
      score += 12;
      badges.push('💡 Creativity Deficit Disorder');
    }

    // Description analysis
    const noDescriptions = repos.filter(repo => !repo.description || repo.description.trim() === '').length;
    if (noDescriptions > repos.length * 0.7) {
      roasts.push(`Most repos have no description? Let me guess - the code "speaks for itself"? Well, it's mumbling! 🤫`);
      score += 10;
    }

    // Size analysis - tiny repos
    const tinyRepos = repos.filter(repo => repo.size < 10).length;
    if (tinyRepos > repos.length * 0.6) {
      roasts.push(`Most of your repos are smaller than this roast! Quality over quantity, right? RIGHT?? 🤏`);
      score += 8;
      badges.push('🤏 Minimalist Extraordinaire');
    }

    return {
      text: roasts.join(' '),
      score,
      badges,
    };
  }

  private roastCommits(commits: CommitData[]): { text: string; score: number; badges: string[] } {
    const roasts = [];
    let score = 0;
    const badges = [];

    if (commits.length === 0) {
      return {
        text: `No recent commits? Are you on a coding sabbatical or did your keyboard break? ⌨️`,
        score: 15,
        badges: ['⌨️ Digital Hermit'],
      };
    }

    // Analyze commit messages
    const questionableCommits = commits.filter(commit =>
      this.questionableCommitPatterns.some(pattern => pattern.test(commit.message))
    );

    if (questionableCommits.length > commits.length * 0.4) {
      roasts.push(`${Math.round((questionableCommits.length / commits.length) * 100)}% of your commit messages are variations of "fix stuff"? Your future self is crying! 😭`);
      score += 12;
      badges.push('😭 Commit Message Poet');
    }

    // Emoji usage
    let totalEmojis = 0;
    this.emojiPatterns.forEach(pattern => {
      commits.forEach(commit => {
        const matches = commit.message.match(pattern);
        if (matches) totalEmojis += matches.length;
      });
    });

    if (totalEmojis > commits.length * 2) {
      roasts.push(`${totalEmojis} emojis in ${commits.length} commits? Are you coding or running a Instagram account? 🤳`);
      score += 8;
      badges.push('🤳 Emoji Influencer');
    }

    // Single character commits
    const oneCharCommits = commits.filter(commit => commit.message.trim().length === 1).length;
    if (oneCharCommits > 0) {
      roasts.push(`${oneCharCommits} single-character commit messages? Even cavemen left more detailed records! 🪨`);
      score += 15;
      badges.push('🪨 Cave Painter');
    }

    // All caps commits
    const capsCommits = commits.filter(commit => 
      commit.message === commit.message.toUpperCase() && commit.message.length > 3
    ).length;
    if (capsCommits > 0) {
      roasts.push(`${capsCommits} ALL CAPS commits? WE GET IT, YOU WERE ANGRY AT THE CODE! 📢`);
      score += 10;
      badges.push('📢 Digital Screamer');
    }

    // Super long commit messages
    const longCommits = commits.filter(commit => commit.message.length > 200).length;
    if (longCommits > 0) {
      roasts.push(`Some commit messages longer than this roast? Save the novels for your autobiography: "How I Learned to Stop Worrying and Love Console.log" 📚`);
      score += 7;
    }

    return {
      text: roasts.join(' '),
      score,
      badges,
    };
  }

  private roastActivity(user: GitHubUser, repos: Repository[], commits: CommitData[]): { text: string; score: number; badges: string[] } {
    const roasts = [];
    let score = 0;
    const badges = [];

    // Repos per year
    const accountAge = Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)));
    const reposPerYear = user.public_repos / accountAge;

    if (reposPerYear < 1) {
      roasts.push(`Less than 1 repo per year? At this rate, you'll have a decent portfolio by retirement! 👴`);
      score += 12;
      badges.push('👴 Retirement Plan Coder');
    } else if (reposPerYear > 50) {
      roasts.push(`${Math.round(reposPerYear)} repos per year? Quality over quantity exists, you know! 🏃`);
      score += 10;
      badges.push('🏃 Repo Speed Runner');
    }

    // Recent activity
    const recentRepos = repos.filter(repo => {
      const lastUpdate = new Date(repo.updated_at);
      const monthsAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo < 6;
    }).length;

    if (recentRepos === 0 && repos.length > 0) {
      roasts.push(`No activity in the last 6 months? Did you discover life outside of coding, or did coding discover it could do without you? 🌱`);
      score += 15;
      badges.push('🌱 Grass Toucher');
    }

    // Push vs creation ratio
    const pushDateRepos = repos.filter(repo => repo.pushed_at).length;
    if (pushDateRepos < repos.length * 0.5) {
      roasts.push(`Half your repos haven't been pushed to since creation? Even your git commits have abandonment issues! 🚪`);
      score += 10;
      badges.push('🚪 Project Abandoner');
    }

    return {
      text: roasts.join(' '),
      score,
      badges,
    };
  }

  private addFinalBurn(roast: string, score: number): string {
    const finalBurns = [
      `But hey, at least you're consistent... consistently disappointing! 🎯`,
      `Remember, even Shakespeare had critics. Unfortunately, you're no Shakespeare! 📜`,
      `Don't worry, everyone starts somewhere. You just started underground! ⛏️`,
      `Your code might not compile, but this roast certainly does! 🔥`,
      `The good news? You can only go up from here... right? 📈`,
      `At least your GitHub profile makes everyone else feel better about theirs! 🤗`,
      `Your repos are like your commits - full of potential that never gets realized! ✨`,
    ];

    const severityMessage = score >= 80 
      ? "💀 FATALITY! This developer needs immediate medical attention!"
      : score >= 60 
      ? "🔥 WELL ROASTED! Medium-rare with a side of reality check!"
      : score >= 40 
      ? "🌡️ LIGHTLY TOASTED! Could use more heat, just like your code!"
      : "😎 BARELY WARMED UP! This developer is surprisingly resilient!";

    const randomBurn = finalBurns[Math.floor(Math.random() * finalBurns.length)];

    return `${roast}\n\n${randomBurn}\n\n🎯 ${severityMessage}`;
  }

  // NEW UNIQUE ROASTING METHODS! 🔥

  private detectPersonality(user: GitHubUser, repos: Repository[], commits: CommitData[]): { text: string; score: number; badges: string[] } | null {
    for (const personality of this.personalityTypes) {
      if (personality.trigger(user, repos, commits)) {
        return {
          text: `🎭 **Personality Type: ${personality.name}** - ${personality.roast}`,
          score: 8,
          badges: [`🎭 ${personality.name}`]
        };
      }
    }
    return null;
  }

  private roastByLanguage(repos: Repository[]): { text: string; score: number; badges: string[] } | null {
    const languages = repos
      .map(repo => repo.language)
      .filter(Boolean) as string[];
    
    if (languages.length === 0) return null;

    const languageCount: { [key: string]: number } = {};
    languages.forEach(lang => {
      languageCount[lang] = (languageCount[lang] || 0) + 1;
    });

    const primaryLanguage = Object.keys(languageCount).reduce((a, b) => 
      languageCount[a] > languageCount[b] ? a : b
    );

    const stereotype = this.languageStereotypes[primaryLanguage as keyof typeof this.languageStereotypes];
    if (stereotype) {
      return {
        text: `💻 **Language Analysis**: ${stereotype}`,
        score: 10,
        badges: [`💻 ${primaryLanguage} Enthusiast`]
      };
    }

    return {
      text: `💻 **Language Analysis**: ${primaryLanguage}? Interesting choice... said nobody ever! 🤔`,
      score: 5,
      badges: [`💻 ${primaryLanguage} Pioneer`]
    };
  }

  private analyzeTimePatterns(commits: CommitData[]): { text: string; score: number; badges: string[] } | null {
    if (commits.length === 0) return null;

    const timeData = commits.map(commit => {
      const date = new Date(commit.date);
      return {
        hour: date.getHours(),
        day: date.getDay(), // 0 = Sunday, 6 = Saturday
        date: date
      };
    });

    const roasts = [];
    const badges = [];
    let score = 0;

    // Late night coding analysis
    const lateNightCommits = timeData.filter(t => t.hour >= 23 || t.hour <= 5).length;
    if (lateNightCommits > commits.length * 0.4) {
      roasts.push(`🌙 ${Math.round((lateNightCommits / commits.length) * 100)}% of your commits happen after 11 PM. Your code has insomnia, and probably bugs too!`);
      score += 12;
      badges.push('🌙 Night Owl Coder');
    }

    // Weekend warrior analysis
    const weekendCommits = timeData.filter(t => t.day === 0 || t.day === 6).length;
    if (weekendCommits > commits.length * 0.6) {
      roasts.push(`🏖️ You code more on weekends than weekdays. Either you're super dedicated or your work-life balance needs therapy!`);
      score += 10;
      badges.push('🏖️ Weekend Warrior');
    }

    // Commit timing consistency
    const hours = timeData.map(t => t.hour);
    const hourVariance = this.calculateVariance(hours);
    if (hourVariance < 4) {
      roasts.push(`⏰ You commit at almost the same time every day. Are you a robot, or just really, really boring?`);
      score += 8;
      badges.push('⏰ Human Cron Job');
    }

    // Holiday coding (approximation)
    const holidaySeasons = timeData.filter(t => {
      const month = t.date.getMonth();
      const day = t.date.getDate();
      // Christmas/New Year season or July 4th area
      return (month === 11 && day > 20) || (month === 0 && day < 5) || (month === 6 && day === 4);
    }).length;

    if (holidaySeasons > 0) {
      roasts.push(`🎄 ${holidaySeasons} commits during holiday seasons? Your family must love watching you debug instead of opening presents!`);
      score += 15;
      badges.push('🎄 Holiday Code Goblin');
    }

    if (roasts.length === 0) return null;

    return {
      text: roasts.join(' '),
      score,
      badges
    };
  }

  private analyzeNamingCreativity(repos: Repository[]): { text: string; score: number; badges: string[] } | null {
    if (repos.length === 0) return null;

    const roasts = [];
    const badges = [];
    let score = 0;

    // Repository name analysis
    const repoNames = repos.map(r => r.name.toLowerCase());
    
    // Check for sequential naming (project1, project2, etc.)
    const sequentialPattern = /\d+$/;
    const sequentialRepos = repoNames.filter(name => sequentialPattern.test(name));
    if (sequentialRepos.length > 3) {
      roasts.push(`🔢 You name repos like "project1", "project2"... Creative bankruptcy called - it wants its job back!`);
      score += 15;
      badges.push('🔢 Sequential Namer');
    }

    // Check for "my-" prefix abuse
    const myPrefixRepos = repoNames.filter(name => name.startsWith('my-'));
    if (myPrefixRepos.length > 2) {
      roasts.push(`📝 "my-something" repos everywhere! We get it, they're yours. The GitHub URL already tells us that!`);
      score += 10;
      badges.push('📝 Captain Obvious');
    }

    // Check for clone/copy naming
    const cloneWords = ['clone', 'copy', 'replica', 'version', 'fork'];
    const cloneRepos = repoNames.filter(name => 
      cloneWords.some(word => name.includes(word))
    );
    if (cloneRepos.length > 1) {
      roasts.push(`📱 Multiple "clone" or "copy" repos? Originality left the chat and never came back!`);
      score += 12;
      badges.push('📱 Clone Trooper');
    }

    // Check for overly long names
    const longNames = repos.filter(r => r.name.length > 40);
    if (longNames.length > 0) {
      roasts.push(`📏 Repository names longer than this sentence? Save the essays for your README!`);
      score += 8;
      badges.push('📏 Title Novelist');
    }

    // Check for single letter or number repos
    const singleCharRepos = repoNames.filter(name => name.length === 1);
    if (singleCharRepos.length > 0) {
      roasts.push(`🔤 Single letter repo names? Did you run out of alphabet or creativity first?`);
      score += 10;
      badges.push('🔤 Minimalist Extremist');
    }

    // Check for "untitled" or "new" repos
    const lazyNames = repoNames.filter(name => 
      ['untitled', 'new', 'repo', 'project', 'code', 'stuff'].includes(name)
    );
    if (lazyNames.length > 0) {
      roasts.push(`💤 Repos named "untitled" or "new"? Your creativity is so lazy, it filed for unemployment!`);
      score += 14;
      badges.push('💤 Name Procrastinator');
    }

    if (roasts.length === 0) return null;

    return {
      text: roasts.join(' '),
      score,
      badges
    };
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }
}
