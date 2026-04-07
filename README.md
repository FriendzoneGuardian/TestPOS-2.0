# TestPOS 2.0 — Farm Point of Sales System

A modern, web-based Point of Sales application built with **Vue 3 + Vite + Vuetify 3**.

## Features

- **3 User Roles**: Admin, Accounting, Cashier (role-based access control)
- **POS Terminal**: Product catalog with search/filter, cart management, payment processing (Cash, Card, GCash)
- **Dashboard**: Real-time stats, quick actions, recent transactions
- **Reports**: Date range filtering, Chart.js sales charts, CSV export (Admin & Accounting)
- **User Management**: Add/edit/deactivate users (Admin only)
- **3 Themes**: Dawn (light), Dusk (dark), AMOLED — all Forest Green (#228B22) primary
- **Security**: 180-second inactivity auto-logout with 30-second warning dialog

## Tech Stack

| | |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite 5 |
| UI Library | Vuetify 3 (Material Design) |
| State | Pinia |
| Router | Vue Router 4 |
| Charts | Chart.js |

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and log in with a demo account:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `accounting` | `acc123` | Accounting |
| `cashier` | `cash123` | Cashier |

## Build for Production

```bash
npm run build
```

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [User Manual](./docs/user-manual.md)
- [API Reference (Pinia Stores)](./docs/api-reference.md)
- [Contributing Guide](./collaboration/CONTRIBUTING.md)
- [Changelog](./collaboration/CHANGELOG.md)
- [Wiki Setup](./wiki/README.md)

---

© 2025 FarmsCore Inc. — TestPOS 2.0
