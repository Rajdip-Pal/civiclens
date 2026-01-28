# CivicLens - Complete Deployment Guide

## Prerequisites

Before deploying CivicLens, ensure you have:

1. **Google Cloud Platform Account**
   - Active GCP project
   - Billing enabled
   - Owner or Editor role

2. **Firebase Project**
   - Firebase project created (can use same GCP project)
   - Blaze (pay-as-you-go) plan enabled

3. **Development Tools**
   - Node.js 18+ installed
   - Google Cloud SDK (`gcloud`)
   - Firebase CLI (`npm install -g firebase-tools`)
   - Git

## Step 1: Google Cloud Setup

### 1.1 Create GCP Project
```bash
gcloud projects create civiclens-prod --name="CivicLens Production"
gcloud config set project civiclens-prod
```

### 1.2 Enable Required APIs
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  vision.googleapis.com \
  bigquery.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com
```

### 1.3 Create Service Account
```bash
gcloud iam service-accounts create civiclens-sa \
  --display-name="CivicLens Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding civiclens-prod \
  --member="serviceAccount:civiclens-sa@civiclens-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding civiclens-prod \
  --member="serviceAccount:civiclens-sa@civiclens-prod.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download key
gcloud iam service-accounts keys create backend/serviceAccountKey.json \
  --iam-account=civiclens-sa@civiclens-prod.iam.gserviceaccount.com
```

### 1.4 Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Save it for later use

### 1.5 Enable Google Maps APIs
1. Go to Google Cloud Console > APIs & Services
2. Enable:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Create API key and restrict it to your domain

## Step 2: Firebase Setup

### 2.1 Initialize Firebase
```bash
firebase login
firebase init
```

Select:
- Firestore
- Storage
- Hosting

### 2.2 Get Firebase Config
1. Go to Firebase Console > Project Settings
2. Under "Your apps", click "Web app"
3. Copy the config object

### 2.3 Set Up Authentication
1. Go to Firebase Console > Authentication
2. Enable Email/Password
3. Enable Google Sign-In

## Step 3: Configure Environment Variables

### 3.1 Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=8080
NODE_ENV=production
GCP_PROJECT_ID=civiclens-prod
GCP_REGION=us-central1
FIREBASE_PROJECT_ID=civiclens-prod
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_MAPS_API_KEY=your-maps-api-key
BIGQUERY_DATASET=civiclens_data
BIGQUERY_TABLE=reports
CORS_ORIGIN=https://civiclens-prod.web.app
```

### 3.2 Frontend Configuration
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=civiclens-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=civiclens-prod
VITE_FIREBASE_STORAGE_BUCKET=civiclens-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
VITE_API_URL=https://your-cloud-run-url
```

## Step 4: Deploy Backend to Cloud Run

### 4.1 Build and Deploy
```bash
cd backend

# Build the container
gcloud builds submit --tag gcr.io/civiclens-prod/civiclens-api

# Deploy to Cloud Run
gcloud run deploy civiclens-api \
  --image gcr.io/civiclens-prod/civiclens-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GCP_PROJECT_ID=civiclens-prod,FIREBASE_PROJECT_ID=civiclens-prod,GEMINI_API_KEY=your-key,GOOGLE_MAPS_API_KEY=your-key
```

### 4.2 Get Deployment URL
```bash
gcloud run services describe civiclens-api --region us-central1 --format 'value(status.url)'
```

Update `frontend/.env` with the URL.

## Step 5: Deploy Frontend to Firebase Hosting

### 5.1 Build Frontend
```bash
cd frontend
npm run build
```

### 5.2 Deploy
```bash
firebase deploy --only hosting
```

## Step 6: Deploy Firestore & Storage Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Step 7: Initialize BigQuery

The BigQuery dataset and table will be created automatically on first backend startup. Alternatively, create manually:

```bash
bq mk --dataset civiclens-prod:civiclens_data

bq mk --table civiclens-prod:civiclens_data.reports \
  report_id:STRING,timestamp:TIMESTAMP,category:STRING,priority:STRING,status:STRING,latitude:FLOAT,longitude:FLOAT,address:STRING,description:STRING,user_id:STRING,resolution_time_hours:FLOAT
```

## Step 8: Verify Deployment

### 8.1 Test Backend
```bash
curl https://your-cloud-run-url/health
```

### 8.2 Test Frontend
Open your browser to `https://civiclens-prod.web.app`

## Quick Deploy Script

For subsequent deployments, use the provided script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Monitoring & Logs

### View Cloud Run Logs
```bash
gcloud run services logs read civiclens-api --region us-central1
```

### View Firebase Hosting Logs
Check Firebase Console > Hosting

### View BigQuery Data
```bash
bq query "SELECT * FROM civiclens-prod.civiclens_data.reports LIMIT 10"
```

## Cost Optimization

1. **Cloud Run**: Auto-scales to zero, pay only for requests
2. **Firebase**: Free tier covers most small deployments
3. **Gemini API**: Monitor usage in Google Cloud Console
4. **BigQuery**: Set up cost alerts

## Security Checklist

- ✅ Firestore rules configured
- ✅ Storage rules configured
- ✅ API keys restricted by domain
- ✅ Service account permissions minimal
- ✅ CORS properly configured
- ✅ HTTPS enforced

## Troubleshooting

### Backend won't deploy
- Check service account permissions
- Verify all APIs are enabled
- Check environment variables

### Frontend can't connect to backend
- Verify CORS settings
- Check API URL in frontend .env
- Ensure Cloud Run allows unauthenticated requests

### AI features not working
- Verify Gemini API key is valid
- Check API quotas in GCP Console
- Review Cloud Run logs for errors

## Support

For issues:
1. Check logs in Cloud Console
2. Review Firebase Console
3. Create GitHub issue

## Next Steps

- Set up monitoring alerts
- Configure custom domain
- Add more features
- Scale as needed

Congratulations! Your CivicLens application is now deployed! 🎉
