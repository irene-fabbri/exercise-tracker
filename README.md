# 🏋️ Exercise Tracker API

This is a modular, layered REST API for tracking users and their workout exercises. It is built with **TypeScript** and **Express**, and follows principles of Clean Architecture and Domain-Driven Design.

### Features:

- **Create Users**: Allows users to create accounts.
- **Log Exercises**: Users can log exercises with descriptions, durations, and optional dates.
- **Get Exercise Logs**: Retrieve a user's exercise log with all entries.

---

## 📁 Project Structure

```
├── dist/                  # Compiled JS output
├── node_modules/          # Dependencies
├── src/
│   ├── application/       # Use cases and interfaces
│   │   ├── repositories/
│   │   └── useCases/
│   ├── config/            # Dependency injection
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
├── tsconfig.json
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-directory>
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
- **Clean Architecture**
- **Separation of Concerns** between domain, application, infrastructure, and interface layers

---

## 📄 License

This project is licensed under the **MIT License**.
