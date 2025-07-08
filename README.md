# 🏋️ Exercise Tracker API

This is a modular, layered REST API for tracking users and their workout exercises. Built with **TypeScript** and **Express**, it follows principles of **Clean Architecture** and **Domain-Driven Design**. The project is designed for extensibility, testability, and maintainability, and demonstrates patterns suitable for microservices.

---

## ✨ Features

- **Create Users:** Register new users with unique usernames.
- **Log Exercises:** Users can log exercises with descriptions, durations, and optional dates.
- **Get Exercise Logs:** Retrieve a user's exercise log with all entries, supporting filters.
- **Clean/Hexagonal Architecture:** Clear separation between domain, application, and infrastructure layers.
- **Repository Pattern:** Easily switch between different data sources (SQLite, MongoDB, etc.).
- **Comprehensive Testing:** Includes unit and integration tests with Jest and Supertest.
- **Error Handling:** Consistent, JSON-formatted error responses.

---

## 📁 Project Structure

```
├── dist/                  # Compiled JS output
├── node_modules/          # Dependencies
├── src/
│   ├── application/       # Use cases and interfaces
│   │   ├── repositories/
│   │   └── useCases/
│   ├── config/            # Dependency injection and app config
│   ├── domain/            # Core business logic (Entities, Value Objects)
│   ├── infrastructure/    # External concerns (DB, Web)
│   │   ├── database/
│   │   ├── repositories/
│   │   └── web/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── presenters/
│   │       └── routes/
│   └── utils/             # Shared utilities
├── __tests__/             # Jest/Supertest test suites
├── sqliteDb/              # SQLite database and schema
├── tsconfig.json
├── package.json
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/irene-fabbri/exercise-tracker.git
cd exercise-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Or build and run:

```bash
npm run build
npm start
```

### 4. Run Tests

```bash
npm test
```

---

## 🔌 REST API Endpoints

**Base URL:** `/api`

### 👤 Users

#### `GET /api/users`

Get a list of all users.

**Response:**

```json
[
  {
    "_id": "ab12cd34...",
    "username": "johndoe"
  }
]
```

#### `POST /api/users`

Create a new user.

**Request Body:**

```json
{
  "username": "johndoe"
}
```

**Response:**

```json
{
  "_id": "ab12cd34...",
  "username": "johndoe"
}
```

---

### 🏃 Exercises

#### `POST /api/users/:id/exercises`

Log a new exercise for a user.

**Request Body:**

```json
{
  "description": "Running",
  "duration": 30,
  "date": "2025-06-11" // Optional, defaults to today
}
```

**Response:**

```json
{
  "_id": "ab12cd34...",
  "username": "johndoe",
  "description": "Running",
  "duration": 30,
  "date": "Wed Jun 11 2025"
}
```

#### `GET /api/users/:id/logs`

Get exercise logs for a user.

**Response:**

```json
{
  "_id": "ab12cd34...",
  "username": "johndoe",
  "count": 2,
  "log": [
    {
      "description": "Running",
      "duration": 30,
      "date": "Wed Jun 11 2025"
    },
    {
      "description": "Swimming",
      "duration": 45,
      "date": "Tue Jun 10 2025"
    }
  ]
}
```

---

## ⚠️ Error Handling

Errors are returned with appropriate status codes and JSON format.

**Example:**

```json
{
  "error": "ValidationError",
  "message": "Missing body or username attribute",
  "details": "need a non-empty json body with a username property"
}
```

**Common errors:**

- `400 Bad Request` — Invalid input
- `404 Not Found` — User or route does not exist
- `500 Internal Server Error` — Unexpected server error

---

## 🧠 Design Principles

- **Domain-Driven Design (DDD)**
- **Clean/Hexagonal Architecture**
- **Separation of Concerns** between domain, application, infrastructure, and interface layers
- **Repository Pattern** for data access abstraction
- **Testability** with isolated unit and integration tests

---

## 📄 License

This project is licensed under the **MIT License**.

---
