# 🌍 GlobeTrotter

GlobeTrotter is a full-stack travel planning application that helps users create trips, manage destinations, build itineraries, discover activities, track expenses, and organize travel schedules from one platform.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Logout
- User profile
- Authenticated API requests

### ✈️ Trip Management

- Create new trips
- View personal trips
- View trip details
- Add trip description
- Set trip dates
- Add destinations
- Manage trip-specific data

### 🗺️ Itinerary Builder

- Search cities and destinations
- Add cities to a trip
- Create itinerary stops
- Assign dates to stops
- Search activities
- Add activities to itinerary stops
- Manage activities for each stop

### 🎯 Activities

- Browse activities
- Search activities
- Filter activities by category
- Filter activities by destination
- View activity information
- View activity pricing
- Add activities to an itinerary

### 💰 Budget Management

- View trip budget
- View expenses
- Add expenses
- Edit expenses
- Delete expenses
- Track total spending
- Categorize expenses

Supported expense categories:

- Transport
- Stay
- Activity
- Meal
- Other

### 📅 Calendar / Timeline

- View trip timeline
- View scheduled itinerary items
- Track activities by date
- View trip schedule
- Trip-specific timeline

### 👤 Profile

- View user information
- View email
- View account information
- View user role
- Secure logout

### 📊 Dashboard

- Upcoming trip overview
- Expense overview
- Trip planning status
- Timeline overview
- Quick navigation
- Weather section
- Trip statistics

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Fetch API

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

### Database

- PostgreSQL
- Prisma ORM

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 📁 Project Structure

