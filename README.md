# AGUI CV - AI-Powered Resume Builder

An intelligent resume builder that leverages AI to help job seekers create professional, ATS-friendly resumes through natural conversation.

Built with [Mastra AI](https://mastra.ai) for agent orchestration and [CopilotKit](https://copilotkit.ai) for conversational UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<img width="1919" height="824" alt="Screenshot 2025-12-07 171656" src="https://github.com/user-attachments/assets/e7e562a4-5a61-406c-9237-f89733a00d2a" />

## Overview

AGUI CV solves a common problem: creating professional, ATS-friendly resumes is time-consuming and requires design and formatting skills that many people don't have. Instead of spending hours on formatting and second-guessing content, users can have a conversation with an AI that understands career consulting and generates professional output automatically.

## Features

### Current Capabilities

- **Resume Upload & Parsing**: Upload existing resumes in PDF, DOCX, or TXT format. The AI automatically extracts and analyzes your career history
- **Conversational AI Agent**: Context-aware AI career consultant that understands your background and provides expert guidance
- **Real-time LaTeX Compilation**: Professional PDF generation using LaTeX templates with real-time preview
- **ATS-Optimized Templates**: Built-in templates designed to pass Applicant Tracking Systems
- **Professional Formatting**: Clean, modern resume layouts that look great and are easy to read
- **Resume Download**: Export your polished resume as a downloadable PDF

### Future Roadmap

- **ATS Scoring Engine**: Analyze how well your resume performs with applicant tracking systems and get actionable optimization suggestions
- **Job Description-Aware Tailoring**: Paste a job description and get a resume optimized specifically for that role, with relevant keywords and experience highlighted
- **Enhanced Export Options**: Multiple format exports (PDF, DOCX, plain text)
- **Industry-Specific Templates**: Curated templates for different industries and career levels
- **Cover Letter Generation**: AI-powered cover letter writing based on your resume and target job

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org) with React 19, TailwindCSS 4
- **AI Framework**: [Mastra](https://mastra.ai) for AI agent orchestration and memory management
- **Conversational UI**: [CopilotKit](https://copilotkit.ai) for seamless chat interface
- **LLM Provider**: OpenRouter (supporting multiple models including GPT-4o-mini, Claude, and more)
- **PDF Generation**: LaTeX.Online API for professional resume compilation
- **Resume Parsing**: Custom parsing logic for PDF, DOCX, and TXT files
- **Database**: LibSQL for agent memory (in-memory for development)

## Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, pnpm, yarn, or bun
- **OpenRouter API Key**: Get one at [openrouter.ai](https://openrouter.ai/keys)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vivek31singh/agui-cv.git
cd agui-cv
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your OpenRouter API key
```

Required environment variables:
```env
# OpenRouter API Key (required)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# CopilotKit Public Keys (optional for local dev, required for cloud features)
NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY=your_copilotkit_public_key_here
NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY=your_copilotkit_public_key_here

# Client IP Encryption Key (Recommended to remove warning)
COPILOTKIT_CLIENT_IP_ENCRYPTION_KEY=your_random_secret_string

# Optional: Logging level (debug, info, warn, error)
LOG_LEVEL=info
```

To get your OpenRouter API key:
1. Visit [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Copy it to your `.env.local` file

To get your CopilotKit keys:
1. Visit [cloud.copilotkit.ai](https://cloud.copilotkit.ai)
2. Sign up or log in
3. Copy your Public API Key
4. Add it to both CopilotKit variables in your `.env.local` file

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Starts both UI and agent servers in development mode with Turbopack |
| `dev:agent` | Starts only the Mastra agent development server |
| `dev:ui` | Starts only the Next.js UI development server |
| `dev:debug` | Starts development servers with debug logging enabled |
| `build` | Builds the application for production |
| `start` | Starts the production server |
| `lint` | Runs ESLint for code linting |

## Project Structure

```
agui-cv/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── compile-latex/ # LaTeX compilation endpoint
│   │   │   └── copilotkit/    # CopilotKit runtime endpoint
│   │   └── page.tsx           # Main application page
│   ├── components/            # React components
│   │   └── PdfPreview.tsx     # PDF preview component
│   ├── lib/                   # Utility functions
│   │   ├── resume-parser.ts   # Resume file parsing logic
│   │   └── types.ts           # TypeScript type definitions
│   └── mastra/               # Mastra AI configuration
│       ├── agents/           # AI agent definitions
│       │   └── index.ts      # Resume agent configuration
│       ├── mcp/              # MCP server integrations
│       └── index.ts          # Mastra initialization
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## How It Works

1. **Upload or Start Fresh**: Users can either upload an existing resume (PDF, DOCX, or TXT) or start from scratch
2. **AI Conversation**: The Mastra-powered agent engages in natural conversation to understand the user's career goals and gather information
3. **Content Generation**: The AI generates professional, ATS-optimized resume content in LaTeX format
4. **Real-time Preview**: LaTeX is compiled to PDF via the LaTeX.Online API and displayed in real-time
5. **Download**: Users can download their polished resume as a professional PDF

## Configuration

### AI Model Configuration

The application uses OpenRouter to access various LLM models. By default, it is configured to use ZhipuAI's GLM-4.6, but you can easily switch this.

**Default Configuration:**
- **UI Model**: `openai/gpt-4o-mini` (for CopilotKit chat interface)
- **Agent Model**: `zhipuai-coding-plan/glm-4.6` (for resume generation)

**To Switch Models:**
Change the `RESUME_AGENT_MODEL` variable in your `.env.local` file:

```env
# Example: Switch to Claude 3.5 Sonnet
RESUME_AGENT_MODEL="anthropic/claude-3.5-sonnet"

# Example: Switch to GPT-4o
RESUME_AGENT_MODEL="openai/gpt-4o"
```

No code changes are required to switch agent models!

### Logging

Set the `LOG_LEVEL` environment variable to control logging verbosity:
- `debug`: Detailed debugging information
- `info`: General informational messages (default)
- `warn`: Warning messages only
- `error`: Error messages only

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Guidelines

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly before submitting
4. Update documentation as needed

## Troubleshooting

### Common Issues

**Issue**: "Failed to compile LaTeX"
- **Solution**: Ensure your internet connection is stable (LaTeX.Online API requires internet access)

**Issue**: "Invalid API key" error
- **Solution**: Verify your `OPENROUTER_API_KEY` is correctly set in `.env.local`

**Issue**: Resume upload fails
- **Solution**: Ensure your file is in PDF, DOCX, or TXT format and is under 10MB

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Mastra](https://mastra.ai) - For the powerful AI agent framework
- [CopilotKit](https://copilotkit.ai) - For the excellent conversational UI components
- [OpenRouter](https://openrouter.ai) - For unified LLM API access
- [LaTeX.Online](https://latexonline.cc/) - For LaTeX compilation service

## Contact

Built by [Vivek Singh](https://linkedin.com/in/vivek31singh)

- LinkedIn: [@vivek-singh05](https://www.linkedin.com/in/vivek-singh05/)
- Twitter/X: [@VivekSingh_003](https://x.com/VivekSingh_003)
---

⭐ If you find this project helpful, please consider giving it a star!
