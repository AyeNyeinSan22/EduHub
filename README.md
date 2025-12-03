📘 EduHub – Smart Study Platform

EduHub is a full-stack study companion with:

📝 Notes Management (upload PDF, read, AI summary, annotate)

🧠 AI Study Tutor (Gemini AI)

⏱ Pomodoro Timer

📚 Subjects Overview

🗓 Weekly Schedule

🧵 Study Streak

🔍 Global Search

👤 User Profile System

Built by:

Hazel — Full-Stack Developer

Ken — UI/UX Designer

Kate — Backend Developer

Reighnar — Frontend Developer

🚀 Tech Stack
Frontend

React + Vite

TailwindCSS

Framer Motion

Axios

Backend

Flask (Python)

Flask-JWT-Extended

MySQL

SQLAlchemy

Gemini AI API

📦 1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/eduhub.git
cd eduhub

🖥 2. Frontend Setup

Make sure Node.js is installed (v18+ recommended).

Install dependencies:
cd frontend
npm install

Run frontend:
npm run dev


Frontend will start at:

http://localhost:5173

🔧 3. Backend Setup

Make sure Python is installed (3.10+ recommended).

Create virtual environment:
cd backend
python -m venv venv

Activate virtual environment:

Windows

venv\Scripts\activate


Mac/Linux

source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

🗄 4. Database Setup (MySQL)

You must install MySQL Server first.

Then open your MySQL client and run:

CREATE DATABASE eduhub_db;

Update your backend .env:

Create a file:

backend/.env


Add:

DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost/eduhub_db
JWT_SECRET_KEY=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
UPLOAD_FOLDER=uploads
AVATAR_FOLDER=uploads/avatars

🔑 5. Generate JWT_SECRET_KEY

Your friend must NOT reuse your JWT secret.

Tell them to generate a new random secret by running:

python -c "import secrets; print(secrets.token_hex(32))"


Then copy the output into .env as:

JWT_SECRET_KEY=THE_GENERATED_KEY_HERE


This is enough — Flask automatically uses this secret to generate JWT tokens.

🤖 6. Gemini API Key

Your friend must create their own Gemini API key:
https://ai.google.dev

And paste into .env:

GEMINI_API_KEY=their_own_key_here

🔧 7. Initialize the Database Tables

Run inside backend folder (with venv active):

python

from backend.extensions import db
from backend.app import create_app

app = create_app()
with app.app_context():
    db.create_all()


This will create tables inside eduhub_db.

▶ 8. Run Backend
cd backend
flask run


Backend will start at:

http://127.0.0.1:5000

🏃 9. Run the Whole Project

Two terminals required:

Terminal 1 – Backend
cd backend
venv\Scripts\activate
flask run

Terminal 2 – Frontend
cd frontend
npm run dev


Now open:

http://localhost:5173

🧪 10. Troubleshooting (Beginner-Friendly)
❗“ModuleNotFoundError”

Run:

pip install -r requirements.txt

❗“Access denied for user 'root'@'localhost'”

Check MySQL password in .env.

❗AI not working

Check GEMINI_API_KEY

Check backend console for errors

❗Profile shows "Guest"

Login first

Check JWT token in localStorage

Restart backend