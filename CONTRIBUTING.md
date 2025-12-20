# Contributing Guidelines

## Code Style

### JavaScript/React
- Use ES6+ syntax
- Use functional components
- Use React hooks
- Add PropTypes or TypeScript (optional)
- Use camelCase for variables and functions
- Use PascalCase for components and classes

### CSS/Tailwind
- Use Tailwind CSS utilities
- Create custom classes in `index.css` only when necessary
- Use mobile-first approach
- Maintain responsive design

### Naming Conventions
```javascript
// Components
MyComponent.jsx

// Hooks
useMyHook.js

// Utils
myUtil.js

// Constants
MY_CONSTANT = 'value'

// Variables and Functions
myVariable, myFunction()
```

## Project Structure

### Frontend
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── contexts/       # Context providers
├── services/       # API services
├── utils/          # Utility functions
├── config/         # Configuration files
└── assets/         # Static assets
```

### Backend
```
├── models/         # MongoDB schemas
├── routes/         # API routes
├── middleware/     # Express middleware
├── controllers/    # Route handlers (optional)
├── utils/          # Utility functions
├── services/       # Business logic
└── config/         # Configuration
```

## Commit Message Format

Use conventional commits:

```
type(scope): description

feat(auth): Add Google OAuth integration
fix(product): Correct price calculation bug
refactor(dashboard): Simplify component structure
docs(readme): Update installation guide
test(orders): Add order validation tests
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Tests
- `chore` - Dependencies, build tools
- `style` - Code style (no functional change)

## Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with meaningful commits
3. Update documentation
4. Add tests if applicable
5. Push branch: `git push origin feature/your-feature`
6. Create Pull Request
7. Request review
8. Address comments
9. Merge after approval

## Testing

### Frontend
```bash
# Test components
npm run test

# Coverage
npm run test:coverage
```

### Backend
```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## Performance Guidelines

### Frontend
- Minimize re-renders (use useMemo, useCallback)
- Lazy load images
- Code splitting for routes
- Optimize bundle size

### Backend
- Add database indexes
- Implement pagination
- Cache frequently accessed data
- Optimize queries

## Security Guidelines

- Never commit secrets to repository
- Use environment variables
- Validate all user input
- Sanitize database queries
- Use HTTPS in production
- Implement rate limiting
- Keep dependencies updated

## Documentation

### Code Comments
```javascript
// Use for non-obvious logic
// Good:
// Calculate total excluding tax
const subtotal = items.reduce((sum, item) => sum + item.price, 0);

// Bad: Don't state the obvious
// Loop through items and add to sum
```

### Function Documentation
```javascript
/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email
 */
function validateEmail(email) {
  // Implementation
}
```

### Component Documentation
```jsx
/**
 * Button component with multiple variants
 * @component
 * @param {Object} props
 * @param {string} props.variant - Button style variant
 * @param {ReactNode} props.children - Button content
 * @returns {ReactElement} - Rendered button
 */
export default function Button({ variant, children }) {
  // Implementation
}
```

## Review Checklist

Before submitting PR:
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] No console.log in production code
- [ ] Tests pass
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered

## Common Issues & Solutions

### Issue: Changes not reflecting
Solution: Clear browser cache, restart dev server

### Issue: Database connection failing
Solution: Check MONGODB_URI, ensure IP whitelisted

### Issue: API CORS errors
Solution: Update ALLOWED_ORIGINS, check credentials

### Issue: Environment variables not loading
Solution: Restart dev server after .env changes

## Questions?

Refer to:
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind Docs](https://tailwindcss.com)

---

**Remember**: Code quality > Speed. Write clean, maintainable code!
