# TestPOS 2.0

TestPOS 2.0 includes:

- **Frontend:** Vue 3 + Vite + Vuetify POS app at repository root
- **Backend:** Laravel 8 scaffold in `/backend` (XAMPP-capable, PHP 8.0 compatible)

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, Vite 8, Vuetify 3, Pinia, Vue Router 4 |
| Backend | Laravel 8 |
| Charts | Chart.js |

## Frontend Quick Start

```bash
cd /home/runner/work/TestPOS-2.0/TestPOS-2.0
npm install
npm run dev
```

## Backend Quick Start (Laravel 8)

```bash
cd /home/runner/work/TestPOS-2.0/TestPOS-2.0/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --host=127.0.0.1 --port=8000
```

## XAMPP Note

- Laravel backend is pinned to **v8** for PHP `< 8.1` compatibility targets.
- Recommended XAMPP PHP version: **8.0.x**.

Detailed setup is documented at [docs/laravel-backend.md](./docs/laravel-backend.md).

## Current Integration Status

- Frontend currently uses mock auth and local storage.
- Laravel backend is scaffolded and ready for API integration in follow-up work.

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Laravel Backend Setup](./docs/laravel-backend.md)
- [User Manual](./docs/user-manual.md)
- [API Reference (Pinia Stores)](./docs/api-reference.md)
- [Contributing Guide](./collaboration/CONTRIBUTING.md)
- [Changelog](./collaboration/CHANGELOG.md)
- [Wiki Setup](./wiki/README.md)
