# 🚀 AI Learning Platform

An AI-powered personalized learning platform that generates customized learning roadmaps, adaptive assessments, and progress tracking using Large Language Models (LLMs).

Built with **FastAPI**, **PostgreSQL**, **SQLAlchemy**, **JWT Authentication**, and **Ollama (Llama 3)**, the platform enables learners to receive structured learning plans tailored to their goals, experience level, and available study time.

---

## 📌 Overview

Traditional learning platforms offer static content that may not align with individual learning objectives. This platform leverages Generative AI to dynamically create personalized learning journeys, helping users learn more efficiently and track their progress throughout the process.

### Key Capabilities

* Personalized Learning Roadmaps
* AI-Generated Topic & Subtopic Structure
* Dynamic Quiz Generation
* Learning Progress Analytics
* Secure User Authentication
* Adaptive Learning Experience

---

## ✨ Features

### 🔐 Authentication & Authorization

* User Registration & Login
* JWT-Based Authentication
* Password Hashing with Bcrypt
* Protected API Endpoints
* User-Specific Learning Data

### 🤖 AI-Powered Learning Path Generation

Generate customized learning plans based on:

* Learning Goal (Python, AI, Data Science, ML, etc.)
* Experience Level (Beginner, Intermediate, Advanced)
* Study Hours Per Day
* Learning Duration
* Start Date

The platform uses **Llama 3 via Ollama** to generate structured and goal-oriented learning roadmaps.

---

### 📚 Intelligent Learning Structure

Each generated roadmap contains:

* Learning Plans
* Topics
* Subtopics
* Weekly Learning Schedule
* Structured Learning Timeline

Example Learning Flow:

```text
Python Programming
│
├── Basics
│   ├── Variables
│   ├── Data Types
│   └── Operators
│
├── Functions
│
├── Object-Oriented Programming
│
└── Real-World Projects
```

### 📝 AI-Generated Assessments

The platform automatically creates assessments using LLMs.

#### Subtopic Quiz

* 5 Multiple Choice Questions
* Concept Validation
* Instant Evaluation

#### Topic Quiz

* 10 Multiple Choice Questions
* Comprehensive Assessment
* Performance Tracking

---

### 📊 Progress Tracking & Analytics

Track learner performance through:

* Learning Progress
* Completed Topics
* Quiz Scores
* Assessment History
* Learning Performance Metrics

---

## 🏗️ System Architecture

```text
Frontend
   │
   ▼
FastAPI Backend
   │
   ├── Authentication Service
   ├── Learning Path Engine
   ├── Quiz Engine
   ├── Tracking Service
   │
   ▼
Ollama (Llama 3)
   │
   ▼
PostgreSQL Database
```

---

## 🛠️ Technology Stack

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* Uvicorn

### Database

* PostgreSQL
* AsyncPG
* Psycopg2

### AI & Generative AI

* Ollama
* Llama 3
* Transformers
* PyTorch
* Accelerate

### Security

* JWT Authentication
* Passlib
* Bcrypt
* Python-JOSE

### DevOps & Deployment

* Docker
* Docker Compose

---

## 📂 Project Structure

```text
ai-learning-platform/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── llm/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Prajaktah23/ai-learning-platform.git
cd ai-learning-platform
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Configure PostgreSQL

Create a database:

```sql
CREATE DATABASE ai_learning_platform;
```

Update database configurations inside:

```text
app/config.py
```

### 5️⃣ Install Ollama & Llama 3

Install Ollama and pull the model:

```bash
ollama pull llama3
```

Verify installation:

```bash
ollama run llama3
```

### 6️⃣ Run the Application

```bash
uvicorn app.main:app --reload
```

Application URL:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |
| POST   | /auth/logout   |

### Learning Path

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /generate-learning-path |

Parameters:

* goal
* level
* hours_per_day
* duration_weeks
* start_date

### Quiz

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | /quiz/{quiz_id}         |
| POST   | /quiz/{quiz_id}/submit  |
| GET    | /quiz/dashboard/{email} |

---

## 🔒 Security Features

* JWT Token Authentication
* Password Hashing with Bcrypt
* Protected APIs
* User Ownership Validation
* Secure Database Access

---

## 🚀 Future Enhancements

* AI Mentor Chatbot
* RAG-Based Learning Assistant
* Adaptive Difficulty Quizzes
* Learning Recommendation Engine
* Gamification & Leaderboards
* Interactive Dashboard
* Video Course Integration
* Multi-LLM Support (GPT, Gemini, Claude, Llama)

---

## 🎯 Use Cases

* Personalized Skill Development
* Corporate Training Programs
* University Learning Platforms
* Coding Bootcamps
* Employee Upskilling
* AI-Powered EdTech Solutions

---

## 👨‍💻 Author

**Prajakta Hake**

Associate Software Engineer | AI & Generative AI Developer

### Skills

* Python
* FastAPI
* Generative AI
* LLMs
* LangChain
* LangGraph
* PostgreSQL
* Docker
* Machine Learning
* Deep Learning

---

## 📜 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star and contributing to its future development.
