# Setup Guide — TestPOS 2.0

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A modern web browser (Chrome, Firefox, Edge, Safari)

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FriendzoneGuardian/TestPOS-2.0.git
cd TestPOS-2.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Log In

Use the demo credentials:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `accounting` | `acc123` | Accounting |
| `cashier` | `cash123` | Cashier |

---

## Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The production build is output to the `dist/` directory. Deploy the contents of `dist/` to any static hosting service (Netlify, Vercel, GitHub Pages, Nginx, etc.).

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/testpos/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> **Important**: The `try_files` directive is required for Vue Router's HTML5 history mode to work correctly.

---

## Environment Notes

- All data is stored in the browser's `localStorage` — no backend server is required.
- Transaction history is limited to the last 500 records.
- User accounts are hardcoded in `src/stores/auth.js` — modify to integrate with a real authentication backend.

---

## Linting & Code Quality

```bash
# Run ESLint (if configured)
npm run lint
```

---

## Project Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
