# Profile Service API

## Overview

The Profile Service is a microservice designed to manage user profiles, gamification features, and activity tracking for the soft skills platform. It provides comprehensive endpoints for profile management, points tracking, level progression, and daily activity monitoring.

## Features

- User profile CRUD operations
- Gamification system with points and levels
- Daily activity tracking and validation
- Monthly metrics for engagement analysis
- Global leaderboard with social competition
- Streak management and progression tracking
- Weekly progress monitoring
- Avatar image management
- Clean Architecture implementation
- Database integration with PostgreSQL
- Message queue integration with RabbitMQ

### Key Analytics Features

- **Daily Activities**: Real-time validation and progress tracking with domain-specific metrics
- **Monthly Metrics**: Comprehensive engagement analysis with trend comparisons and breakdown by domain/week
- **Leaderboard System**: Social competition features with filtering by timeframe, seniority, and specialization
- **Retention Analytics**: Week-over-week and month-over-month progress tracking for user engagement

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Architecture**: Clean Architecture pattern
- **Message Queue**: RabbitMQ
- **Image Storage**: Cloudinary (for avatar management)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- RabbitMQ server
- Cloudinary account (for image uploads)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/profile_db"
RABBITMQ_URL="amqp://localhost"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
PORT=3000
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio
npx prisma studio
```

### Running the Service

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

#### GET /health

Returns the service health status.

**Response:**
```json
{
  "status": "OK",
  "service": "profile-service",
  "timestamp": "2025-07-24T10:30:00.000Z"
}
```

---

## User Profile Management

### 1. Create User Profile

#### POST /users

Creates a new user profile in the system.

**Request Body:**
```json
{
  "userId": "string",
  "seniority": "string",
  "specialization": "string",
  "avatarUrl": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "pointsCurrent": 0,
    "level": 1,
    "streakBest": 0,
    "currentStreakDays": 0,
    "avatarUrl": null,
    "seniority": "junior",
    "specialization": "frontend",
    "createdAt": "2025-07-24T10:30:00.000Z",
    "updatedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `409`: User already exists

### 2. Get User Profile

#### GET /users/:userId/profile

Retrieves basic user profile information.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "pointsCurrent": 150,
    "level": 2,
    "streakBest": 7,
    "currentStreakDays": 3,
    "avatarUrl": "https://example.com/avatar.jpg",
    "seniority": "junior",
    "specialization": "frontend"
  }
}
```

### 3. Get Complete User Profile

#### GET /users/:userId/complete

Retrieves complete user profile with all related data.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "user123",
      "pointsCurrent": 150,
      "level": 2,
      "streakBest": 7,
      "currentStreakDays": 3,
      "avatarUrl": "https://example.com/avatar.jpg",
      "seniority": "junior",
      "specialization": "frontend"
    },
    "weeklyProgress": {
      "completedDays": [true, true, false, true, false, false, false],
      "currentStreak": 3,
      "totalActiveDays": 15
    },
    "stats": {
      "totalPoints": 150,
      "currentLevel": 2,
      "bestStreak": 7,
      "activeDaysThisWeek": 3
    }
  }
}
```

### 4. Update User Profile

#### PUT /users/:userId

Updates user profile information.

**Parameters:**
- `userId` (path): User identifier

**Request Body:**
```json
{
  "seniority": "string (optional)",
  "specialization": "string (optional)",
  "avatarUrl": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "pointsCurrent": 150,
    "level": 2,
    "seniority": "senior",
    "specialization": "fullstack",
    "updatedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

### 5. Delete User Profile

#### DELETE /users/:userId

Deletes a user profile and all associated data.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "message": "User profile deleted successfully"
}
```

---

## Gamification System

### 6. Add Points to User

#### POST /users/:userId/points/add

Adds points to a user's profile and handles level progression.

**Parameters:**
- `userId` (path): User identifier

**Request Body:**
```json
{
  "points": 50,
  "domain": "softskills",
  "sessionId": "session-123 (optional)",
  "sourceService": "mobile-app (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pointsAdded": 50,
    "totalPoints": 200,
    "previousLevel": 2,
    "currentLevel": 3,
    "leveledUp": true,
    "nextLevelPoints": 300,
    "dailyActivity": {
      "domain": "softskills",
      "events": 1,
      "points": 50,
      "day": "2025-07-24"
    }
  }
}
```

**Validation:**
- Points must be a positive number
- Domain is required
- User must exist

### 7. Get Level Rules

#### GET /levels/rules

