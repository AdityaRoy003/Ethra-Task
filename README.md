# Ethara - Team Task Manager 🚀

Ethara is a premium, full-stack Team Task Manager built with a modern tech stack. It features a cinematic dark-mode UI with smooth animations, real-time analytics, and role-based access control.

## ✨ Key Features
- **Cinematic UI/UX**: Built with React, Tailwind CSS v4, and Framer Motion for high-quality animations and glassmorphism effects.
- **Project Management**: Create projects, manage team members, and track progress via a Kanban-style board.
- **Task Tracking**: Assign tasks, update statuses (Todo, In Progress, Done), and monitor deadlines.
- **Performance Dashboard**: Real-time analytics with AreaCharts and PieCharts to track team efficiency.
- **Authentication & RBAC**: Secure JWT-based authentication with Admin and Member roles.
- **Prisma v7**: Modern database management with PostgreSQL and the latest Prisma features.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Framer Motion, Recharts, React Query, Axios, Lucide React.
- **Backend**: Node.js, Express.js, Prisma v7 (ESM).
- **Database**: PostgreSQL.
- **Deployment**: Railway.

## 📁 Project Structure
```text
Ethara-Task/
├── frontend/             # React + Vite + Tailwind v4
│   ├── src/
│   │   ├── components/   # UI Layout & Reusable components
│   │   ├── context/      # Auth state management
│   │   ├── pages/        # Dashboard, Projects, Tasks, Auth
│   │   └── lib/          # API & Axios configuration
├── backend/              # Node.js + Express + Prisma
│   ├── prisma/           # Database schema & migrations
│   ├── src/
│   │   ├── controllers/  # API Logic
│   │   ├── routes/       # API Endpoints
│   │   ├── middleware/   # JWT & Auth protection
│   │   └── lib/          # Prisma client setup
└── package.json          # Root management
```

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/AdityaRoy003/Ethra-Task.git
cd Ethra-Task
```

### 2. Backend Setup
1.  Navigate to `backend`: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file:
    ```env
    DATABASE_URL="postgresql://postgres:password@localhost:5432/team_task_manager"
    JWT_SECRET="your_secret_key"
    PORT=5000
    ```
4.  Run migrations: `npx prisma migrate dev --name init`
5.  Start dev server: `npm run dev`

### 3. Frontend Setup
1.  Navigate to `frontend`: `cd ../frontend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file:
    ```env
    VITE_API_URL="http://localhost:5000/api"
    ```
4.  Start dev server: `npm run dev`

## 🌐 Deployment (Railway)
This project is configured for seamless deployment on Railway.

1.  **Database**: Provision a PostgreSQL service.
2.  **Backend**: 
    - Set Root Directory to `/backend`.
    - Add `DATABASE_URL`, `JWT_SECRET`, and `PORT` variables.
3.  **Frontend**:
    - Set Root Directory to `/frontend`.
    - Add `VITE_API_URL` (pointing to your live backend).

## 📄 License
This project is licensed under the ISC License.

---
Built with ❤️ by [Aditya Roy](https://github.com/AdityaRoy003)
