# CivicLens - Local Development Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Google Cloud account
- Firebase account

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd techsprint-jgec
```

### 2. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Follow the setup wizard
4. Enable Blaze (pay-as-you-go) plan for Cloud Functions

#### Enable Services
1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location

3. **Storage**
   - Go to Storage
   - Get started

#### Get Firebase Config
1. Go to Project Settings
2. Scroll to "Your apps"
3. Click Web icon to create a web app
4. Copy the configuration object

#### Download Service Account Key
1. Go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Save as `backend/serviceAccountKey.json`

### 4. Google Cloud Setup

#### Enable APIs
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  aiplatform.googleapis.com \
  vision.googleapis.com \
  bigquery.googleapis.com
```

#### Get Gemini API Key
1. Visit https://makersuite.google.com/app/apikey
2. Create API key
3. Save for configuration

#### Get Google Maps API Key
1. Go to Google Cloud Console
2. APIs & Services > Credentials
3. Create credentials > API key
4. Enable Maps JavaScript API, Places API, Geocoding API
5. Restrict the key to your domain

### 5. Environment Configuration

#### Backend Environment
Create `backend/.env`:

```env
PORT=8080
NODE_ENV=development

GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1

FIREBASE_PROJECT_ID=your-firebase-project-id
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

GEMINI_API_KEY=your-gemini-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

BIGQUERY_DATASET=civiclens_data
BIGQUERY_TABLE=reports

CORS_ORIGIN=http://localhost:5173

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CLUSTER_RADIUS_METERS=100
```

#### Frontend Environment
Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

VITE_API_URL=http://localhost:8080
```

## Running the Application

### Option 1: Run Everything Together
```bash
npm run dev
```

This starts both backend and frontend concurrently.

### Option 2: Run Separately

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:8080

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Testing the Application

### 1. Create Test User
1. Open http://localhost:5173
2. Click "Register"
3. Create account with email/password or Google

### 2. Submit Test Report
1. Login to the application
2. Click "Submit Report"
3. Fill in description
4. Click "Use Current Location" (allow browser location)
5. Optionally upload images
6. Submit

### 3. View Reports
1. Click "View Reports"
2. See your submitted report
3. Click on it to see details

### 4. View Dashboard
1. Login as authenticated user
2. Click "Dashboard"
3. View analytics and statistics

## Development Workflow

### Backend Development

#### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── index.ts         # Entry point
├── Dockerfile           # Container config
└── package.json
```

#### Adding New Routes
1. Create route file in `src/routes/`
2. Import in `src/index.ts`
3. Add to Express app

#### Testing API Endpoints
```bash
# Health check
curl http://localhost:8080/health

# Get reports (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/reports
```

### Frontend Development

#### Project Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── config/         # Configuration
│   └── main.tsx        # Entry point
├── index.html
└── package.json
```

#### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`

## Debugging

### Backend Debugging

#### VS Code Launch Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ]
}
```

#### View Logs
Backend logs appear in the terminal. Look for:
- ✅ Success messages (green)
- ⚠️ Warnings (yellow)
- ❌ Errors (red)

### Frontend Debugging

Use browser DevTools:
- Console for errors
- Network tab for API calls
- React DevTools for component inspection

## Common Issues

### Issue: Firebase Auth not working
**Solution:**
- Check Firebase config in frontend/.env
- Verify Authentication is enabled in Firebase Console
- Clear browser cache and cookies

### Issue: Backend can't connect to Firebase
**Solution:**
- Verify serviceAccountKey.json is in backend/
- Check FIREBASE_PROJECT_ID matches your project
- Ensure Firestore is initialized in Firebase Console

### Issue: Gemini API errors
**Solution:**
- Verify GEMINI_API_KEY is correct
- Check API quotas in Google Cloud Console
- Ensure Vertex AI API is enabled

### Issue: Images not uploading
**Solution:**
- Check Firebase Storage is enabled
- Verify storage rules allow uploads
- Check file size (max 10MB)

### Issue: Location not working
**Solution:**
- Use HTTPS or localhost (browser requirement)
- Allow location permissions in browser
- Check Google Maps API key

## Building for Production

### Backend
```bash
cd backend
npm run build
```

Output in `backend/dist/`

### Frontend
```bash
cd frontend
npm run build
```

Output in `frontend/dist/`

## Code Quality

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Type Checking
```bash
# Both use TypeScript
npm run type-check
```

## Next Steps

1. Review [API Documentation](API.md)
2. Check [Deployment Guide](DEPLOYMENT.md)
3. Explore the codebase
4. Start building features!

## Getting Help

- Check documentation in `/docs`
- Review code comments
- Create GitHub issues
- Contact the team

Happy coding! 🚀
