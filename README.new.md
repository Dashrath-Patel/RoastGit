# 🔥 GitHub Roaster 🔥

A hilarious web app that roasts GitHub profiles based on their contributions, commit messages, and questionable emoji use! Built with Next.js, Aceternity UI, and a healthy dose of sarcasm.

![GitHub Roaster](https://img.shields.io/badge/status-roasting-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)

## 🚀 Features

- **Smart Analysis**: Analyzes GitHub profiles, repositories, and commit patterns
- **AI-Powered Roasts**: Generates personalized roasts based on coding habits
- **Beautiful UI**: Built with Aceternity UI components and smooth animations  
- **Interactive Effects**: Sparkles, meteors, and gradient backgrounds
- **Share & Copy**: Easy sharing and copying of roast results
- **Rate Limiting**: Handles GitHub API rate limits gracefully

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Aceternity UI, Shadcn UI  
- **Styling**: Tailwind CSS
- **API**: GitHub REST API (via Octokit)
- **Animations**: Framer Motion
- **Icons**: Lucide React, Tabler Icons

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roastgit.git
   cd roastgit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional but recommended)
   ```bash
   cp .env.example .env.local
   ```
   Add your GitHub Personal Access Token to increase rate limits:
   ```
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` and start roasting! 🔥

## 🎯 How It Works

1. **Enter a GitHub username** - Try yours or any public GitHub user
2. **AI Analysis** - Our roasting engine analyzes:
   - Profile completeness and social metrics
   - Repository quality and naming conventions  
   - Commit message quality and patterns
   - Code activity and contribution patterns
   - Language diversity and project scope

3. **Get Roasted** - Receive a personalized, humorous roast with:
   - Witty observations about coding habits
   - Emoji-heavy commentary 🪄 📟 🦴 💾 🫠
   - Achievement badges for different levels of... interesting code
   - Shareable results

## 🔧 Configuration

### GitHub Token Setup
To avoid rate limiting, get a GitHub Personal Access Token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `public_repo` and `read:user` scopes
3. Add it to your `.env.local` file

### Customization
- Modify roasting logic in `src/lib/roast-engine.ts`
- Adjust UI components in `src/components/roast/`
- Update styling in Tailwind classes

## 📖 Example Roasts

Try these GitHub usernames for inspiration:
- `octocat` - The GitHub mascot
- `torvalds` - Creator of Linux  
- `gaearon` - React core team
- `sindresorhus` - NPM package master
- `tj` - Node.js legend

## 🤝 Contributing

Want to make the roasts even more savage? Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/more-savage-roasts`)
3. Create your changes (`git commit -m 'Add more fire to the roasts'`)
4. Push to the branch (`git push origin feature/more-savage-roasts`)  
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Aceternity UI](https://ui.aceternity.com/) for the amazing components
- Powered by [GitHub API](https://docs.github.com/en/rest) for user data
- Inspired by the need to lovingly roast fellow developers 🔥

## ⚠️ Disclaimer

This app is for entertainment purposes only. No developers were permanently harmed in the making of these roasts. Side effects may include: improved coding practices, better commit messages, and slightly bruised ego.

---

**Made with ❤️ and a lot of ☕ by developers who love to roast code (and get roasted back)**
