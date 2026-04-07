# Changelog

All notable changes to TestPOS 2.0 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project scaffold

---

## [2.0.0] - 2025-04-07

### Added
- Complete Vue 3 + Vite application setup
- Vuetify 3 integration with Forest Green Material Design themes
- Three themes: Dawn (light), Dusk (dark), AMOLED (pure black dark)
- Pinia state management for auth, POS, theme, and reports
- Vue Router 4 with role-based navigation guards
- Login page with demo credential hints and theme toggle
- Dashboard with real-time stats, quick actions, and recent transactions
- POS Terminal with product grid, cart management, and payment processing
- Payment methods: Cash (with change calculation), Card, GCash
- Reports page with date range filtering, Chart.js bar chart, top products, CSV export
- User management page (Admin only)
- 180-second inactivity lockdown with 30-second warning dialog
- Session persistence via localStorage
- Responsive layout with collapsible navigation drawer
- Documentation: Architecture, User Manual, API Reference
- Collaboration: Contributing guide, Changelog, Audit log template
- Wiki: Home, Setup pages

### Security
- Passwords stripped from stored user sessions
- Role-based route guards preventing unauthorized access

---

[Unreleased]: https://github.com/FriendzoneGuardian/TestPOS-2.0/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/FriendzoneGuardian/TestPOS-2.0/releases/tag/v2.0.0
