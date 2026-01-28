# CivicLens API Documentation

## Base URL
- Development: `http://localhost:8080/api`
- Production: `https://your-cloud-run-url/api`

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T12:00:00.000Z"
}
```

---

### Authentication

#### POST /api/auth/verify
Verify Firebase ID token.

**Request Body:**
```json
{
  "token": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

---

### Reports

#### POST /api/reports
Submit a new civic issue report.

**Authentication:** Required

**Request Body:**
```json
{
  "description": "Large pothole on Main Street causing traffic issues",
  "category": "ROAD_DAMAGE",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, City, State"
  },
  "images": ["base64-encoded-image-1", "base64-encoded-image-2"]
}
```

**Response:**
```json
{
  "success": true,
  "reportId": "uuid",
  "report": {
    "id": "uuid",
    "description": "...",
    "category": "ROAD_DAMAGE",
    "priority": "HIGH",
    "status": "SUBMITTED",
    "location": {...},
    "images": ["https://..."],
    "aiSummary": "AI-generated summary",
    "suggestedActions": ["Action 1", "Action 2"],
    "potentialDuplicates": [],
    "createdAt": "2026-01-28T12:00:00.000Z"
  }
}
```

**Categories:**
- `ROAD_DAMAGE` - Potholes, cracks, damaged roads
- `SANITATION` - Garbage, cleanliness, waste management
- `STREET_LIGHTS` - Broken lights, outages
- `WATER_SUPPLY` - Leaks, water quality, supply issues
- `TRAFFIC` - Signals, congestion, road safety
- `PUBLIC_SAFETY` - Hazards, emergencies, safety risks
- `PARKS` - Maintenance, vandalism, park facilities
- `OTHER` - Other civic issues

**Priority Levels:**
- `CRITICAL` - Immediate danger to life/property
- `HIGH` - Significant impact, needs urgent attention
- `MEDIUM` - Moderate issue, should be addressed soon
- `LOW` - Minor inconvenience, low urgency

#### GET /api/reports
Fetch all reports with optional filters.

**Query Parameters:**
- `status` - Filter by status (SUBMITTED, VERIFIED, IN_PROGRESS, RESOLVED, CLOSED)
- `category` - Filter by category
- `startDate` - Filter by date range (ISO 8601)
- `endDate` - Filter by date range (ISO 8601)
- `limit` - Number of results (default: 50, max: 100)

**Response:**
```json
{
  "reports": [...],
  "count": 25
}
```

#### GET /api/reports/:id
Get details of a specific report.

**Response:**
```json
{
  "id": "uuid",
  "description": "...",
  "category": "ROAD_DAMAGE",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "location": {...},
  "images": [...],
  "aiSummary": "...",
  "suggestedActions": [...],
  "potentialDuplicates": [...],
  "notes": [...],
  "createdAt": "2026-01-28T12:00:00.000Z",
  "updatedAt": "2026-01-28T13:00:00.000Z"
}
```

#### PATCH /api/reports/:id/status
Update report status (authorities only).

**Authentication:** Required (authority/admin role)

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Crew assigned to fix the pothole"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report updated successfully"
}
```

#### GET /api/reports/clusters/all
Get clustered reports for map visualization.

**Query Parameters:**
- `category` - Filter by category (optional)

**Response:**
```json
{
  "clusters": [
    {
      "centroid": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "reports": [...],
      "category": "ROAD_DAMAGE",
      "count": 5
    }
  ],
  "totalReports": 25
}
```

---

### Analytics

#### GET /api/analytics/summary
Get summary statistics (requires authority/admin role).

**Authentication:** Required (authority/admin)

**Response:**
```json
{
  "summary": {
    "total_reports": 150,
    "pending": 25,
    "in_progress": 30,
    "resolved": 85,
    "critical": 5,
    "avg_resolution_hours": 24.5,
    "last_report_time": "2026-01-28T12:00:00.000Z"
  }
}
```

#### GET /api/analytics/trends
Get category-wise trends (requires authority/admin role).

**Authentication:** Required (authority/admin)

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)

**Response:**
```json
{
  "trends": [
    {
      "category": "ROAD_DAMAGE",
      "total_reports": 45,
      "avg_resolution_hours": 18.5,
      "resolved_count": 35,
      "critical_count": 2
    }
  ]
}
```

#### GET /api/analytics/timeseries
Get time-series data for charts (requires authority/admin role).

**Authentication:** Required (authority/admin)

**Query Parameters:**
- `days` - Number of days (default: 30)

**Response:**
```json
{
  "timeseries": [
    {
      "date": "2026-01-28",
      "category": "ROAD_DAMAGE",
      "count": 5,
      "avg_priority_score": 7.2
    }
  ]
}
```

#### GET /api/analytics/heatmap
Get location heatmap data (requires authority/admin role).

**Authentication:** Required (authority/admin)

**Query Parameters:**
- `category` - Filter by category (optional)
- `days` - Number of days (default: 30)

**Response:**
```json
{
  "heatmap": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "category": "ROAD_DAMAGE",
      "priority": "HIGH",
      "frequency": 5
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden - Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

---

## Image Upload Guidelines

- **Format**: JPEG, PNG
- **Max Size**: 10 MB per image
- **Max Count**: 5 images per report
- **Encoding**: Base64
- **Safety**: All images are checked for inappropriate content

---

## AI Features

### Text Analysis
- Automatic category detection
- Priority assignment
- Urgency scoring (0-10)
- Summary generation
- Suggested actions for authorities

### Image Analysis
- Content verification
- Safety checks
- Visual evidence description
- Label detection

### Duplicate Detection
- Semantic similarity analysis
- Geographic proximity clustering
- Smart duplicate identification

---

## WebSocket Support (Future)

Real-time updates for report status changes will be available via Firebase Realtime Database subscriptions.

---

## Support

For API issues or questions:
- GitHub Issues: [repository-url]
- Email: support@civiclens.example.com
