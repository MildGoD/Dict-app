# Dict App – Note-Taking for Technical Terms

A web application for creating and organizing technical notes with support for tags and department-based classification. Build a Full Stack using MERN | MongoDB, Express, React JS, Node JS

## 📂 Project Structure

```
Dict-app/
├── backend/              # Node.js + Express backend
├── frontend/dict-app/    # React frontend
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MildGoD/Dict-app.git
cd dict-app
```

---

## Backend Setup (`/backend`)

### Install dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
ACCESS_TOKEN_SECRET=your_secret_key
```

Also ensure `config.json` contains your MongoDB connection string:

```json
{
  "connectionString": "mongodb://localhost:27017/dict-app"
}
```

### Start the Backend Server

```bash
npm start
```

Server will run at `http://localhost:8000`

---

## Frontend Setup (`/frontend/dict-app`)

### Install dependencies

```bash
cd ../frontend/dict-app
npm install
```

### Start the Development Server

```bash
npm run dev
```

React app will run at `http://localhost:5173`

---

## Features

- ✏️ Create, edit, delete notes
- 📌 Pin/unpin notes per user
- 🏷️ Tag department
- 🔍 Real-time search
- 🔐 User authentication

---

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Others**: Axios, Moment.js

---

## Credits

Developed by MildGoD.


