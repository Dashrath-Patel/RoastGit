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

  generateRoast(user: GitHubUser, repos: Repository[], commits: CommitData[]): RoastResult {
    const roastElements = [];
    let score = 0;
    const badges = [];

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
}
