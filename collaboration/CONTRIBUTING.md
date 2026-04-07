# Contributing to TestPOS 2.0

Thank you for your interest in contributing! Please follow these guidelines.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/FriendzoneGuardian/TestPOS-2.0.git
cd TestPOS-2.0

# Install dependencies
npm install

# Start development server
npm run dev
```

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore
Scopes: auth, pos, reports, ui, router, store, theme
```

Examples:
```
feat(pos): add barcode scanner support
fix(auth): correct session expiry logic
docs(api): update reports store reference
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code |
| `develop` | Integration branch for features |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation updates |

## Pull Request Process

1. Create a branch from `develop`.
2. Write or update tests where applicable.
3. Ensure `npm run build` succeeds with no errors.
4. Open a PR against `develop` with a clear description.
5. Request review from at least one maintainer.
6. Squash-merge after approval.

## Code Style

- Use **Vue 3 Composition API** (`<script setup>`) for all new components.
- Use **`@/`** absolute imports.
- Use Vuetify components — **no Tailwind, no custom CSS glassmorphism**.
- Prefix composable files with `use` (e.g., `useInactivity.js`).
- All currency values displayed with `₱` prefix and `.toFixed(2)`.

## Reporting Bugs

Open a GitHub Issue with:
- Browser and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
