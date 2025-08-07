# 🎬 Guess Movie Game - Backend

A full-featured real-time multiplayer and single-player movie guessing game built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.  
Players can guess movies based on frames, dialogues, or cropped visuals — solo or in rooms with friends.

---

## 🚀 Features Implemented

### ✅ Authentication

- User registration and login with token-based authentication (JWT)
- Authenticated profile fetch and update

### ✅ Role-based Access Control

- Roles: `user`, `admin`, `monitor`
- Admins can update user roles
- Content moderation by monitors

### ✅ Content Management (Frames / Dialogues / Eyes)

- Create and delete own content (frame, dialogue, etc.)
- Admin/Monitor can fetch their submitted content for approval/review

### ✅ Game Modes

- **Single Player**:
    - Fetch a random set of questions
    - Submit answers
- **Multiplayer**:
    - Room-based architecture
    - Create/join/start rooms
    - Real-time socket connection
    - Graceful reconnect support with `userId` session tracking

---

## 🧱 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Auth**: JWT
- **Validation**: express-validator
- **Testing**: Postman
- **Dev Tools**: Nodemon, ESLint, Prettier

---

## 📦 Folder Structure (simplified)

```
src/
├── config/          # DB and server config
├── constants/       # Role enums and system constants
├── controllers/     # Route controllers (v1)
├── middleware/      # JWT and error handlers
├── models/          # Mongoose models (User, Content, etc.)
├── routes/          # API route definitions
├── services/        # Business logic services
├── socket/          # Socket.IO event handlers
└── utils/           # Helpers and utilities
```

---

## 📡 REST API Endpoints

### Auth

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/auth/register`       | Register a new user        |
| POST   | `/auth/login`          | User login                 |
| GET    | `/auth/me`             | Fetch current user profile |
| PATCH  | `/auth/update-profile` | Update user profile        |

### User (Admin Only)

| Method | Endpoint          | Description      |
| ------ | ----------------- | ---------------- |
| GET    | `/users`          | Fetch all users  |
| PATCH  | `/users/:id/role` | Update user role |

### Content

| Method | Endpoint       | Description                           |
| ------ | -------------- | ------------------------------------- |
| POST   | `/content`     | Submit content (frame/dialogue)       |
| DELETE | `/content/:id` | Delete own content                    |
| GET    | `/content`     | Get admin/monitor's submitted content |

### Game (Single Player)

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| GET    | `/game/fetch-single-player`         | Fetch random questions |
| POST   | `/game/submit-single-player/submit` | Submit answer          |

### Room (Multiplayer Testing)

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/room/create`     | Create a room          |
| POST   | `/room/join`       | Join an existing room  |
| POST   | `/room/start-game` | Start multiplayer game |

---

## 🔌 Socket.IO Events (Multiplayer Realtime)

### Events

| Event Name    | Payload        | Description                  |
| ------------- | -------------- | ---------------------------- |
| `create-room` | `{ roomCode }` | Create a new game room       |
| `join-room`   | `{ roomCode }` | Join an existing room        |
| `rejoin-room` | `{ roomCode }` | Gracefully rejoin after drop |
| `start-game`  | `void`         | Leader starts the game       |

### Socket Features

- Automatic reconnection support (via `localStorage`)
- 10-second timeout before user is removed after disconnect
- Room-wide `room-update` events with player list and changes

---

## 🛠️ Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/guess-movie-game-backend.git
cd guess-movie-game-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Update your MongoDB URI, JWT secret, etc.

# 4. Start the dev server
npm run dev
```

---

## 📫 API Testing

Use Postman collection:  
✔️ [Guess Movie Game Postman Collection](#)  
_(Add your link to exported `.json` file if needed)_

---

## ✅ Upcoming Features

- Multiplayer game rounds & scoring
- Timer support
- Leaderboard
- Hints and lifelines
- Reporting system
- Admin dashboard
- Player achievements

---

## 🧑‍💻 Author

Made with ❤️ by Your Name

---

## 📄 License

MIT License
