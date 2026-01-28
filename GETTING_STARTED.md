# 🚀 CivicLens - Immediate Getting Started

## ⚡ Super Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd /home/luffy/Desktop/projects/techsprint-jgec
./setup.sh
```

### Step 2: Get API Keys

#### Firebase (2 minutes)
1. Go to https://console.firebase.google.com
2. Click "Add project" → Name it "civiclens" → Continue
3. Enable Google Analytics (optional) → Create project
4. Wait for project creation

#### Enable Firebase Services
1. **Authentication**:
   - Click "Authentication" → "Get started"
   - Enable "Email/Password" and "Google"
2. **Firestore**:
   - Click "Firestore Database" → "Create database"
   - Start in production mode → Choose location → Enable
3. **Storage**:
   - Click "Storage" → "Get started" → Start in production mode

#### Get Firebase Config
1. Project Settings (gear icon) → Scroll to "Your apps"
2. Click web icon (</>) → Register app → "civiclens-web"
3. Copy the config object

#### Download Service Account
1. Project Settings → Service accounts
2. Click "Generate new private key" → Download
3. Save as `backend/serviceAccountKey.json`

#### Gemini API Key (1 minute)
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy the key

#### Google Maps API (1 minute)
1. Go to https://console.cloud.google.com
2. Select your Firebase project
3. APIs & Services → Credentials
4. Create credentials → API key
5. Copy the key

### Step 3: Configure Environment

#### Backend Configuration
Edit `backend/.env`:
```env
PORT=8080
NODE_ENV=development

GCP_PROJECT_ID=civiclens
GCP_REGION=us-central1

FIREBASE_PROJECT_ID=civiclens
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

GEMINI_API_KEY=paste-your-gemini-key-here
GOOGLE_MAPS_API_KEY=paste-your-maps-key-here

BIGQUERY_DATASET=civiclens_data
BIGQUERY_TABLE=reports

CORS_ORIGIN=http://localhost:5173

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CLUSTER_RADIUS_METERS=100
```

#### Frontend Configuration
Edit `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=paste-from-firebase-config
VITE_FIREBASE_AUTH_DOMAIN=civiclens.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=civiclens
VITE_FIREBASE_STORAGE_BUCKET=civiclens.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=paste-from-config
VITE_FIREBASE_APP_ID=paste-from-config

VITE_GOOGLE_MAPS_API_KEY=paste-your-maps-key-here

VITE_API_URL=http://localhost:8080
```

### Step 4: Run the Application
```bash
# Start both backend and frontend
npm run dev
```

Or in separate terminals:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Step 5: Access & Test

1. Open browser: http://localhost:5173
2. Click "Register" → Create account
3. Click "Submit Report"
4. Test the features!

## ✅ Verification Checklist

Before submitting, verify:
```bash
./verify.sh
```

Expected output:
- ✓ Node.js installed
- ✓ npm installed
- ✓ Backend directory exists
- ✓ Frontend directory exists
- ✓ Backend .env configured
- ✓ Frontend .env configured
- ✓ serviceAccountKey.json present
- ✓ All files present

## 🐛 Common Issues & Fixes

### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
cd backend && rm -rf node_modules && npm install && cd ..
cd frontend && rm -rf node_modules && npm install && cd ..
```

### Issue: "Firebase auth not working"
- Check Firebase config in `frontend/.env`
- Verify Authentication is enabled in Firebase Console
- Clear browser cache and cookies

### Issue: "Cannot connect to backend"
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in frontend/.env
- Verify CORS settings in backend

### Issue: "serviceAccountKey.json not found"
- Download from Firebase Console → Project Settings → Service Accounts
- Place in `backend/` directory
- Ensure filename matches exactly

## 📝 Quick Test Script

Create a test report:
```bash
# 1. Register at http://localhost:5173/register
# 2. Login
# 3. Click "Submit Report"
# 4. Fill in:
#    - Description: "Large pothole on Main Street"
#    - Click "Use Current Location" (allow browser)
#    - Upload a photo (optional)
#    - Submit
# 5. View in "Reports" page
# 6. Check Dashboard for analytics
```

## 🚀 Deploy to Production

When ready to deploy:
```bash
./deploy.sh
```

This will:
1. Build backend Docker image
2. Deploy to Cloud Run
3. Build frontend
4. Deploy to Firebase Hosting
5. Update security rules

## 📚 Documentation Links

- **Main README**: [README.md](README.md)
- **API Docs**: [docs/API.md](docs/API.md)
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Development**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 💡 Pro Tips

1. **Use Incognito**: Test with fresh browser session
2. **Enable Location**: Required for submitting reports
3. **Try Google Login**: Faster than email/password
4. **Check Console**: Browser DevTools for debugging
5. **Monitor Logs**: Backend logs show AI processing

## 🎯 Features to Demo

1. ✅ AI categorization (automatic)
2. ✅ Priority assignment (AI-powered)
3. ✅ Image upload and analysis
4. ✅ Location capture
5. ✅ Real-time updates
6. ✅ Analytics dashboard
7. ✅ Report filtering
8. ✅ Status tracking

## 📞 Need Help?

1. Check documentation in `/docs`
2. Run `./verify.sh` for diagnostics
3. Review [DEVELOPMENT.md](docs/DEVELOPMENT.md)
4. Check Firebase Console for errors
5. Review browser console for frontend issues
6. Check backend terminal for API errors

## 🎉 You're Ready!

Your CivicLens application is now set up and ready to use!

**Next Steps:**
1. ✅ Test all features locally
2. ✅ Create sample reports
3. ✅ Verify dashboard works
4. ✅ Prepare for demo
5. ✅ Deploy to production (when ready)

---

**Quick Links:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Health: http://localhost:8080/health
- Firebase: https://console.firebase.google.com
- Google Cloud: https://console.cloud.google.com

**Happy Building! 🏗️✨**
