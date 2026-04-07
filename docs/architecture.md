# Architecture Overview — TestPOS 2.0

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vue 3 (Composition API) |
| Build Tool | Vite 8 |
| UI Component Library | Vuetify 3 (Material Design) |
| State Management | Pinia |
| Routing | Vue Router 4 |
| Charts | Chart.js + vue-chartjs |
| Icons | Material Design Icons (@mdi/font) |
| Backend API Layer | Laravel 8 (`backend/`) |

## Directory Structure

```
src/
├── App.vue                     # Root component, mounts theme & inactivity watcher
├── main.js                     # App entry point
├── plugins/
│   └── vuetify.js              # Vuetify setup with Dawn/Dusk/AMOLED themes
├── router/
│   └── index.js                # Vue Router config, navigation guards
├── stores/
│   ├── auth.js                 # Authentication state (Pinia)
│   ├── theme.js                # Theme switching state (Pinia)
│   ├── pos.js                  # POS terminal state, products, cart, transactions
│   └── reports.js              # Reports & analytics computations
├── composables/
│   └── useInactivity.js        # Inactivity timer composable
├── layouts/
│   └── AppLayout.vue           # Shell layout: nav drawer, app bar, main content
├── components/
│   └── common/
│       └── InactivityWatcher.vue  # Dialog warning before session timeout
└── views/
    ├── auth/
    │   └── LoginView.vue       # Login page
    ├── dashboard/
    │   └── DashboardView.vue   # Dashboard with stats, quick actions, recent transactions
    ├── terminal/
    │   └── TerminalView.vue    # POS terminal: product grid + cart + payment
    ├── reports/
    │   └── ReportsView.vue     # Sales reports, charts, export
    └── admin/
        └── UsersView.vue       # User management (admin only)
```

## Data Flow

```
User Interaction
      │
      ▼
  Vue Components (Views/Layouts)
      │
      ▼
  Pinia Stores (auth, pos, theme, reports)
      │
      ├──► localStorage  (persists: user session, transactions, theme)
      │
      └──► (planned) HTTP API calls to Laravel backend (`/backend`)
                   │
                   ▼
              Laravel 8 app (routes, controllers, models, DB)
```

## Backend Layer (Laravel)

- Directory: `/backend`
- Framework: Laravel 8
- PHP compatibility: `^7.3|^8.0` (supports PHP `< 8.1` target environments)
- Current status: scaffolded and ready for API integration

See [`docs/laravel-backend.md`](./laravel-backend.md) for setup details.

## Frontend Data Flow (Current)

```
User Interaction
      │
      ▼
  Vue Components (Views/Layouts)
      │
      ▼
  Pinia Stores (auth, pos, theme, reports)
      │
      ├──► localStorage  (persists: user session, transactions, theme)
      │
      └──► Computed properties  (reactive derived state)
```

## Authentication

- **Mock-based**: Users are hardcoded in `src/stores/auth.js` (suitable for demo).
- Session is persisted in `localStorage` under the key `pos_user`.
- Navigation guards in `src/router/index.js` enforce:
  - `requiresAuth`: Redirect unauthenticated users to `/login`.
  - `requiresGuest`: Redirect authenticated users away from `/login`.
  - `roles`: Restrict access to specific user roles.

### User Roles

| Role | Accessible Pages |
|------|-----------------|
| `admin` | Dashboard, Terminal, Reports, Users |
| `accounting` | Dashboard, Reports |
| `cashier` | Dashboard, Terminal |

## Theme System

Three themes defined in `src/plugins/vuetify.js`:

| Theme | Mode | Background | Primary Color |
|-------|------|-----------|---------------|
| `dawn` | Light | `#F1F8E9` | `#228B22` Forest Green |
| `dusk` | Dark | `#1B2B1B` | `#4CAF50` |
| `amoled` | Dark | `#000000` | `#4CAF50` |

- Theme preference is persisted in `localStorage` under `pos_theme`.
- `useThemeStore.cycleTheme()` rotates through themes in order: Dawn → Dusk → AMOLED → Dawn.

## Inactivity Timer

The `useInactivity` composable (`src/composables/useInactivity.js`) implements:

1. A **180-second countdown** that resets on any user interaction (mouse, keyboard, touch, scroll, click).
2. When the countdown reaches zero, the `onIdle` callback is invoked.
3. `AppLayout.vue` uses this composable to log out and redirect to `/login?reason=inactivity`.
4. `InactivityWatcher.vue` shows a persistent dialog warning when ≤30 seconds remain.

## POS Terminal Design

- **Products Panel** (left): Grid of product cards filtered by category and search.
- **Cart Panel** (right): Line items with quantity controls, subtotal, 12% VAT, and total.
- **Payment Dialog**: Supports Cash (with change calculation), Card, and GCash payment methods.
- **Receipt Dialog**: Displayed after successful payment, shows itemized receipt.
- All transactions are stored in Pinia and persisted to `localStorage` (up to 500 records).

## Reports

- Date range filtering via start/end date pickers.
- Sales-by-day bar chart powered by Chart.js.
- Top-10 products by revenue.
- Full transaction log with pagination.
- CSV export of filtered transaction data.
