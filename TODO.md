# ✅ Guess Movie Game Platform – Backend TODO

## ✅ Project Setup

- [x] TypeScript setup
- [x] ESLint + Prettier configured
- [x] Husky + lint-staged working
- [x] MongoDB connection with environment switching
- [x] Testing environment (Jest + Supertest)
- [x] `CONFIG` system with `.env.*` support

---

## 🚀 Phase 1: User Auth Module

- [x] Create User model (Mongoose)
- [x] Create register controller
- [ ] Create login controller
- [ ] Setup JWT utils (sign/verify)
- [ ] Set access/refresh token in cookies
- [ ] Add token verification middleware
- [ ] Add route: `GET /auth/me`
- [ ] Add logout route (clear cookies)
- [ ] Add tests for all auth routes

---

## 🎮 Phase 2: Content Management

- [ ] Create Content model
- [ ] Create Monitor approval logic
- [ ] Add route: `POST /content`
- [ ] Add route: `POST /content/verify`
- [ ] Add route: `GET /content` (filtered & verified only)
- [ ] Add tests for content APIs

---

## 🕹️ Phase 3: Game Room Logic

- [ ] Create GameRoom model
- [ ] Create Round model
- [ ] Add route: `POST /room/create`
- [ ] Add route: `POST /room/join`
- [ ] Add route: `POST /room/answer`
- [ ] Add route: `POST /room/reveal`
- [ ] Add tests for game logic

---

## 🏆 Phase 4: Leaderboard & Achievements

- [ ] Create Leaderboard model
- [ ] Add route: `GET /leaderboard`
- [ ] Add weekly reset cron job
- [ ] Add achievement tracking (bonus)

---

## 🔒 Phase 5: Admin & Monitor Tools

- [ ] Add ban user endpoint
- [ ] Add content report model
- [ ] Add moderation route: `GET /reports`
- [ ] Add audit log model (optional)

---

## 🌍 Phase 6: Multi-language Support

- [ ] Add `language` to content & users
- [ ] Filter content by user’s language
- [ ] Add i18n support to API response (optional)

---

## 🧪 Testing Coverage

- [ ] Test all auth routes
- [ ] Test all content routes
- [ ] Test all game room routes
- [ ] Run all tests in CI

---

## 🛡️ Deployment & CI (Final Phase)

- [ ] Add production-ready logger (winston + rotating logs)
- [ ] Setup GitHub Actions for test + lint
- [ ] Add Dockerfile and .dockerignore
- [ ] Setup CI/CD pipeline

---

✅ Let’s build it clean and modular!
