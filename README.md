Project overview
FitPlanHub lets trainers create and sell structured fitness plans, and lets users follow trainers, subscribe to plans, and view personalized feeds. The app uses JWT‑based auth, protected routes, and conditional rendering for preview vs full access to plans.​

Tech stack
Backend (Node.js)
Node.js, Express

MongoDB with Mongoose models for User and Plan

JWT authentication middleware (authenticate, isTrainer)

Routes: auth, plans, subscriptions, social (follow/following).​

Frontend (React)
React with React Router v6

Context + custom hooks for auth (AuthContext, useAuth) and plans (PlanContext, usePlans)

Pages: LandingPage, LoginPage, DashboardPage, FeedPage, TrainersPage, PlanDetailsPage

ProtectedRoute with role‑based access (requiredRole="user" / "trainer").​

Folder structure
bash
fitplanhub/
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   └── Plan.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── plans.js
│   │   ├── social.js
│   │   └── subscriptions.js
│   └── middleware/
│       └── auth.js
└── fitplanhub-react/
    ├── src/
    │   ├── App.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── PlanContext.jsx
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── FeedPage.jsx
    │   │   ├── TrainersPage.jsx
    │   │   └── PlanDetailsPage.jsx
    │   ├── components/
    │   │   ├── Layout/MainLayout.jsx
    │   │   └── Common/…
    │   └── styles/index.css
    └── public/index.html
Backend setup
Go to backend folder:

bash
cd backend
Install dependencies:

bash
npm install
Create .env in backend (or use your provided env file) with values like:

text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
Start the backend:

bash
npm start   # or: npm run dev
Backend will run on http://localhost:5000 by default.

Frontend setup
Go to frontend folder:

bash
cd fitplanhub-react
Install dependencies:

bash
npm install
Ensure public/index.html exists with a <div id="root"></div>.​

Start the frontend:

bash
npm start   # or: npm run dev (depending on your setup)
Frontend will run on http://localhost:3000 (or Vite’s default port).​

If needed, set an environment variable (e.g. .env in frontend) for the API base URL:

text
REACT_APP_API_URL=http://localhost:5000
and make sure planService, authService, etc., use that base URL.​

Login and roles
1. Sign up as trainer or user
Use the backend auth route (e.g. POST /api/auth/register) to create users with roles user or trainer. A typical trainer payload:​

json
{
  "name": "Alice Trainer",
  "email": "trainer@example.com",
  "password": "password123",
  "role": "trainer"
}
A typical normal user payload:

json
{
  "name": "Bob User",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
You can hit this via Postman or from your frontend signup/login form depending on how you wired it.​

2. Login from the frontend
Open http://localhost:3000/login.

Enter the email and password you registered with.

On submit, the frontend:

Calls the backend login endpoint (e.g. POST /api/auth/login).

Receives a JWT token and user object (including role).

Stores them in AuthContext (and usually localStorage) via useAuth.​

After login:

If role === "trainer" you should navigate to /dashboard.

If role === "user" you should navigate to /feed or the landing page, depending on your redirect logic.​

Example roles behavior in the app:

Role	Default screen	Permissions
trainer	/dashboard	Create/update/delete own plans, see their stats and list of created plans.
user	/feed or /	Follow trainers, subscribe to plans, view personalized feed.
​

Core screens and flows
Landing Page (/)
Public page.

Uses planService.getAllPlans() to display plan cards (title, trainer, duration, price).

Clicking “View Details” leads to /plan/:id. If not logged in, it redirects to /login.​

Login Page (/login)
Calls auth API to log in.

On success, stores token/user in AuthContext and redirects based on user.role.​

Trainer Dashboard (/dashboard – trainer only)
Protected with requiredRole="trainer".

Loads all plans, filters to plans where plan.trainer._id === user._id.

Shows summary stats (total plans, fake subscribers/followers).

Allows full CRUD on plans using the backend /api/plans routes:​

Create: POST /api/plans

Update: PUT /api/plans/:planId

Delete: DELETE /api/plans/:planId

Plan Details Page (/plan/:id)
Protected (logged-in users only).

Uses GET /api/plans/:planId.​

Backend behavior:

If user is the trainer owner or subscribed, returns full plan with hasAccess: true.

If not, returns 403 with a preview object (title, price, duration, trainer) and an error message.​

Frontend behavior:

Shows full description and details for subscribed users/owners.

Shows preview + “Subscribe” button for non‑subscribed users.

Clicking “Subscribe” calls planService.subscribePlan(id) and shows a simulated payment modal.​

User Feed (/feed – user only)
Protected with requiredRole="user".

Calls trainerService.getFeed() which returns plans from trainers the user follows.

Shows whether each plan is purchased and a button to view or subscribe.​

Trainers / Trainer Profile (/trainers, /trainer/:id)
Shows list of trainers and/or single trainer profile.

Allows follow/unfollow (using social.js routes) and lists that trainer’s plans. [file:3bc9e4ab-8124-4fec-a36b-5e92ab94531c]​

Subscription and access control
User model stores subscriptions: [{ plan: ObjectId, subscribedAt }].​

Helper method user.isSubscribedTo(planId) checks if a user has a specific plan.​

Plans route uses this to decide:​

In GET /api/plans:

For each plan, returns hasAccess: true for trainers and subscribed users.

Returns preview with hasAccess: false for others.

In GET /api/plans/:planId:

Sends full plan if hasSubscription or trainer owner.

Sends 403 with preview if not.

This is what drives the preview vs full view behavior in the frontend.

Running tests or lint (optional)
If you add tests or linting:

bash
# backend
cd backend
npm test   # or npm run lint

# frontend
cd ../fitplanhub-react
npm test   # if configured
