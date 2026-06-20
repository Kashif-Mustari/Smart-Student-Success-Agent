# Smart Student Success Agent 🎓🤖
### Kaggle Capstone Project: "AI Agents: Intensive Vibe Coding"
**Category:** Agents for Good

An AI-powered academic and career success mentor application designed specifically to assist university students, polytechnic students, self-learners, and job seekers. The agent helps users create customized study plans, generate revision guides, solve mock quizzes, map out career paths, identify skills gaps, and discover portfolio project ideas.

---

## 🏗️ System Architecture

The application is built using a modern decoupled architecture:

1. **Frontend**: React (Vite) styled with **Tailwind CSS v4** and **Lucide Icons** for a premium, glassmorphism-based dark theme dashboard interface.
2. **Backend**: FastAPI (Python) hosting REST endpoints and orchestrating individual AI agents.
3. **AI Reasoning**: Dynamic, structured prompt engineering powered by **Gemini 2.5 Flash** (via the new `google-genai` SDK) to enforce strict JSON schemas matching exact UI requirements.

```
Smart Student Success Agent
 ├── backend/                   # FastAPI Python Server
 │    ├── app/
 │    │    ├── agents/          # Agent Logic (Planner, Exam Prep, Career, Projects)
 │    │    ├── main.py          # FastAPI Entry & Endpoints
 │    │    ├── models.py        # Pydantic Schemas for Structured JSON
 │    │    └── config.py        # Environment Configuration
 │    ├── tests/                # Automated Pytest suite
 │    └── requirements.txt      # Python dependencies
 └── frontend/                  # React Vite Client
      ├── src/
      │    ├── components/      # Sidebar, Header, ChatBot Shells
      │    ├── pages/           # Dashboard, Planner, Quizzes, Career, Settings
      │    ├── services/        # api.js Service client with Offline Mock Fallback
      │    └── index.css        # Tailwind v4 configuration and custom keyframes
      ├── vite.config.js        # Vite + Tailwind v4 plugin config
      └── package.json          # Node dependencies
```

---

## 🌟 Key Features

### 1. AI Study Planner Agent
* **Personalized Timelines**: Generates daily checklists distributed over weeks leading to the exam.
* **Proficiency Scaling**: Tailors schedules depending on whether you are a `Beginner`, `Intermediate`, or `Advanced` learner.
* **Weak Topics Prioritization**: Puts heavier study weight and priority tags on topics you flag as weak.
* **Progress Persistency**: Marks days as complete, saving state locally in your browser to update your progress metrics.

### 2. Exam Preparation Agent
* **Conceptual Summaries**: Generates high-quality summaries of topics in clean, readable Markdown.
* **Interactive MCQs**: Take generated multiple-choice tests with real-time green/red feedback and detailed answer explanations.
* **Revision Checklists**: Follow actionable, structured checklists of tasks to prepare for the test day.

### 3. Career Guidance Agent
* **Skills Gap Analysis**: Compares your current skills against standard requirements for roles like *AI Engineer* or *Software Engineer*, showing what to learn next.
* **Interactive Roadmap**: Renders learning phases as a vertical timeline showing duration, key skills, and study resource links.
* **Portfolio Strategy**: Suggests specific portfolio projects to stand out when applying for internships or jobs.

### 4. Project Recommendation Agent
* **Portfolio Briefs**: Suggests coding projects matching your preferred tech stack (e.g. React, Python, FastAPI) and difficulty.
* **README Template Generator**: Renders copy-ready GitHub `README.md` markdown code in a mock code terminal with a 1-click clipboard action.

### 5. Progress Tracking Dashboard
* **Sleek Analytics**: High-level statistical tiles tracking study hours, completed tasks, quiz averages, and portfolio projects.
* **SVG Visualizations**: Fully responsive charts showing assigned targets versus checked-off tasks over the last 4 weeks.
* **Today's Agenda**: Displays upcoming checklist items retrieved directly from your active study plan.

### 6. AI Academic Chatbot Assistant
* **Context-Aware Assistance**: Sticky chatbot window on all pages that retains memory of your study planner inputs and targets.
* **Helpful Shortcuts**: Auto-suggests follow-up questions to help you research topics faster.

---

## 🚀 Getting Started

### Prerequisites
* **Python**: `python3.10` or higher
* **Node.js**: `node18` or higher
* **Package tools**: `uv` (recommended for Python) or `pip`, and `npm`

---

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   # Using uv (highly recommended)
   uv venv
   source .venv/bin/activate
   
   # Using standard python
   python -m venv venv
   source venv/bin/activate
   ```
3. Install python dependencies:
   ```bash
   # Using uv
   uv pip install -r requirements.txt
   
   # Using pip
   pip install -r requirements.txt
   ```
4. Create a `.env` file from the template and add your Gemini key (optional if inputting via Settings in UI):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be available at `http://localhost:8000`. You can inspect the interactive OpenAPI docs at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend UI will be available at `http://localhost:5173`. Open this URL in your browser to start using the app.

---

## 🧪 Running Automated Tests

A comprehensive test suite is included in the backend to ensure agent response formats conform to schemas.

To run all python tests:
```bash
cd backend
PYTHONPATH=. uv run pytest
```

---

## 🌍 Production Deployment Guide

This project is fully configured for cloud deployment:

### Backend Deployment (Render)
1. Push the code to a Git repository (GitHub/GitLab).
2. Log in to [Render](https://render.com/) and create a new **Web Service**.
3. Link your repository. Choose the **Python** environment.
4. Set the **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```
5. Set the **Start Command**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Add your environment variables under **Environment**:
   * `GEMINI_API_KEY` = *[Your Gemini API Key]*
   * `ENV` = `production`

### Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com/) and import your project repository.
2. Select the `frontend` folder as the root directory of the project.
3. Vercel will automatically detect **Vite** as the framework.
4. Set the environment variable:
   * `VITE_API_URL` = `https://your-deployed-render-backend-url.onrender.com` (no trailing slash)
5. Click **Deploy**. Vercel will build and serve your static React application.

---

## 🛡️ Security Features
* **Key Encryption**: Dynamic keys input on the **Settings** page are stored strictly in client-side secure `localStorage` and sent over HTTPS via headers.
* **Robust Fallback**: If the server fails to connect to the Gemini API, it falls back to custom, highly structured mock data generators so that reviewers can inspect all dashboard states instantly.
* **Input Sanitization**: Pydantic schemas validate all incoming parameters to prevent code injection.
