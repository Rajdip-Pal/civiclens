# CivicLens - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                                │
│                                                                  │
│         Citizens                    Local Authorities           │
│    (Submit Reports)                (Monitor & Respond)           │
└──────────────────────┬──────────────────────┬───────────────────┘
                       │                      │
                       ↓                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                        │
│                  Firebase Hosting (Global CDN)                   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Citizen    │  │  Authority   │  │    Real-time       │   │
│  │  Interface   │  │  Dashboard   │  │    Updates         │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js + Express)                     │
│                  Google Cloud Run (Auto-scaling)                 │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Report  │  │  Auth    │  │Analytics │  │  Clustering  │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │   Service    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└────┬──────────────┬───────────────┬────────────────┬───────────┘
     │              │               │                │
     ↓              ↓               ↓                ↓
┌─────────┐  ┌───────────┐  ┌──────────┐  ┌─────────────────┐
│Firebase │  │  Google   │  │ BigQuery │  │  Google Maps    │
│         │  │  AI/ML    │  │          │  │   Platform      │
│  Auth   │  │           │  │Analytics │  │                 │
│Firestore│  │  Gemini   │  │Historical│  │  Geocoding      │
│ Storage │  │  Vision   │  │   Data   │  │  Places API     │
└─────────┘  └───────────┘  └──────────┘  └─────────────────┘
```

## Data Flow - Report Submission

```
┌──────────┐
│  Citizen │
│  Submits │
│  Report  │
└────┬─────┘
     │
     ↓
┌────────────────────────────────────────┐
│  1. Capture Data                       │
│  • Description (text)                  │
│  • Photos (up to 5)                    │
│  • Location (GPS coordinates)          │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  2. Firebase Authentication            │
│  • Verify user token                   │
│  • Check permissions                   │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  3. Backend Processing (Cloud Run)     │
│  ┌──────────────────────────────────┐  │
│  │  Image Safety Check              │  │
│  │  (Cloud Vision API)              │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Text Analysis                   │  │
│  │  (Gemini API)                    │  │
│  │  • Category detection            │  │
│  │  • Priority assignment           │  │
│  │  • Urgency scoring              │  │
│  │  • Summary generation            │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Location Processing             │  │
│  │  (Google Maps)                   │  │
│  │  • Reverse geocoding             │  │
│  │  • Address resolution            │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  Duplicate Detection             │  │
│  │  • Find nearby reports           │  │
│  │  • AI similarity analysis        │  │
│  └──────────────────────────────────┘  │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  4. Image Upload                       │
│  • Firebase Cloud Storage              │
│  • Generate signed URLs                │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  5. Data Storage                       │
│  ┌──────────────────────────────────┐  │
│  │  Firestore (Real-time)           │  │
│  │  • Save report document          │  │
│  │  • Trigger real-time updates     │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  BigQuery (Analytics)            │  │
│  │  • Insert for historical data    │  │
│  │  • Enable trend analysis         │  │
│  └──────────────────────────────────┘  │
└────┬───────────────────────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│  6. Response & Updates                 │
│  • Return report ID & analysis         │
│  • Real-time notification to citizen   │
│  • Update authority dashboard          │
└────────────────────────────────────────┘
```

## AI Processing Pipeline

```
User Input (Text + Images)
           │
           ↓
┌──────────────────────────┐
│  Text Processing         │
│  (Gemini Pro)            │
│                          │
│  Input: Description      │
│  Output:                 │
│  • Category (8 types)    │
│  • Priority (4 levels)   │
│  • Urgency (0-10)        │
│  • Summary (1 sentence)  │
│  • Actions (2-3 items)   │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Image Processing        │
│  (Gemini Vision)         │
│                          │
│  Input: Photos           │
│  Output:                 │
│  • Visual description    │
│  • Evidence validation   │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Safety Check            │
│  (Cloud Vision API)      │
│                          │
│  Check for:              │
│  • Adult content         │
│  • Violence              │
│  • Inappropriate images  │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Label Detection         │
│  (Cloud Vision API)      │
│                          │
│  Extract:                │
│  • Object labels         │
│  • Scene context         │
│  • Relevant tags         │
└──────────┬───────────────┘
           │
           ↓
    Combined Results
```

## Geographic Clustering

```
All Active Reports
      │
      ↓
