# 📚 Documentación de Endpoints - Profile Service API

**URL Base:** `https://teching.tech/profile/`  
**Versión:** 1.0.0  
**Autenticación:** JWT Token requerido  
**Fecha:** 27 de Julio, 2025

---

## 🔐 Autenticación

Todos los endpoints requieren un token JWT válido en el header `Authorization`:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Headers Obligatorios
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

---

## 🚀 Funcionalidad de Auto-Creación de Usuarios

⚠️ **IMPORTANTE:** Todos los endpoints GET crean automáticamente el usuario si no existe con valores por defecto:
- **Seniority:** "Junior"
- **Specialization:** "General"
- **Puntos:** 0
- **Nivel:** 1
- **Streak:** 0

---

## 📋 Lista Completa de Endpoints

### 1. 👤 Gestión de Perfil de Usuario

#### **GET** Obtener Perfil de Usuario
```http
GET https://teching.tech/profile/api/users/{userId}/profile
```

**Parámetros de Ruta:**
- `userId` (string): ID único del usuario

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "seniority": "Senior",
    "specialization": "Frontend",
    "currentStreakDays": 7,
    "pointsCurrent": 1250,
    "level": 3,
    "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg"
  }
}
```

**Códigos de Error:**
- `401` - Token JWT inválido o expirado
- `500` - Error interno del servidor

---

#### **POST** Crear Perfil de Usuario
```http
POST https://teching.tech/profile/api/users/{userId}/profile
```

**Parámetros de Ruta:**
- `userId` (string): ID único del usuario

**Body (JSON):**
```json
{
  "seniority": "Senior",
  "specialization": "Backend",
  "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg"
}
```

**Ejemplo de Request:**
```bash
curl -X POST "https://teching.tech/profile/api/users/user123/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "seniority": "Senior",
    "specialization": "Backend"
  }'
```

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "seniority": "Senior",
    "specialization": "Backend",
    "currentStreakDays": 0,
    "pointsCurrent": 0,
    "level": 1,
    "avatarUrl": null
  }
}
```

**Validaciones:**
- `seniority`: Debe ser uno de: Junior, Mid, Senior, Lead, Principal
- `specialization`: Debe ser uno de: Frontend, Backend, Full Stack, DevOps, Mobile, Data Science, QA, UX/UI, General

**Códigos de Error:**
- `400` - Datos de entrada inválidos
- `401` - Token JWT inválido
- `409` - El perfil ya existe

---

#### **PUT** Actualizar Perfil de Usuario
```http
PUT https://teching.tech/profile/api/users/{userId}/profile
```

**Body (JSON):**
```json
{
  "seniority": "Lead",
  "specialization": "Full Stack"
}
```

**Ejemplo de Request:**
```bash
curl -X PUT "https://teching.tech/profile/api/users/user123/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "seniority": "Lead",
    "specialization": "Full Stack"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "seniority": "Lead",
    "specialization": "Full Stack",
    "currentStreakDays": 7,
    "pointsCurrent": 1250,
    "level": 3,
    "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg"
  }
}
```

---

#### **DELETE** Eliminar Perfil de Usuario
```http
DELETE https://teching.tech/profile/api/users/{userId}/profile
```

**Ejemplo de Request:**
```bash
curl -X DELETE "https://teching.tech/profile/api/users/user123/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "User profile deleted successfully"
}
```

---

### 2. 📊 Progreso y Estadísticas

#### **GET** Obtener Progreso Semanal
```http
GET https://teching.tech/profile/api/users/{userId}/weekly-progress
```

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/weekly-progress" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "weekStartDate": "2025-07-21T00:00:00.000Z",
    "completedDays": [true, true, false, true, false, false, false],
    "totalActiveDays": 3,
    "currentStreak": 1
  }
}
```

**Interpretación de `completedDays`:**
- Array de 7 elementos [Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo]
- `true` = día completado, `false` = día no completado

---

#### **GET** Obtener Estadísticas de Usuario
```http
GET https://teching.tech/profile/api/users/{userId}/stats
```

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/stats" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "currentStreakDays": 7,
    "bestStreak": 15,
    "pointsCurrent": 1250,
    "pointsToNextLevel": 750,
    "level": 3,
    "totalActiveDays": 45,
    "thisWeekActiveDays": 4,
    "averagePointsPerDay": 27.8
  }
}
```

