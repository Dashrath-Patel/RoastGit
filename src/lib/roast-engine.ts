export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  company?: string;
  location?: string;
  blog?: string;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  size: number;
  open_issues_count: number;
  topics: string[];
}

export interface CommitData {
  message: string;
  date: string;
  author: string;
}

export interface RoastAnalysis {
  profileScore: number;
  repoScore: number;
  commitScore: number;
  overallScore: number;
  badges: string[];
}

const ROAST_EMOJIS = ['🔥', '💀', '😈', '🎪', '🤡', '💩', '🗑️', '👻', '🤓', '🥱'];

export class GitHubRoastEngine {
  private getRandomEmoji(): string {
    return ROAST_EMOJIS[Math.floor(Math.random() * ROAST_EMOJIS.length)];
  }

  private analyzeProfile(user: GitHubUser): { roasts: string[], score: number } {
    const roasts = [];
    let score = 50; // Start neutral

    // Bio analysis
    if (!user.bio || user.bio.trim() === '') {
      roasts.push(`${this.getRandomEmoji()} No bio? Let me guess - your personality is as empty as your bio section.`);
      score -= 10;
    } else if (user.bio.length < 20) {
      roasts.push(`${this.getRandomEmoji()} "${user.bio}" - Shakespeare is rolling in his grave at this literary masterpiece.`);
      score -= 5;
    }

    // Repository count analysis
    if (user.public_repos === 0) {
      roasts.push(`${this.getRandomEmoji()} Zero public repos? Are you collecting stars for your private collection or just scared of code reviews?`);
      score -= 20;
    } else if (user.public_repos > 200) {
      roasts.push(`${this.getRandomEmoji()} ${user.public_repos} repos? Quality over quantity much? It's not a competition to see who can create the most 'hello-world' projects.`);
      score -= 10;
    }

    // Social metrics
    if (user.followers === 0) {
      roasts.push(`${this.getRandomEmoji()} Zero followers? Even your code doesn't want to follow you home.`);
      score -= 15;
    } else if (user.following > user.followers * 5) {
      roasts.push(`${this.getRandomEmoji()} Following ${user.following} people while only ${user.followers} follow you back? That's some serious developer desperation right there.`);
      score -= 10;
    }

    // Account age vs activity
    const accountAge = new Date().getFullYear() - new Date(user.created_at).getFullYear();
    if (accountAge > 5 && user.public_repos < 10) {
      roasts.push(`${this.getRandomEmoji()} ${accountAge} years on GitHub and only ${user.public_repos} repos? What have you been doing, collecting digital dust?`);
      score -= 15;
    }

    // Name and username analysis
    if (user.login.includes('123') || user.login.includes('xxx') || /\d{4,}/.test(user.login)) {
      roasts.push(`${this.getRandomEmoji()} Username "${user.login}"? Did you let your cat walk on the keyboard during registration?`);
      score -= 5;
    }

    return { roasts, score };
  }

  private analyzeRepositories(repos: Repository[]): { roasts: string[], score: number } {
    const roasts = [];
    let score = 50;

    if (repos.length === 0) return { roasts: [], score: 0 };

    // Repository names
    const repoNames = repos.map(r => r.name.toLowerCase());
    const boringNames = repoNames.filter(name => 
      name.includes('test') || name.includes('hello') || name.includes('practice') || 
      name.includes('tutorial') || name === 'untitled' || name.includes('copy') ||
      name.includes('demo') || name.includes('sample') || /project\d+/.test(name)
    );

    if (boringNames.length > 0) {
      roasts.push(`${this.getRandomEmoji()} Repo names like "${boringNames[0]}"? Did you run out of creativity or is this your first day coding?`);
      score -= 10;
    }

    // Repository descriptions
    const noDescRepos = repos.filter(repo => !repo.description || repo.description.trim() === '');
    if (noDescRepos.length > repos.length * 0.5) {
      roasts.push(`${this.getRandomEmoji()} Half your repos have no description. Are they top secret or just too embarrassing to explain?`);
      score -= 10;
    }

    // Last updated analysis
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oldRepos = repos.filter(repo => new Date(repo.updated_at) < oneYearAgo);

    if (oldRepos.length > repos.length * 0.7) {
      roasts.push(`${this.getRandomEmoji()} Most of your repos haven't been touched in ages. What happened? Did you discover life outside of coding?`);
      score -= 15;
    }

    // Stars analysis
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const noStarRepos = repos.filter(repo => repo.stargazers_count === 0);
    
    if (noStarRepos.length === repos.length && repos.length > 0) {
      roasts.push(`${this.getRandomEmoji()} Zero stars across ALL repos? Even your mom didn't star your projects!`);
      score -= 20;
    } else if (totalStars < repos.length) {
      roasts.push(`${this.getRandomEmoji()} ${totalStars} total stars across ${repos.length} repos? Your code is about as popular as pineapple on pizza in Italy.`);
      score -= 10;
    }

    // Language diversity
    const languages = repos.map(r => r.language).filter(Boolean);
    const uniqueLanguages = [...new Set(languages)];
    
    if (uniqueLanguages.length === 1 && repos.length > 3) {
      roasts.push(`${this.getRandomEmoji()} Only coding in ${uniqueLanguages[0]}? Branching out isn't just for Git, you know.`);
      score -= 10;
    }

    // Repository size analysis
    const tinyRepos = repos.filter(repo => repo.size < 100); // Less than 100KB
    if (tinyRepos.length > repos.length * 0.8) {
      roasts.push(`${this.getRandomEmoji()} Most of your repos are smaller than a selfie. Are you coding haikus?`);
      score -= 10;
    }

    // Issues analysis
    const reposWithIssues = repos.filter(repo => repo.open_issues_count > 0);
    if (reposWithIssues.length > repos.length * 0.8) {
      roasts.push(`${this.getRandomEmoji()} Issues galore! Your code has more problems than a soap opera.`);
      score -= 10;
    }

    return { roasts, score };
  }

