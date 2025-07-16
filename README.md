
# 🎟️ Event Management REST API

This is a RESTful API built with **Node.js**, **Express.js**, and **PostgreSQL** to manage events and user registrations. It supports full event lifecycle handling including user registration, capacity constraints, event filtering, and stats.

---

## 📦 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- dotenv
- moment.js

#screenshot #
![Live Demo Screenshot](https://github.com/SurajZagare/event-management-api/blob/b24025ae02980c1b34f1cab402b2c75a35db481c/Screenshot%202025-07-16%20150623.png)
>
---

## 🚀 Setup Instructions

1. **Clone the repository**
bash
git clone https://github.com/YOUR_USERNAME/event-management-api.git
cd event-management-api

## 📘 API Description

This REST API provides endpoints for managing events and user registrations. It supports:

* 📅 Event creation with title, date/time, location, and limited capacity
* 🙋‍♂️ User registration for events
* 🔁 Cancellation of registrations
* 📄 Fetching event details with list of registered users
* 📈 Viewing statistics for any event
* 🧾 Listing only **upcoming events** sorted by date and location

### 🧠 Core Entities

#### 🟡 `Event`

| Field       | Type      | Description                                     |
| ----------- | --------- | ----------------------------------------------- |
| `id`        | Integer   | Auto-generated unique identifier                |
| `title`     | String    | Title or name of the event                      |
| `date_time` | Timestamp | Scheduled date and time (ISO 8601 format)       |
| `location`  | String    | Physical location of the event                  |
| `capacity`  | Integer   | Maximum number of allowed registrations (≤1000) |

---

#### 🟢 `User`

| Field   | Type    | Description             |
| ------- | ------- | ----------------------- |
| `id`    | Integer | Auto-generated user ID  |
| `name`  | String  | User's full name        |
| `email` | String  | Must be unique per user |

---

#### 🔵 `Registration`

A many-to-many relationship between users and events. One user can register for multiple events, and one event can have multiple users.

---

### ✅ Business Logic Implemented

| Rule                  | Description                                             |
| --------------------- | ------------------------------------------------------- |
| ✅ Unique registration | A user cannot register twice for the same event         |
| ✅ Future events only  | No registration allowed for past events                 |
| ✅ Capacity limit      | Events cannot exceed their set capacity                 |
| ✅ Clean cancellations | Unregistering from events only if previously registered |
| ✅ Accurate stats      | Tracks current registration status for each event       |
| ✅ Proper validation   | Enforces required fields, formats, and limits           |
| ✅ Sorting             | Upcoming events are sorted by date and then location    |

Here are **realistic and cleanly formatted Example Requests and Responses** you can include in your `README.md` under the heading **Example Requests/Responses**.

---

## 📦 Example Requests & Responses

These examples show how to interact with the API using common tools like Postman, curl, or your frontend.

---

### ✅ 1. Create Event

**POST** `/api/events`

**Request Body:**

```json
{
  "title": "AI Summit",
  "date_time": "2025-08-20T10:30:00",
  "location": "Main Auditorium",
  "capacity": 300
}
```

**Response:**

```json
{
  "event_id": 1
}
```

---

### ✅ 2. Register User for Event

**POST** `/api/events/1/register`

**Request Body:**

```json
{
  "user_id": 2
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

**Error (already registered):**

```json
{
  "error": "User already registered"
}
```

**Error (event full):**

```json
{
  "error": "Event is full"
}
```

**Error (past event):**

```json
{
  "error": "Cannot register for past event"
}
```

---


### ✅ 6. Event Statistics

**GET** `/api/events/1/stats`

**Response:**

```json
{
  "total_registrations": 1,
  "remaining_capacity": 299,
  "percent_full": "0.33%"
}
```