```text
odoo-procurement-erp/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── prisma/
│   └── schema.prisma
│
├── docs/
│
└── README.md
⚙️ Requirements

Before running the project, install:

Node.js
npm
PostgreSQL
Git

Recommended:

Node.js 20+
npm 10+
PostgreSQL 14+
📥 Installation

Clone the repository:

git clone https://github.com/jeettech-root/odoo-procurement-erp.git

Navigate to the project:

cd odoo-procurement-erp
🗄️ Backend Setup

Navigate to the backend:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend directory.

Example:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET="your-secret-key"
PORT=3001

Replace the database values with your PostgreSQL credentials.

⚠️ Never commit .env to GitHub.

🔷 Prisma Setup

From the backend directory, generate Prisma Client:

npx prisma generate --schema ../prisma/schema.prisma

Validate the Prisma schema:

npx prisma validate --schema ../prisma/schema.prisma

If the database needs to be synchronized during development, use the project's existing Prisma migration workflow.

⚠️ Do not reset the database unless you intentionally want to delete development data.

▶️ Start Backend

From the backend directory:

npm run dev

The backend runs on:

http://localhost:3001

Keep this terminal running.

💻 Frontend Setup

Open another terminal.

From the project root:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:5173
🔄 Application Flow
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Trip
   ↓
My Trips
   ↓
Select Trip
   ↓
Add Cities
   ↓
Build Itinerary
   ↓
Add Activities
   ↓
Manage Budget
   ↓
View Calendar / Timeline
   ↓
Profile / Logout
🧭 Main Pages
Page	Route	Purpose
Dashboard	/dashboard	Main travel overview
My Trips	/trips	View personal trips
New Trip	/trips/new	Create a trip
Itinerary	/itinerary	Build itinerary
Activities	/activities	Explore activities
Budget	/budget	Manage expenses
Calendar	/timeline	View trip timeline
Profile	/profile	View user information

Trip-specific pages use the selected trip ID.

Example:

/itinerary?tripId=<trip-id>
/budget?tripId=<trip-id>
🔑 Authentication

GlobeTrotter uses JWT-based authentication.

Authenticated requests use:

Authorization: Bearer <token>

The backend identifies the current user from the authenticated request.

User-specific trips and data are associated with the authenticated user.

⚠️ Never commit JWT secrets or authentication credentials.

🔌 API Overview
Authentication
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
Trips
GET    /api/trips
POST   /api/trips
GET    /api/trips/:tripId
PUT    /api/trips/:tripId
DELETE /api/trips/:tripId
Itinerary
GET /api/itinerary/trips/:tripId/stops
Activities
GET /api/itinerary/activities
GET /api/itinerary/cities
Budget
GET    /api/trips/:tripId/budget
GET    /api/trips/:tripId/expenses
POST   /api/trips/:tripId/expenses
PUT    /api/trips/:tripId/expenses/:expenseId
DELETE /api/trips/:tripId/expenses/:expenseId
Timeline
GET /api/trips/:tripId/timeline
🧪 Testing Guide
1. Start PostgreSQL

Make sure PostgreSQL is running.

2. Start Backend
cd backend
npm run dev

Verify:

Backend: http://localhost:3001
3. Start Frontend

Open another terminal:

cd frontend
npm run dev

Verify:

Frontend: http://localhost:5173
🔐 Test Authentication
Open the application.
Create an account.
Login.
Open Dashboard.
Open Profile.
Logout.
Login again.
✈️ Test Create Trip
Open New Trip.
Enter a trip title.
Add a description.
Search/select a destination.
Select trip dates.
Create the trip.
Open My Trips.
Confirm the trip appears.
🧳 Test My Trips
Open My Trips.
Confirm created trips appear.
Select a trip.
Confirm the correct trip is opened.
Open the itinerary.
🏙️ Test Cities
Open a trip.
Open Itinerary.
Search for a city.
Click Search.
Select the required city.
Add it as a stop.
Confirm the stop appears.
🎯 Test Activities
Open Activities.
Search for activities.
Filter by category.
Filter by destination.
Select an activity.
Add the activity to an itinerary.
Confirm the activity appears under the selected stop.
💰 Test Budget
Open Budget for a selected trip.
Add an expense.
Select an expense category.
Enter the amount.
Add a description.
Save the expense.
Edit the expense.
Delete the expense.
Confirm the total updates.
📅 Test Calendar
Add itinerary items with dates.
Open Calendar / Timeline.
Confirm scheduled items appear.
Confirm the dates match the itinerary.
👤 Test Profile
Open Profile.
Confirm user information appears.
Confirm email is displayed correctly.
Confirm the user role is displayed.
Test logout.
🏗️ Production Build

Navigate to the frontend:

cd frontend

Build the application:

npm run build

The production build is generated inside:

frontend/dist/
🧹 Useful Commands
Frontend
cd frontend
npm install
npm run dev
npm run build
Backend
cd backend
npm install
npm run dev
Prisma
npx prisma generate --schema ../prisma/schema.prisma
npx prisma validate --schema ../prisma/schema.prisma
🐛 Troubleshooting
Backend Port Already in Use

If you see:

EADDRINUSE: address already in use :::3001

Find the process:

Get-NetTCPConnection -LocalPort 3001 -State Listen

Check the process:

Get-Process -Id <PID>

Stop it if necessary:

Stop-Process -Id <PID> -Force

Then restart:

npm run dev

Do not start multiple backend servers on port 3001.

Prisma Client Not Initialized

If you see:

@prisma/client did not initialize yet

Run:

npx prisma generate --schema ../prisma/schema.prisma

Then restart the backend:

npm run dev
Prisma EPERM Error

If Prisma reports an EPERM error while generating the client:

Stop the backend.
Stop other Node processes using the project.
Run Prisma generate again.
npx prisma generate --schema ../prisma/schema.prisma

Do not delete the database.

Unauthorized Error

If the application shows:

Unauthorized

Check:

User is logged in.
JWT exists.
Authorization header is being sent.
Backend JWT configuration is correct.
Backend is running.
Token has not expired.
Authentication middleware is working.
Trips API Returns 500

If /api/trips returns HTTP 500, check the backend terminal first.

Verify:

PostgreSQL is running.
DATABASE_URL is correct.
Prisma Client is generated.
Prisma schema is valid.
Database schema matches the Prisma schema.
Authentication middleware works.
Trip service uses valid Prisma fields and relations.

Do not use:

npx prisma migrate reset

unless you intentionally want to delete all development database data.

Frontend Cannot Reach Backend

Verify:

Frontend
http://localhost:5173

Backend
http://localhost:3001

Make sure both servers are running.

👥 Team Development

Before starting work:

git pull origin main

Check repository status:

git status

Add changes:

git add .

Commit changes:

git commit -m "Describe your changes"

Push:

git push origin main

⚠️ Avoid force pushing to main unless the entire team agrees.

📌 Development Guidelines
Use existing APIs before creating new endpoints.
Use real database records.
Do not hardcode demo data.
Do not commit .env.
Do not expose JWT secrets.
Do not reset the database during normal development.
Keep authentication enabled.
Use the authenticated user's ID for user-owned data.
Test frontend and backend together.
Run npm run build before pushing frontend changes.
Keep changes focused on the assigned feature.
Do not modify unrelated features.
🌍 Project Goal

GlobeTrotter provides a centralized travel planning experience where users can:

Create trips.
Select destinations.
Build itineraries.
Discover activities.
Track expenses.
Manage schedules.
Review travel plans.

The application combines trip planning, itinerary management, activities, budgeting, and scheduling into one full-stack platform.

👨‍💻 Development Stack
Frontend:
React + Vite + Tailwind CSS

Backend:
Node.js + Express.js

Database:
PostgreSQL

ORM:
Prisma

Authentication:
JWT

Version Control:
Git + GitHub
📄 License

This project was developed as a team project for an academic/hackathon-style application.

All rights reserved to the project contributors.