  private analyzeCommits(commits: CommitData[]): { roasts: string[], score: number } {
    const roasts = [];
    let score = 50;

    if (commits.length === 0) {
      roasts.push(`${this.getRandomEmoji()} No commits to analyze? Either you're very private or very inactive.`);
      return { roasts, score: 20 };
    }

    // Commit message quality
    const badMessages = commits.filter(commit => {
      const msg = commit.message.toLowerCase().trim();
      return msg === 'fix' || msg === 'update' || msg === 'changes' || 
             msg.includes('stuff') || msg.includes('things') || 
             msg.length < 10 || msg.includes('asdf') || msg.includes('test') ||
             msg === 'wip' || msg === 'temp' || /^.{1,5}$/.test(msg) ||
             msg.includes('fuck') || msg.includes('shit') || msg.includes('damn');
    });

    if (badMessages.length > 0) {
      roasts.push(`${this.getRandomEmoji()} Commit messages like "${badMessages[0].message}"? Your future self is crying right now.`);
      score -= 15;
    }

    // Commit frequency analysis
    const commitDates = commits.map(c => new Date(c.date).getTime());
    const gaps = [];
    for (let i = 1; i < commitDates.length; i++) {
      gaps.push(commitDates[i-1] - commitDates[i]);
    }
    
    const avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
    const daysGap = avgGap / (1000 * 60 * 60 * 24);
    
    if (daysGap > 30) {
      roasts.push(`${this.getRandomEmoji()} Committing once a month? Are you coding or hibernating?`);
      score -= 10;
    }

    // Emoji overuse in commits
    const emojiCommits = commits.filter(commit => {
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojiCount = (commit.message.match(emojiRegex) || []).length;
      return emojiCount > 3;
    });

    if (emojiCommits.length > commits.length * 0.3) {
      roasts.push(`${this.getRandomEmoji()} Too many emojis in commits! This is Git, not Instagram Stories! 🤳📱✨`);
      score -= 10;
    }

    return { roasts, score };
  }

  private calculateBadges(analysis: RoastAnalysis): string[] {
    const badges = [];

    if (analysis.overallScore < 30) badges.push('💩 Code Disaster');
    if (analysis.overallScore > 70) badges.push('⭐ Actually Decent');
    if (analysis.profileScore < 30) badges.push('👻 Ghost Profile');
    if (analysis.repoScore < 30) badges.push('🗑️ Repository Wasteland');
    if (analysis.commitScore < 30) badges.push('📝 Commit Chaos');
    if (analysis.overallScore < 20) badges.push('🏆 Ultimate Roast Victim');

    return badges;
  }

  public generateRoast(user: GitHubUser, repos: Repository[], commits: CommitData[]): string {
    const profileAnalysis = this.analyzeProfile(user);
    const repoAnalysis = this.analyzeRepositories(repos);
    const commitAnalysis = this.analyzeCommits(commits);

    const analysis: RoastAnalysis = {
      profileScore: profileAnalysis.score,
      repoScore: repoAnalysis.score,
      commitScore: commitAnalysis.score,
      overallScore: Math.round((profileAnalysis.score + repoAnalysis.score + commitAnalysis.score) / 3),
      badges: []
    };

    analysis.badges = this.calculateBadges(analysis);

    const allRoasts = [
      ...profileAnalysis.roasts,
      ...repoAnalysis.roasts,
      ...commitAnalysis.roasts
    ];

    // Add some general roasts based on overall score
    if (analysis.overallScore < 40) {
      allRoasts.push(`${this.getRandomEmoji()} Overall roast score: ${analysis.overallScore}/100. Ouch! That's lower than my expectations for JavaScript frameworks lasting more than 6 months.`);
    }

    // Add badges section
    if (analysis.badges.length > 0) {
      allRoasts.push(`\n🏅 **Badges Earned:** ${analysis.badges.join(' ')}`);
    }

    // Final motivation with heavy emoji use
    allRoasts.push(`\n${this.getRandomEmoji()} But hey, at least you're consistent... consistently providing entertainment! 🎪 Keep coding though - someone has to write the bugs for the rest of us to fix! 🐛💻🔥 Remember, every expert was once a beginner, but not every beginner becomes an expert! 😉🚀`);

    return allRoasts.join('\n\n');
  }
}
