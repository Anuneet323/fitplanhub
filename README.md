📁 Project Structure
text
fitplanhub/
├── backend/          # Node.js/Express API (user auth, workouts, plans)
└── fitplanhub-react/ # React frontend (UI, forms, dashboard)
🛠️ Tech Stack
Frontend	Backend
React 18	Node.js
Tailwind CSS	Express.js
React Router	MongoDB/Mongoose
Axios	JWT Auth
Vite	CORS
🚀 Quick Start
1. Clone & Install
bash
git clone https://github.com/Anuneet323/fitplanhub.git
cd fitplanhub
2. Backend Setup
bash
cd backend
npm install
copy .env.example .env
npm run dev
Backend runs on: http://localhost:5000

3. Frontend Setup
bash
cd ../fitplanhub-react
npm install
npm run dev
Frontend runs on: http://localhost:5173

🌐 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Create account
POST	/api/auth/login	Login
GET	/api/workouts	Get all workouts
POST	/api/plans	Create workout plan
📱 Features
✅ User authentication (Register/Login)

✅ Create & track workout plans

✅ Dashboard with progress charts

✅ Responsive design (Mobile-first)

✅ Real-time updates

🧪 Testing
bash
# Backend tests
cd backend && npm test

# Frontend tests
cd fitplanhub-react && npm test
🚀 Deployment
Backend (Render/Vercel)
Push to GitHub

Deploy backend folder

Set env vars: MONGODB_URI, JWT_SECRET

Frontend (Vercel/Netlify)
Build: npm run build

Deploy dist folder

Set API URL: VITE_API_URL=https://your-backend.com

🤝 Contributing
Fork the repo

Create feature branch: git checkout -b feature/new-workouts

Commit changes: git commit -m "Add workout filters"

Push: git push origin feature/new-workouts

Open Pull Request

📄 License
MIT License - Feel free to use and modify!

Made with ❤️ for fitness enthusiasts
Built by Anuneet | LinkedIn