---

#### **GET** Dashboard Completo
```http
GET https://teching.tech/profile/api/users/{userId}/dashboard
```

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/dashboard" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "user123",
      "seniority": "Senior",
      "specialization": "Frontend",
      "currentStreakDays": 7,
      "pointsCurrent": 1250,
      "level": 3,
      "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg"
    },
    "weeklyProgress": {
      "weekStartDate": "2025-07-21T00:00:00.000Z",
      "completedDays": [true, true, false, true, false, false, false],
      "totalActiveDays": 3,
      "currentStreak": 1
    },
    "stats": {
      "currentStreakDays": 7,
      "bestStreak": 15,
      "pointsCurrent": 1250,
      "pointsToNextLevel": 750,
      "level": 3,
      "totalActiveDays": 45,
      "thisWeekActiveDays": 4,
      "averagePointsPerDay": 27.8
    }
  }
}
```

---

### 3. 🎯 Gestión de Puntos

#### **POST** Agregar Puntos
```http
POST https://teching.tech/profile/api/users/{userId}/points
```

**Body (JSON):**
```json
{
  "points": 50,
  "domain": "algorithm",
  "source": "challenge_completed",
  "sessionId": "session_abc123",
  "sourceService": "challenge-service"
}
```

**Ejemplo de Request:**
```bash
curl -X POST "https://teching.tech/profile/api/users/user123/points" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "points": 50,
    "domain": "algorithm",
    "source": "challenge_completed"
  }'
```

**Parámetros del Body:**
- `points` (number, obligatorio): Puntos a agregar (1-1000)
- `domain` (string, obligatorio): Dominio de la actividad
- `source` (string, opcional): Fuente de los puntos
- `sessionId` (string, opcional): ID de la sesión
- `sourceService` (string, opcional): Servicio que otorga los puntos

**Dominios permitidos:**
- `algorithm`, `frontend`, `backend`, `mobile`, `devops`, `data-science`, `interview`, `general`, `testing`, `design`, `leadership`

**Sources permitidos:**
- `challenge_completed`, `quiz_passed`, `project_submitted`, `interview_practice`, `daily_login`, `streak_bonus`, `peer_review`, `mentor_session`, `course_completed`, `certification_earned`, `manual_adjustment`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "pointsAdded": 50,
    "totalPoints": 1300,
    "previousLevel": 3,
    "newLevel": 3,
    "leveledUp": false
  }
}
```

**Códigos de Error:**
- `400` - Puntos inválidos o dominio no permitido
- `401` - Token JWT inválido

---

### 4. 🏆 Sistema de Niveles

#### **GET** Obtener Reglas de Nivel
```http
GET https://teching.tech/profile/api/level-rules
```

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/level-rules" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "minPoints": 0,
      "maxPoints": 499
    },
    {
      "level": 2,
      "minPoints": 500,
      "maxPoints": 999
    },
    {
      "level": 3,
      "minPoints": 1000,
      "maxPoints": 1999
    },
    {
      "level": 4,
      "minPoints": 2000,
      "maxPoints": 3999
    },
    {
      "level": 5,
      "minPoints": 4000,
      "maxPoints": 7999
    }
  ]
}
```

---

### 5. 📊 Analytics Avanzados

#### **GET** Actividades Diarias
```http
GET https://teching.tech/profile/api/users/{userId}/daily-activities
```

**Parámetros de Query (Opcionales):**
- `startDate` (YYYY-MM-DD): Fecha de inicio
- `endDate` (YYYY-MM-DD): Fecha de fin
- `domain` (string): Filtrar por dominio específico

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/daily-activities?startDate=2025-07-01&endDate=2025-07-31&domain=algorithm" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "day": "2025-07-26",
        "events": 5,
        "points": 75,
        "domains": ["algorithm", "frontend"]
      },
      {
        "day": "2025-07-25",
        "events": 3,
        "points": 45,
        "domains": ["algorithm"]
      }
    ],
    "metrics": {
      "totalEvents": 25,
      "totalPoints": 375,
      "averageEventsPerDay": 5.0,
      "averagePointsPerDay": 75.0,
      "activeDays": 5,
      "domainBreakdown": {
        "algorithm": 15,
        "frontend": 10
      }
    }
  }
}
```

