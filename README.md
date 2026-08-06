# AI Mock Interview Platform 🚀

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready Full Stack AI Mock Interview Platform that allows users to practice coding and technical interviews with an AI assistant. The platform uses Gemini AI for intelligent feedback and Judge0 for real-time code execution.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- **AI Mock Interviews**: Chat-based technical interviews powered by Gemini AI.
- **Coding Simulator**: Real-time code execution environment using Judge0.
- **Question Bank**: Explore and practice hundreds of software engineering questions.
- **Admin Dashboard**: Dedicated dashboard for admins to manage questions and users.
- **Role-Based Access Control (RBAC)**: Distinct User and Admin roles.
- **Modern UI**: Fully responsive, accessible, and beautiful UI built with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19) - UI Library
- **Redux Toolkit** - State Management
- **Tailwind CSS** (v4) - Styling
- **Vite** - Build Tool
- **Lucide React** - Icons
- **Recharts** - Analytics Dashboards

### Backend
- **Node.js** & **Express.js** - Server
- **MongoDB** & **Mongoose** - Database
- **JWT** & **Bcrypt.js** - Authentication
- **Helmet** & **Express Rate Limit** - Security
- **Gemini API** - AI Integration
- **Judge0 API** - Code Execution

## 🏗️ Architecture & Folder Structure

```
.
├── client/                 # Frontend React Application (Vite)
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Auth, Dashboard, Interview, etc.)
│   │   ├── store/          # Redux slices and store configuration
│   │   └── utils/          # Helper functions and API configuration
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend Node.js Application
│   ├── controllers/        # Route controllers (Logic)
│   ├── middleware/         # Custom Express middlewares (Auth, Error Handling)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API routes
│   ├── utils/              # Helper functions (LLM integration)
│   ├── server.js           # Entry point
│   └── package.json        # Backend dependencies
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ai-mock-interview-platform.git
   cd ai-mock-interview-platform
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

You need to set up environment variables for both the client and server.

**Server (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/interview-platform
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-3.5-flash
ADMIN_SEED_PASSWORD=SecureAdminPassword123!
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Running Locally

1. **Start the Backend Server:**
   ```bash
   cd server
   npm run dev
   # Or simply: node server.js
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open the application:**
   Navigate to `http://localhost:5173` in your browser.

### Seeding Initial Data

To seed the database with an initial admin user and sample questions:
```bash
cd server
node seedAdmin.js
node seedQuestions.js
```

## 🌐 Deployment Instructions

### Deploying the Frontend (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Select your repository.
4. Set the **Framework Preset** to `Vite`.
5. Add the Environment Variable: `VITE_API_URL` (pointing to your production backend URL).
6. Click **Deploy**.

### Deploying the Backend (Render / Railway)

1. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `server`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `node server.js`.
6. Add all environment variables from your `server/.env` file.
7. Deploy the service.

## 📸 Screenshots

*(Replace these placeholders with actual screenshots of your application)*

| Dashboard | Coding Simulator |
|-----------|------------------|
| ![Dashboard](#) | ![Simulator](#) |

| Interview Session | Admin Panel |
|-------------------|-------------|
| ![Interview](#) | ![Admin](#) |

## 🔮 Future Enhancements

- **WebSockets Integration:** For real-time collaboration during interviews.
- **OAuth Integration:** Sign in with Google, GitHub, or LinkedIn.
- **Advanced Analytics:** Detailed charts showing performance over time.
- **Voice Interviews:** Speech-to-text integration for a more realistic interview experience.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
