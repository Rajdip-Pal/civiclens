#!/bin/bash

# CivicLens Deployment Script

echo "🚀 Starting CivicLens Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if firebase is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Please install it: npm install -g firebase-tools${NC}"
    exit 1
fi

# Load environment variables
if [ -f backend/.env ]; then
    export $(cat backend/.env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}⚠️  No backend/.env file found. Using default values.${NC}"
fi

# Deploy Backend to Cloud Run
echo -e "${GREEN}📦 Building and deploying backend to Cloud Run...${NC}"
cd backend

# Build Docker image
echo "Building Docker image..."
gcloud builds submit --tag gcr.io/${GCP_PROJECT_ID}/civiclens-api

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy civiclens-api \
  --image gcr.io/${GCP_PROJECT_ID}/civiclens-api \
  --platform managed \
  --region ${GCP_REGION:-us-central1} \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GCP_PROJECT_ID=${GCP_PROJECT_ID},FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}

# Get the deployed URL
BACKEND_URL=$(gcloud run services describe civiclens-api --region ${GCP_REGION:-us-central1} --format 'value(status.url)')
echo -e "${GREEN}✅ Backend deployed to: ${BACKEND_URL}${NC}"

cd ..

# Deploy Frontend to Firebase Hosting
echo -e "${GREEN}🌐 Building and deploying frontend to Firebase Hosting...${NC}"
cd frontend

# Update frontend .env with backend URL
echo "Updating frontend environment..."
echo "VITE_API_URL=${BACKEND_URL}" >> .env.production

# Build frontend
echo "Building frontend..."
npm run build

# Deploy to Firebase
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

cd ..

# Deploy Firestore rules and indexes
echo -e "${GREEN}🔐 Deploying Firestore rules and indexes...${NC}"
firebase deploy --only firestore:rules,firestore:indexes,storage

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Backend URL: ${BACKEND_URL}${NC}"
echo -e "${GREEN}Frontend URL: https://${FIREBASE_PROJECT_ID}.web.app${NC}"