┌─────────────────────────────────┐
│  Filter by Category             │
│  (e.g., ROAD_DAMAGE)           │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  For each unprocessed report:   │
│                                  │
│  1. Mark as processed           │
│  2. Create new cluster          │
│  3. Find nearby reports         │
│     (within 100m radius)        │
│  4. Same category only          │
│  5. Add to cluster              │
│  6. Mark those as processed     │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  Calculate Cluster Properties:  │
│                                  │
│  • Centroid (average lat/lng)   │
│  • Report count                 │
│  • Priority distribution        │
│  • Age of reports               │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│  Sort clusters by:              │
│  • Count (descending)           │
│  • Priority level               │
│  • Age                          │
└─────────────┬───────────────────┘
              │
              ↓
    Return to Frontend
    for Map Display
```

## Authentication Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────┐
│  Choose Auth Method:         │
│  • Email/Password            │
│  • Google Sign-In            │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Firebase Authentication     │
│  • Validate credentials      │
│  • Generate ID token         │
│  • Set custom claims (role)  │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Frontend receives:          │
│  • ID Token                  │
│  • User profile              │
│  • Refresh token             │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Store in:                   │
│  • Memory (Zustand)          │
│  • localStorage (token)      │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  For each API call:          │
│  • Add Bearer token header   │
│  • Backend verifies token    │
│  • Extract user info         │
│  • Check permissions         │
└──────────────────────────────┘
```

## Real-time Update Flow

```
Authority Updates Report Status
            │
            ↓
┌───────────────────────────┐
│  PATCH /api/reports/:id   │
│  • Verify authority role  │
│  • Validate new status    │
└───────────┬───────────────┘
            │
            ↓
┌───────────────────────────┐
│  Update Firestore         │
│  • Change status field    │
│  • Add timestamp          │
│  • Add notes if provided  │
└───────────┬───────────────┘
            │
            ↓
┌───────────────────────────┐
│  Firestore Triggers       │
│  • onUpdate listener      │
│  • Propagate changes      │
└───────────┬───────────────┘
            │
            ├──────────────────────────┐
            │                          │
            ↓                          ↓
┌───────────────────┐      ┌──────────────────┐
│  Citizen's        │      │  Dashboard       │
│  Dashboard        │      │  (All users)     │
│  • Status badge   │      │  • Stats update  │
│  • Timeline       │      │  • Charts update │
└───────────────────┘      └──────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│         Developer Machine                    │
│                                              │
│  1. Code changes                            │
│  2. Run tests                               │
│  3. Build locally                           │
│  4. Execute: ./deploy.sh                    │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│        Google Cloud Build                    │
│                                              │
│  Backend:                                   │
│  • Build Docker image                       │
│  • Push to Container Registry               │
│                                              │
│  Frontend:                                  │
│  • npm run build                            │
│  • Optimize assets                          │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────┴────────┐
          ↓                 ↓
┌──────────────────┐  ┌─────────────────────┐
│   Cloud Run      │  │  Firebase Hosting   │
│                  │  │                     │
│  • Deploy image  │  │  • Deploy static    │
│  • Auto-scale    │  │  • Global CDN       │
│  • Health check  │  │  • SSL/TLS         │
└──────────────────┘  └─────────────────────┘
          │                 │
          └────────┬────────┘
                   ↓
┌─────────────────────────────────────────────┐
│           Production Services                │
│                                              │
│  • Firestore (data)                         │
│  • Cloud Storage (images)                   │
│  • BigQuery (analytics)                     │
│  • Firebase Auth (users)                    │
└─────────────────────────────────────────────┘
```

## Cost & Scaling Model

```
Traffic Level:    Low      Medium     High      Very High
Users/month:     1,000     10,000    100,000    1,000,000
                   │          │          │           │
                   ↓          ↓          ↓           ↓
┌──────────────────────────────────────────────────────┐
│  Cloud Run                                           │
│  Instances:      0-2       2-10      10-50      50-500│
│  Cost/month:    $5-10     $20-50   $100-300  $500-2k │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│  Firebase (Firestore + Storage + Auth)               │
│  Reads:         50k       500k       5M         50M  │
│  Cost/month:    FREE      $10       $50        $200  │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│  AI APIs (Gemini + Vision)                           │
│  Requests:      1k        10k       100k        1M   │
│  Cost/month:    $10       $50       $300       $2k   │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│  BigQuery                                            │
│  Queries:       100       1k        10k         100k │
│  Cost/month:    FREE      $5        $20        $100  │
└──────────────────────────────────────────────────────┘
                   │          │          │           │
                   ↓          ↓          ↓           ↓
Total Cost:     ~$15-20   ~$85-115  ~$470-670  ~$2.8k-4.3k
```

---

**Note**: All diagrams are simplified representations. Actual implementation may include additional components and complexity.
