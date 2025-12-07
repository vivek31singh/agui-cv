# Contributing to AGUI CV

First off, thank you for considering contributing to AGUI CV! It's people like you that make this tool better for everyone in the job search community.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected
- **Include screenshots** if relevant
- **Specify your environment**: OS, Node.js version, browser, etc.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** or features you've considered

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure your code follows the existing style
5. Write a clear commit message

## Development Process

### Setting Up Your Development Environment

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your API key
4. Start the development server: `npm run dev`

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (we use ESLint)
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add ATS scoring feature

- Implement keyword matching algorithm
- Add scoring UI component
- Update agent instructions

Closes #123
```

### Testing

Before submitting a pull request:

1. Test your changes thoroughly
2. Ensure the application builds without errors: `npm run build`
3. Run the linter: `npm run lint`
4. Test on both desktop and mobile browsers if UI changes are involved

## Project Structure

Understanding the codebase:

- `/src/app` - Next.js app router and pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and helpers
- `/src/mastra` - AI agent configuration and logic
- `/public` - Static assets

## Areas for Contribution

We especially welcome contributions in these areas:

1. **ATS Optimization**: Enhance the ATS scoring algorithm
2. **Resume Templates**: Create new professional templates
3. **Resume Parsing**: Improve extraction accuracy for various formats
4. **UI/UX**: Better mobile responsiveness, accessibility improvements
5. **Testing**: Add unit tests and integration tests
6. **Documentation**: Improve code comments, READMEs, and guides

## Questions?

Feel free to open an issue with your question or reach out directly.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
