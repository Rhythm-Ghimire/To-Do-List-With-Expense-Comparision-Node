# TravelTrack

A full-stack web app for planning trips. Create travel tasks, record the **expected** and **actual** cost of each one, tick tasks off as they are done, and compare spending on a chart. Each user has a private account.

**Tech stack:** Node.js, Express, MongoDB (Mongoose), JWT authentication, bcrypt, Chart.js, HTML/CSS/JavaScript

## Features

- Sign up and log in with email and password. Passwords are hashed with bcrypt.
- Stateless authentication with JSON Web Tokens (30-day expiry). All plan and profile routes are protected.
- Create, edit, delete, and mark-as-done travel tasks.
- Track expected vs. actual expenses per task.
- Expense comparison graph built with Chart.js.
- User profile (username, address, phone).
- Each user only sees their own data.

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a token |
| GET | `/api/plan/getAllPlans` | List the user's tasks |
| POST | `/api/plan/save` | Create a task |
| PUT | `/api/plan/updatePlan/:id` | Update a task |
| PUT | `/api/plan/toggleDone/:id` | Toggle a task's done status |
| DELETE | `/api/plan/deletePlan/:id` | Delete a task |
| POST | `/api/profile/saveProfile` | Save the user's profile |
| GET | `/api/profile/getProfile` | Get the user's profile |

Protected routes expect an `Authorization: Bearer <token>` header.

## Project structure

```
server.js                 Express app and page routes
back-end/
├── config/database.js    MongoDB connection
├── middleware/           authMiddleware.js (JWT check)
├── models/               User, Plan, Profile (Mongoose schemas)
└── routes/               auth.js, plan.js, profile.js
public/                   Front-end CSS and JavaScript
views/                    HTML pages (signup, login, index, to-do list,
                          create plan, graphs)
```

## Getting started

**Prerequisites:** Node.js 18+ and a MongoDB database (local, or a free MongoDB Atlas cluster).

```bash
git clone https://github.com/Rhythm-Ghimire/To-Do-List-With-Expense-Comparision-Node.git
cd To-Do-List-With-Expense-Comparision-Node
npm install
```

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/traveltrack
JWT_SECRET=replace-with-a-long-random-string
PORT=3000
```

Start the server:

```bash
npm start
```

Open http://localhost:3000, sign up, and start adding tasks.

## Possible improvements

- Add input validation and rate limiting on the auth routes.
- Add automated tests for the API.
- Add per-trip grouping and currency support.

## Author

**Rhythm Kashyap Ghimire**
[GitHub](https://github.com/Rhythm-Ghimire) · [LinkedIn](https://linkedin.com/in/rhythm-ghimire-6934452a7)
