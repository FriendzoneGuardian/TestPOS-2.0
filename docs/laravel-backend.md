# Laravel Backend Setup (XAMPP / PHP 8.1)

This project includes a Laravel backend scaffold in:

`<project-root>/backend`

## Version Choice

- Backend uses **Laravel 10** (max, per current steering).
- `backend/composer.json` requires `php: ^8.1`.

## Local Setup

```bash
cd <project-root>/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

## XAMPP Setup (Windows)

1. Use a XAMPP build with **PHP 8.1.x**.
2. Place or clone repository in `htdocs` (example: `C:\xampp\htdocs\TestPOS-2.0`).
3. Open terminal in `backend/` and run:
   - `composer install`
   - `copy .env.example .env`
   - `php artisan key:generate`
4. Configure database in `backend/.env` (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
5. Start Apache + MySQL from XAMPP Control Panel.
6. Run:
   - `php artisan migrate`
   - `php artisan serve --host=127.0.0.1 --port=8000`

## Validation Commands

```bash
php artisan --version
php artisan test
composer audit
```

## Security Note

Laravel 10.50.x is currently installed and satisfies the advisory floor for `CVE-2025-27515` (fixed in Laravel 10.48.29+).

If you keep the “Laravel 10 max” steering, continue patching within the 10.x line.
