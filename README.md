# 📋 TaskFlow — MERN Project Management & Task Tracking System

A full-stack project management and task tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js). TaskFlow allows Admins to create projects, assign tasks to team members, and track progress in real time.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Live Demo

- **Frontend:** [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API:** [https://your-api.onrender.com](https://your-api.onrender.com)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure Register & Login
- 👥 **Role-Based Access** — Admin and Team Member roles
- 📁 **Project Management** — Create, update, and delete projects
- ✅ **Task Management** — Create, assign, and track tasks
- 📅 **Deadlines** — Set and monitor task due dates
- 📊 **Dashboard** — Visual overview of projects and tasks
- 📈 **Progress Tracking** — Real-time task status updates
- 🎨 **Responsive UI** — Clean, modern interface

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Normal CSS

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs

**Deployment:**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📂 Project Structure

## 📂 Project Structure

```
mern-task-manager/
├── backend/
│   ├── config/         # Database connection
│   ├── models/         # Mongoose schemas (User, Project, Task)
│   ├── routes/         # API routes (auth, projects, tasks)
│   ├── middleware/     # JWT auth middleware
│   └── server.js       # Entry point
│
└── frontend/
|    ├── src/
|    │   ├── components/ # Sidebar, Navbar, Layout
|    │   ├── pages/       # Login, Register, Dashboard, Projects, Tasks
|    │   ├── context/     # Auth context
|    │   └── utils/       # Axios instance
|    └── index.html
|___ README.md
```

---

## ⚙️ Installation & Setup (Local Development)

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/mern-task-manager.git
cd mern-task-manager
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file inside \`backend/\`:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
\`\`\`

Run the backend:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../frontend
npm install
npm run dev
\`\`\`

The app will be running at:
- Frontend → \`http://localhost:5173\`
- Backend → \`http://localhost:5000\`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/auth/register\` | Register a new user |
| POST | \`/api/auth/login\` | Login user |
| GET | \`/api/auth/profile\` | Get logged-in user (Protected) |
| GET | \`/api/auth/users\` | Get all users (Admin only) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/projects\` | Create project (Admin only) |
| GET | \`/api/projects\` | Get all projects |
| GET | \`/api/projects/:id\` | Get single project |
| PUT | \`/api/projects/:id\` | Update project (Admin only) |
| DELETE | \`/api/projects/:id\` | Delete project (Admin only) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/tasks\` | Create task (Admin only) |
| GET | \`/api/tasks\` | Get all tasks |
| GET | \`/api/tasks/:id\` | Get single task |
| PUT | \`/api/tasks/:id\` | Update task (Admin only) |
| PUT | \`/api/tasks/:id/status\` | Update task status |
| PUT | \`/api/tasks/:id/checklist\` | Update task checklist |
| DELETE | \`/api/tasks/:id\` | Delete task (Admin only) |

---

## 👤 Author

Built as a learning project to master the MERN stack.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
