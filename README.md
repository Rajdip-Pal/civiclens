# CivicLens - Real-Time Civic Issue Detection & Response Platform

## Overview
CivicLens is an AI-powered platform that automatically detects, classifies, and prioritizes civic issues using multimodal data (text, images, and location signals). Designed for scalability and real-time processing.

## Features
- 📱 **Citizen Reporting**: Submit civic issues with photos, descriptions, and location
- 🤖 **AI Classification**: Automatic categorization using Gemini AI
- 🗺️ **Geo-Clustering**: Smart grouping of nearby similar issues
- 📊 **Authority Dashboard**: Real-time monitoring and issue management
- 🔔 **Real-time Updates**: Live notifications via Firebase
- 📈 **Analytics**: Historical data analysis with BigQuery

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for components
- Google Maps JavaScript API
- Firebase SDK (Auth, Firestore, Storage)
- Vite for building

### Backend
- Node.js with Express
- Google Cloud Run (serverless deployment)
- Firebase Admin SDK
- Vertex AI / Gemini API
- Google Cloud Vision API
- Google Maps Platform APIs
- BigQuery for analytics

## Project Structure
```
civiclens/
├── backend/                 # Cloud Run service
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── utils/          # Helpers
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── hooks/          # Custom hooks
│   └── package.json
├── firebase/               # Firebase config
└── docs/                   # Documentation
```

## Prerequisites
- Node.js 18+
- Google Cloud Platform account
- Firebase project
- Google Maps API key
- Gemini API key

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd techsprint-jgec
```

### 2. Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Enable Firestore Database
4. Enable Storage
5. Download service account key to `backend/serviceAccountKey.json`
6. Copy web config to frontend environment

### 3. Google Cloud Setup
1. Create a GCP project
2. Enable the following APIs:
   - Cloud Run API
   - Vertex AI API
   - Cloud Vision API
   - Google Maps JavaScript API
   - Places API
   - Geocoding API
   - BigQuery API
3. Create a service account with appropriate permissions
4. Download credentials

### 4. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase and Maps config
```

### 5. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 6. Run Locally

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

## Deployment

### Deploy Backend to Cloud Run
```bash
cd backend
npm run deploy
```

### Deploy Frontend to Firebase Hosting
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## API Documentation

### Endpoints

#### POST /api/reports
Submit a new civic issue report
```json
{
  "description": "Large pothole on Main Street",
  "category": "ROAD_DAMAGE",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St"
  },
  "images": ["base64..."]
}
```

#### GET /api/reports
Fetch all reports with filters
Query params: `status`, `category`, `startDate`, `endDate`

#### GET /api/reports/:id
Get specific report details

#### PATCH /api/reports/:id/status
Update report status (authority only)
```json
{
  "status": "IN_PROGRESS",
  "notes": "Crew assigned"
}
```

#### GET /api/analytics/trends
Get analytics and trends data

## Issue Categories
- ROAD_DAMAGE (potholes, cracks)
- SANITATION (garbage, cleanliness)
- STREET_LIGHTS (outages, damage)
- WATER_SUPPLY (leaks, quality)
- TRAFFIC (signals, congestion)
- PUBLIC_SAFETY (hazards, emergencies)
- PARKS (maintenance, vandalism)
- OTHER

## Priority Levels
- CRITICAL (immediate danger)
- HIGH (significant impact)
- MEDIUM (moderate issue)
- LOW (minor inconvenience)

## Status Workflow
1. SUBMITTED - Initial report
2. VERIFIED - AI/admin verified
3. IN_PROGRESS - Being addressed
4. RESOLVED - Issue fixed
5. CLOSED - Confirmed closed

## Security
- Firebase Authentication for users
- JWT validation on backend
- Role-based access control (Citizen/Authority)
- Image validation and sanitization
- Rate limiting on API endpoints

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License

## Support
For issues and questions, please create a GitHub issue or contact the team.

## Acknowledgments
Built for TechSprint Hackathon using Google Cloud technologies.