---

#### **GET** Métricas Mensuales
```http
GET https://teching.tech/profile/api/users/{userId}/monthly-metrics
```

**Parámetros de Query (Opcionales):**
- `year` (number): Año específico
- `month` (number): Mes específico (1-12)

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/users/user123/monthly-metrics?year=2025&month=7" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "month": 7,
    "year": 2025,
    "totalEvents": 150,
    "totalPoints": 2250,
    "activeDays": 22,
    "averagePointsPerDay": 102.3,
    "weeklyBreakdown": [
      {
        "week": 1,
        "events": 35,
        "points": 525,
        "activeDays": 5
      },
      {
        "week": 2,
        "events": 40,
        "points": 600,
        "activeDays": 6
      },
      {
        "week": 3,
        "events": 38,
        "points": 570,
        "activeDays": 5
      },
      {
        "week": 4,
        "events": 37,
        "points": 555,
        "activeDays": 6
      }
    ],
    "domainBreakdown": {
      "algorithm": 75,
      "frontend": 45,
      "backend": 30
    },
    "trendAnalysis": {
      "comparedToPreviousMonth": {
        "pointsChange": 15.5,
        "eventsChange": 10.2,
        "trend": "improving"
      }
    }
  }
}
```

---

#### **GET** Tabla de Clasificación (Leaderboard)
```http
GET https://teching.tech/profile/api/leaderboard
```

**Parámetros de Query (Opcionales):**
- `timeframe` (string): "week", "month", "all_time" (default: "all_time")
- `limit` (number): Número de usuarios a retornar (default: 20, max: 100)
- `offset` (number): Para paginación (default: 0)

**Ejemplo de Request:**
```bash
curl -X GET "https://teching.tech/profile/api/leaderboard?timeframe=month&limit=10&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user123",
        "seniority": "Senior",
        "specialization": "Frontend",
        "totalPoints": 3500,
        "level": 5,
        "currentStreak": 12,
        "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg",
        "recentActivity": {
          "lastActiveDate": "2025-07-26",
          "pointsThisTimeframe": 850
        }
      },
      {
        "rank": 2,
        "userId": "user456",
        "seniority": "Lead",
        "specialization": "Backend",
        "totalPoints": 3200,
        "level": 5,
        "currentStreak": 8,
        "avatarUrl": null,
        "recentActivity": {
          "lastActiveDate": "2025-07-25",
          "pointsThisTimeframe": 720
        }
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    },
    "userPosition": {
      "rank": 45,
      "pointsToNextRank": 125
    }
  }
}
```

---

### 6. 🖼️ Gestión de Avatar

#### **POST** Subir Avatar (Archivo)
```http
POST https://teching.tech/profile/api/users/{userId}/avatar
```

**Content-Type:** `multipart/form-data`  
**Body:** Form-data con campo `avatar` (archivo de imagen)

**Tipos de archivo permitidos:** JPG, PNG, GIF, WebP  
**Tamaño máximo:** 5MB

**Ejemplo de Request:**
```bash
curl -X POST "https://teching.tech/profile/api/users/user123/avatar" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "avatar=@/path/to/avatar.jpg"
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/profile_avatars/user123.jpg",
    "avatarPublicId": "profile_avatars/user123"
  }
}
```

**Códigos de Error:**
- `400` - Archivo no válido o tamaño excedido
- `401` - Token JWT inválido

---

#### **PUT** Actualizar Avatar por URL
```http
PUT https://teching.tech/profile/api/users/{userId}/avatar
```

**Body (JSON):**
```json
{
  "imageUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/example.jpg"
}
```

**Ejemplo de Request:**
```bash
curl -X PUT "https://teching.tech/profile/api/users/user123/avatar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "imageUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/example.jpg"
  }'
```

**Dominios permitidos para URLs:**
- `res.cloudinary.com`
- `gravatar.com`
- `teching.tech`
- `avatars.githubusercontent.com`
- `secure.gravatar.com`
- `images.unsplash.com`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://res.cloudinary.com/teching/image/upload/v1234567890/example.jpg",
    "avatarPublicId": "profile_avatars/user123"
  }
}
```

