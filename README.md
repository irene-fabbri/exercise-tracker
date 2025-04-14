# Exercise Tracker API

## Description

The **Exercise Tracker API** is a RESTful API that allows users to track their exercises. It provides endpoints to create new users, log exercises, and retrieve exercise logs for specific users. The application uses **SQLite** for persistent storage and is built using **Node.js** and **Express**.

### Features:
- **Create Users**: Allows users to create accounts.
- **Log Exercises**: Users can log exercises with descriptions, durations, and optional dates.
- **Get Exercise Logs**: Retrieve a user's exercise log with all entries.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Technologies Used](#technologies-used)
5. [License](#license)

---

## Installation

### Prerequisites

To run the project, ensure you have **Node.js** and **npm** installed. You can download Node.js from [here](https://nodejs.org/).

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/irene-fabbri/exercise-tracker.git
   cd exercise-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   The `schema.sql` file in the `/config` directory contains the SQL statements to create the required database schema. Run it manually or the app will create the necessary tables when it first runs.

4. Start the server:
   ```bash
   npm start
   ```

   The app will start and listen on `http://localhost:5000`.

---

## Usage

Once the server is running, you can interact with the API by sending HTTP requests to the following endpoints. 
---

## API Endpoints

### 1. Create a User

- **Endpoint**: `POST /api/users`
- **Request Body**:
    ```json
    {
      "username": "john_doe"
    }
    ```
- **Response**:
    ```json
    {
      "_id": "some_unique_id",
      "username": "john_doe"
    }
    ```

### 2. Get All Users

- **Endpoint**: `GET /api/users`
- **Response**:
    ```json
    {
      "users": [
        {
          "_id": "some_unique_id",
          "username": "john_doe"
        }
      ]
    }
    ```

### 3. Log an Exercise for a User

- **Endpoint**: `POST /api/users/:id/exercises`
- **Request Body**:
    ```json
    {
      "description": "Running",
      "duration": 30,
      "date": "2025-04-14"
    }
    ```
- **Response**:
    ```json
    {
      "_id": "some_unique_id",
      "username": "john_doe",
      "description": "Running",
      "duration": 30,
      "date": "Mon Apr 14 2025"
    }
    ```

### 4. Get Exercise Logs for a User

- **Endpoint**: `GET /api/users/:id/logs`
- **Response**:
    ```json
    {
      "_id": "some_unique_id",
      "username": "john_doe",
      "count": 1,
      "log": [
        {
          "description": "Running",
          "duration": 30,
          "date": "Mon Apr 14 2025"
        }
      ]
    }
    ```

---

## Technologies Used

- **Node.js**: JavaScript runtime used to build the backend.
- **Express**: Web framework for building the API.
- **SQLite**: Database engine for storing user and exercise data.
- **JS-md5**: Hashing library for generating unique user IDs.
- **Joi**: Validation library used for input validation (in `createUserSchema` and `createExerciseSchema`).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Folder Structure

Here’s an overview of the folder structure:

```
/exercise-tracker 
├── server.js              # Entry point for the app, starts the Express server
├── app.js                 # Configures middleware, routes, and error handling
├── config/
│   └── connect.js         # SQLite database connection setup
│   └── schema.sql         # SQL schema to set up the database tables
├── models/
│   ├── Users.js           # Contains SQL queries related to users
│   └── Exercises.js       # Contains SQL queries related to exercises
├── controllers/
│   ├── userController.js  # Handles user-related routes
│   └── exerciseController.js  # Handles exercise-related routes
├── routes/
│   └── api.js             # API route definitions
├── utils/
│   └── createError.js     # Custom error creator for throwing errors
├── middleware/
│   └── errorHandler.js    # Global error handler for the app
├── utils/
│   └── validators.js      # Validation schema definitions (using Joi)
```

---