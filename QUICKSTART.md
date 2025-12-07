# Quick Start Guide

Get AGUI CV running in 5 minutes.

## Prerequisites Check

Before you begin, make sure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ A package manager (npm, pnpm, yarn, or bun)
- ✅ An OpenRouter API key ([Get one here](https://openrouter.ai/keys))

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/vivek31singh/agui-cv.git
cd agui-cv

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local in your editor and add your OpenRouter API key
# Example:
# OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### 3. Start Development Server

```bash
# Run the development server (choose one)
npm run dev
# or
pnpm dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) and you should see the application running!

## First Time Using the App

1. **Start a conversation**: The AI assistant will greet you
2. **Upload a resume** (optional): Click "Upload" button to parse an existing resume
3. **Chat with the AI**: Describe your experience or ask for help
4. **Generate resume**: The AI will create a LaTeX resume
5. **Preview**: See your resume in real-time on the right panel
6. **Download**: Click "Download" to save your PDF

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000 (Windows)
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

### API Key Errors

Make sure your `.env.local` file:
- Is in the root directory
- Has the correct variable name: `OPENROUTER_API_KEY`
- Has a valid API key from OpenRouter

### LaTeX Compilation Fails

- Check your internet connection
- The LaTeX.Online API requires internet access
- Try again in a few moments if the service is temporarily down

## Next Steps

- Read the [full README](README.md) for detailed documentation
- Check out the [Contributing Guide](CONTRIBUTING.md) to contribute
- Explore the code in `/src/mastra/agents/index.ts` to customize the AI agent

## Need Help?

- Open an [issue on GitHub](https://github.com/vivek31singh/agui-cv/issues)
- Contact [@vivek31singh](https://twitter.com/vivek31singh) on Twitter/X

---

Happy resume building! 🚀