Retrieves all level progression rules.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "minPoints": 0,
      "maxPoints": 99
    },
    {
      "level": 2,
      "minPoints": 100,
      "maxPoints": 249
    },
    {
      "level": 3,
      "minPoints": 250,
      "maxPoints": 499
    }
  ]
}
```

---

## Activity Tracking & Analytics

### 8. Get Daily Activities

#### GET /users/:userId/daily-activities

Retrieves user's daily activities with comprehensive metrics for validation and progress tracking.

**Parameters:**
- `userId` (path): User identifier

**Query Parameters:**
- `startDate` (optional): Start date for filtering (ISO string)
- `endDate` (optional): End date for filtering (ISO string) 
- `domain` (optional): Filter by specific domain

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "userId": "user123",
        "day": "2025-07-24T00:00:00.000Z",
        "domain": "softskills",
        "events": 3,
        "points": 75
      },
      {
        "userId": "user123", 
        "day": "2025-07-23T00:00:00.000Z",
        "domain": "technical",
        "events": 2,
        "points": 50
      }
    ],
    "totalDays": 2,
    "totalEvents": 5,
    "totalPoints": 125,
    "averagePointsPerDay": 62.5,
    "mostActiveDay": "2025-07-24T00:00:00.000Z",
    "domains": ["softskills", "technical"]
  }
}
```

### 9. Get Monthly Metrics

#### GET /users/:userId/monthly-metrics

Retrieves comprehensive monthly metrics for engagement and retention analysis.

**Parameters:**
- `userId` (path): User identifier

**Query Parameters:**
- `year` (optional): Target year (defaults to current year)
- `month` (optional): Target month 1-12 (defaults to current month)

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2025,
    "month": 7,
    "totalPoints": 450,
    "totalEvents": 18,
    "activeDays": 12,
    "averagePointsPerDay": 14.52,
    "averagePointsPerActiveDay": 37.5,
    "streakDays": 5,
    "levelProgress": {
      "startLevel": 2,
      "endLevel": 3,
      "leveledUp": true
    },
    "domainBreakdown": [
      {
        "domain": "softskills",
        "points": 300,
        "events": 12,
        "percentage": 66.67
      },
      {
        "domain": "technical",
        "points": 150,
        "events": 6,
        "percentage": 33.33
      }
    ],
    "weeklyBreakdown": [
      {
        "week": 1,
        "points": 120,
        "events": 5,
        "activeDays": 4
      },
      {
        "week": 2,
        "points": 180,
        "events": 7,
        "activeDays": 5
      }
    ],
    "comparisonToPreviousMonth": {
      "pointsChange": 75,
      "pointsChangePercentage": 20.0,
      "activeDaysChange": 3,
      "eventsChange": 4
    }
  }
}
```

### 10. Get Leaderboard

#### GET /leaderboard

Retrieves global leaderboard with filtering options for social competition.

**Query Parameters:**
- `domain` (optional): Filter by specific domain
- `timeframe` (optional): 'all-time' | 'monthly' | 'weekly' (default: 'all-time')
- `limit` (optional): Number of entries (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `seniority` (optional): Filter by seniority level
- `specialization` (optional): Filter by specialization

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "userId": "user123",
        "pointsCurrent": 1250,
        "level": 5,
        "streakBest": 21,
        "currentStreakDays": 7,
        "avatarUrl": "https://example.com/avatar1.jpg",
        "seniority": "senior",
        "specialization": "fullstack",
        "rank": 1,
        "recentActivity": {
          "last7Days": 180,
          "last30Days": 650
        }
      },
      {
        "userId": "user456",
        "pointsCurrent": 980,
        "level": 4,
        "streakBest": 15,
        "currentStreakDays": 3,
        "avatarUrl": null,
        "seniority": "junior",
        "specialization": "frontend",
        "rank": 2,
        "recentActivity": {
          "last7Days": 120,
          "last30Days": 420
        }
      }
    ],
    "totalUsers": 150,
    "currentPage": 1,
    "totalPages": 3,
    "filters": {
      "domain": null,
      "timeframe": "all-time",
      "seniority": null,
      "specialization": null
    }
  }
}
```

### 11. Get User Statistics

#### GET /users/:userId/stats

