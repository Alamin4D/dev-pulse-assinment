# DevPulse – Internal Tech Issue Tracker

DevPulse is a backend API system for software teams to report bugs, suggest features, and manage issues efficiently with role-based access control.

---

## 🚀 Live URL
https://dev-pulse-assinment.vercel.app/

---

## 📌 Features

- User registration & login
- JWT-based authentication
- Role-based authorization (contributor, maintainer)
- Create bug/feature issues
- View all issues with filters
- View single issue
- Update issue (role-based rules)
- Delete issue (maintainer only)
- Secure password hashing (bcrypt)
- Raw SQL with PostgreSQL (no ORM)
- Clean modular architecture

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (pg driver)
- JWT (jsonwebtoken)
- bcrypt
- dotenv

---

## 🗄 Database Schema

### Users
- id (PK)
- name
- email (unique)
- password
- role (contributor / maintainer)
- created_at
- updated_at

### Issues
- id (PK)
- title
- description
- type (bug / feature_request)
- status (open / in_progress / resolved)
- reporter_id
- created_at
- updated_at

---

## 🔐 Authentication Flow

1. User signs up
2. Password is hashed using bcrypt
3. User logs in
4. Server returns JWT token
5. Token used in Authorization header

---

## 📡 API Endpoints

### Auth

- POST /api/auth/signup
- POST /api/auth/login

### Issues

- POST /api/issues
- GET /api/issues
- GET /api/issues/:id
- PATCH /api/issues/:id
- DELETE /api/issues/:id

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/yourusername/devpulse
cd devpulse
npm install