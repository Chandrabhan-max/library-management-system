# 📚 Library Management System — Backend

This is the backend service for the **Library Management System**, built using **NestJS**.  
It provides REST APIs for managing users, books, borrowing rules, and administrative operations.

---

## ✨ Features

- User management
- Book and inventory management
- Borrowing & return logic
- Role-based access control (Admin / User)
- Borrowing history tracking
- Policy enforcement (limits, duration, fines)

---

## 🛠️ Tech Stack

**Backend**
- NestJS
- Node.js
- TypeScript

**Database**
- Local database (development)
- ORM / Query Builder (as configured)

---

## 📁 Project Structure (Backend)

```text
backend/
├── src/
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── books/             # Books & inventory
│   ├── borrow/            # Borrowing logic
│   ├── admin/             # Admin operations
│   ├── common/            # Shared utilities
│   ├── main.ts
│   └── app.module.ts
├── test/
├── package.json
├── tsconfig.json
└── .gitignore
