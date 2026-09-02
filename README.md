# Notes Galore

A full-stack note-taking application built with React and Express. Users can register, log in, and create, organize, and manage rich-text notes through a personal dashboard.

## Features

- **User Authentication** — secure registration and login using JWT-based sessions
- **Rich Text Editor** — notes support formatted text (bold, italic, allign, etc.) through the TipTap editor
- **Dashboard** — view all notes with search, sorting (latest, oldest, favorites), and color tagging
- **Favorites** — mark notes as favorites for quick access
- **Landing Page** — introduces the app to new visitors before they sign up
- **Responsive Design** — built with Tailwind CSS

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- TipTap (rich text editor)
- Vitest (testing)

**Backend**
- Node.js / Express
- MySQL (via `mysql2`)
- JSON Web Tokens (JWT) for authentication
- Pino (logging)
- Mocha / Chai / Supertest (testing)

**Code Quality**
- SonarQube (local static analysis)

## Code Quality

This project is analyzed locally using SonarQube Community Edition. Results from the scan:

| Metric | Result |
|---|---|
| Quality Gate | Passed |
| Security | A |
| Reliability | A |
| Maintainability | A |

Screenshots of the full report are in the `SonarCubeReport` folder.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MySQL Server
- npm

### Installation

Clone the repository and install dependencies for both apps:

```bash
git clone <repository-url>
cd cohort-9-mern-9077-haris

cd frontend
npm install

cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory. Adjust these keys to match your actual configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notes_app
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

If the frontend needs its own environment file, create one in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npx vitest run
```

## Project Structure

```text
cohort-9-mern-9077-haris/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
├── SonarCubeReport/
└── sonar-project.properties
```