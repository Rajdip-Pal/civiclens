# CivicLens - Quick Start Guide

Welcome to CivicLens! This guide will help you get started quickly.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites Check

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm (`npm --version`)
- ✅ Git

### 2. Install Dependencies

```bash
# Run the setup script
./setup.sh
```

Or manually:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Configure Environment

#### Get Firebase Credentials
1. Create project at https://console.firebase.google.com
2. Enable Authentication (Email + Google)
3. Enable Firestore Database
4. Enable Storage
5. Get web config from Project Settings

#### Get API Keys
1. **Gemini API**: https://makersuite.google.com/app/apikey
2. **Google Maps**: Google Cloud Console > APIs & Services > Credentials

#### Update Configuration Files

**backend/.env:**
```bash
cp backend/.env.example backend/.env
# Edit with your credentials
```

**frontend/.env:**
```bash
cp frontend/.env.example frontend/.env
# Edit with your Firebase config
```

**backend/serviceAccountKey.json:**
- Download from Firebase Console > Project Settings > Service Accounts

### 4. Run the Application

```bash
# Start both backend and frontend
npm run dev
```

Or separately:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 📝 First Steps

### Create Your First Report

1. **Register**: Go to http://localhost:5173/register
2. **Login**: Use your email or Google
3. **Submit Report**:
   - Click "Submit Report"
   - Describe a civic issue
   - Allow location access
   - Upload photos (optional)
   - Submit!

4. **View Reports**: Click "View Reports" to see all submissions
5. **Dashboard**: Access analytics and statistics

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Citizens                          │
│              (Web/Mobile Interface)                 │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│  - Citizen reporting interface                     │
│  - Authority dashboard                             │
│  - Real-time updates                              │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│         Backend API (Node.js + Express)             │
│              (Cloud Run Service)                    │
└────────┬────────────────────────┬───────────────────┘
         │                        │
         ↓                        ↓
┌─────────────────┐    ┌──────────────────────┐
│  Firebase       │    │  Google Cloud AI     │
│  - Auth         │    │  - Gemini (text)     │
│  - Firestore    │    │  - Vision (images)   │
│  - Storage      │    │  - Maps (location)   │
└─────────────────┘    └──────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│     BigQuery Analytics          │
│  - Historical data              │
│  - Trends & insights           │
└─────────────────────────────────┘
```

## 🔑 Key Features

### For Citizens
- 📱 Easy report submission (text, photos, location)
- 🔍 View all civic issues in your area
- 📊 Track report status in real-time
- 🔔 Receive updates on your submissions

### For Authorities
- 🤖 AI-powered automatic categorization
- ⚡ Priority-based issue routing
- 📈 Analytics dashboard
- 🗺️ Geographic clustering
- 📊 Performance metrics

### AI Capabilities
- **Text Analysis**: Automatic category detection, priority assignment
- **Image Analysis**: Visual evidence verification, safety checks
- **Duplicate Detection**: Smart clustering of similar issues
- **Smart Suggestions**: Recommended actions for authorities

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI**: Material-UI (MUI)
- **State**: Zustand
- **Maps**: Google Maps JavaScript API
- **Build**: Vite
- **Auth**: Firebase Authentication

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Deployment**: Google Cloud Run

### Google Cloud Services
- **AI/ML**: Gemini API (text), Cloud Vision (images)
- **Database**: Firestore (real-time), BigQuery (analytics)
- **Storage**: Cloud Storage
- **Maps**: Google Maps Platform
- **Hosting**: Firebase Hosting

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment steps

## 🚢 Deployment

### Deploy to Production

```bash
./deploy.sh
```

This will:
1. Build backend Docker container
2. Deploy to Cloud Run
3. Build frontend
4. Deploy to Firebase Hosting
5. Update Firestore/Storage rules

### Manual Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed steps.

## 🐛 Troubleshooting

### Common Issues

**Issue**: `Module not found`
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Firebase auth not working
```bash
# Solution: Check Firebase config
# Verify .env files have correct values
# Clear browser cache
```

**Issue**: Backend won't start
```bash
# Solution: Check service account key
# Ensure backend/serviceAccountKey.json exists
# Verify all environment variables are set
```

**Issue**: AI features not working
```bash
# Solution: Verify API keys
# Check Gemini API key is valid
# Ensure APIs are enabled in GCP
```

## 📊 Sample Data

### Test Report Categories
- Road damage (potholes, cracks)
- Sanitation (garbage, cleanliness)
- Street lights (outages, damage)
- Water supply (leaks, quality)
- Traffic (signals, congestion)
- Public safety (hazards)
- Parks (maintenance)

### Test Locations
Use your current location or try:
- New York: 40.7128, -74.0060
- San Francisco: 37.7749, -122.4194
- London: 51.5074, -0.1278

## 🎯 Next Steps

1. ✅ Complete environment setup
2. ✅ Run the application locally
3. ✅ Create test reports
4. ✅ Explore the dashboard
5. 📖 Read the API documentation
6. 🚀 Deploy to production
7. 🎨 Customize for your city
8. 📈 Add more features

## 💡 Tips

- **Development**: Use `npm run dev` for hot-reload
- **Testing**: Create multiple test users for different scenarios
- **API Keys**: Keep them secret, never commit to Git
- **Cost**: Monitor usage in Google Cloud Console
- **Performance**: Use Chrome DevTools for optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **Email**: support@example.com

## 🎉 You're All Set!

Your CivicLens application is ready to help improve your community through technology!

**Quick Links:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Firebase Console: https://console.firebase.google.com
- Google Cloud Console: https://console.cloud.google.com

Happy building! 🏗️✨
