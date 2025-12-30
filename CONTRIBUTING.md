# Contributing to SolarWise LK

Thank you for your interest in contributing to SolarWise LK! This guide will help you get started.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `pnpm install`
4. Create a feature branch
5. Make your changes
6. Submit a pull request

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style (Prettier is configured)
- Use descriptive variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Create reusable components in `client/src/components`
- Use the existing UI components from `client/src/components/ui`
- Follow the established file structure
- Export components as default exports

### API Guidelines
- Use tRPC for all API endpoints
- Define input/output types with Zod
- Add proper error handling
- Include meaningful error messages

### Database Guidelines
- Use Drizzle ORM for database operations
- All schema changes must be migrated
- Use transactions for multi-table operations
- Add proper indexes for performance

## 🧪 Testing

- Write unit tests for utility functions
- Test API endpoints with Vitest
- Test UI components when adding complex interactions
- Ensure all tests pass before submitting PR

## 📝 Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for adding tests

Example: `feat: add solar package comparison feature`

## 🔍 Code Review Process

1. All PRs require review
2. Ensure CI/CD passes
3. Update documentation if needed
4. Request review from maintainers

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 💡 Feature Requests

- Open an issue with "Feature Request" label
- Describe the use case
- Provide implementation suggestions
- Consider impact on existing features

## 📧 Contact

For questions or discussions:
- Create an issue for technical questions
- Email: rajantha.rc@gmail.com
- GitHub: [@RajanthaR](https://github.com/RajanthaR/)