Retrieves comprehensive user statistics.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 200,
    "currentLevel": 3,
    "bestStreak": 7,
    "currentStreak": 3,
    "activeDaysThisWeek": 4,
    "totalActiveDays": 25,
    "averagePointsPerDay": 8.0,
    "lastActivityDate": "2025-07-24T10:30:00.000Z"
  }
}
```

### 12. Get Weekly Progress

#### GET /users/:userId/weekly-progress

Retrieves user's weekly activity progress.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "weekStartDate": "2025-07-21",
    "completedDays": [true, true, false, true, false, false, false],
    "currentStreak": 3,
    "totalActiveDays": 3,
    "weekProgress": {
      "monday": true,
      "tuesday": true,
      "wednesday": false,
      "thursday": true,
      "friday": false,
      "saturday": false,
      "sunday": false
    }
  }
}
```

### 13. Get Dashboard Data

#### GET /users/:userId/dashboard

Retrieves consolidated dashboard data for mobile applications.

**Parameters:**
- `userId` (path): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "user123",
      "pointsCurrent": 200,
      "level": 3,
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "weeklyProgress": {
      "completedDays": [true, true, false, true, false, false, false],
      "currentStreak": 3
    },
    "stats": {
      "totalPoints": 200,
      "currentLevel": 3,
      "bestStreak": 7,
      "activeDaysThisWeek": 3
    },
    "nextLevel": {
      "level": 4,
      "pointsRequired": 300,
      "pointsToNext": 100,
      "progressPercentage": 66.7
    }
  }
}
```

---

## Avatar Management

### 14. Upload Profile Image

#### POST /users/:userId/avatar/upload

Uploads a new profile image file.

**Parameters:**
- `userId` (path): User identifier

**Request:**
- Content-Type: `multipart/form-data`
- File field: `avatar`
- Supported formats: JPG, PNG, GIF
- Max file size: 5MB

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "avatarUrl": "https://res.cloudinary.com/yourcloud/image/upload/v123/avatar.jpg",
    "avatarPublicId": "profile_images/user123_avatar",
    "message": "Profile image uploaded successfully"
  }
}
```

### 15. Update Profile Image by URL

#### PUT /users/:userId/avatar/url

Updates profile image using an external URL.

**Parameters:**
- `userId` (path): User identifier

**Request Body:**
```json
{
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "avatarUrl": "https://res.cloudinary.com/yourcloud/image/upload/v124/new_avatar.jpg",
    "avatarPublicId": "profile_images/user123_new_avatar",
    "message": "Profile image updated successfully"
  }
}
```

---

## Error Handling

### Standard Error Response

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE (optional)",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found (user/resource not found)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

### Validation Errors

Field validation errors include specific details:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "points",
    "message": "Points must be a positive number",
    "received": -10
  }
}
```

---

## Data Models

### ProfileUser

```typescript
{
  userId: string;
  pointsCurrent: number;
  level: number;
  streakBest: number;
  currentStreakDays: number;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  seniority: string;
  specialization: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### DailyActivity

```typescript
{
  userId: string;
  day: Date;
  domain: string;
  events: number;
  points: number;
}
```

### LevelRule

```typescript
{
  level: number;
  minPoints: number;
  maxPoints: number;
}
```

---

## Architecture

The service follows Clean Architecture principles:

```
src/
├── application/          # Use cases and business logic
│   ├── dto/             # Data transfer objects
│   ├── mappers/         # Data mapping utilities
│   └── use-cases/       # Business use cases
├── domain/              # Business entities and rules
│   ├── entities/        # Domain entities
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Domain services
│   └── value-objects/   # Value objects
├── infrastructure/      # External concerns
│   ├── messaging/       # RabbitMQ integration
│   ├── prisma/         # Database repositories
│   └── repositories/    # Repository implementations
└── interfaces/          # Controllers and routes
    ├── http/           # HTTP controllers and routes
    └── mq/             # Message queue handlers
```

---

## Message Queue Integration

The service integrates with RabbitMQ for processing profile updates from other services:

### Consumed Messages

- **Queue**: `profile.updates`
- **Message Format**:
```json
{
  "userId": "string",
  "action": "update_streak" | "update_points",
  "data": {
    "streak": number,
    "points": number,
    "domain": "string"
  }
}
```

---

## Development

### Running Tests

```bash
npm test
```

### Code Generation

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name
```

### Database Operations

```bash
# Reset database (development only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Open database browser
npx prisma studio
```

---

## Contributing

1. Follow TypeScript best practices
2. Implement comprehensive error handling
3. Add unit tests for new features
4. Update API documentation for endpoint changes
5. Follow Clean Architecture principles

---

## License

This project is part of the Soft Skills Platform microservices architecture.