---

## 🔄 Códigos de Error Comunes

| Código | Descripción | Causa Común | Acción Recomendada |
|--------|-------------|-------------|-------------------|
| 400 | Bad Request | Parámetros inválidos o faltantes | Verificar formato de datos enviados |
| 401 | Unauthorized | Token JWT inválido o expirado | Renovar token de autenticación |
| 404 | Not Found | Recurso no encontrado | Verificar que el usuario existe |
| 409 | Conflict | Recurso ya existe | Usar PUT para actualizar en lugar de POST |
| 429 | Too Many Requests | Rate limiting activado | Esperar y reintentar con backoff |
| 500 | Internal Server Error | Error del servidor | Reintentar o contactar soporte |

### Estructura de Error Estándar

```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "Información adicional específica"
  }
}
```

### Códigos de Error Específicos

| Código | Descripción |
|--------|-------------|
| `INVALID_USER_ID` | Formato de userId inválido |
| `INVALID_POINTS` | Puntos fuera de rango permitido |
| `INVALID_DOMAIN` | Dominio no permitido |
| `INVALID_SENIORITY` | Seniority no válido |
| `INVALID_SPECIALIZATION` | Specialization no válida |
| `INVALID_AVATAR_URL` | URL de avatar no válida |
| `MISSING_REQUIRED_FIELDS` | Campos obligatorios faltantes |
| `POINTS_RANGE_EXCEEDED` | Puntos exceden límite por dominio |

---

## 📝 Notas de Implementación

### Validaciones Automáticas

1. **Sanitización de Entrada:**
   - UserIds se limpian automáticamente
   - Seniority se normaliza (ej: "jr" → "Junior")
   - Specialization se normaliza (ej: "fe" → "Frontend")

2. **Validaciones de Seguridad:**
   - URLs de avatar deben ser de dominios permitidos
   - Puntos están limitados por dominio
   - Caracteres especiales se filtran automáticamente

3. **Auto-creación de Usuarios:**
   - Los endpoints GET crean usuarios automáticamente si no existen
   - Se usan valores por defecto seguros

### Rate Limiting

- **Puntos por operación:** Máximo 1000 puntos
- **Puntos por hora:** Máximo 100 puntos por usuario
- **Puntos por día:** Máximo 1000 puntos por usuario

### Métricas y Logging

- Todas las validaciones se registran
- Métricas de rendimiento disponibles
- Warnings para datos no estándar (sin bloquear requests)

---

## 🧪 Testing con Postman

### Variables de Entorno Recomendadas

```json
{
  "baseUrl": "https://teching.tech/profile",
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "testUserId": "test_user_123"
}
```

### Collection Structure Sugerida

```
Profile Service API
├── Authentication
│   └── Get JWT Token
├── User Profile Management
│   ├── Get User Profile
│   ├── Create User Profile
│   ├── Update User Profile
│   └── Delete User Profile
├── Progress & Stats
│   ├── Get Weekly Progress
│   ├── Get User Stats
│   └── Get Dashboard
├── Points Management
│   └── Add Points
├── Level System
│   └── Get Level Rules
├── Analytics
│   ├── Get Daily Activities
│   ├── Get Monthly Metrics
│   └── Get Leaderboard
└── Avatar Management
    ├── Upload Avatar File
    └── Update Avatar URL
```

---

## 📞 Soporte y Recursos

**Contacto del Equipo de Backend:**
- Email: backend@teching.tech
- Slack: #profile-service
- Documentación: https://docs.teching.tech/profile-service

**Recursos Adicionales:**
- Postman Collection: [Descargar](https://teching.tech/postman/profile-service-collection.json)
- Environment File: [Descargar](https://teching.tech/postman/profile-service-environment.json)
- OpenAPI Spec: [Ver](https://teching.tech/api-docs/profile-service)

**Monitoreo:**
- Status Page: https://status.teching.tech
- Métricas: https://metrics.teching.tech/profile-service
- Logs: Solicitar acceso al equipo de DevOps

---

**Última actualización:** 27 de Julio, 2025  
**Versión del documento:** 2.0.0  
**Estado del servicio:** ✅ Producción
