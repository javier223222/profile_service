# 📱 Profile Service API - Guía para Desarrollo Móvil

## 🌐 Información General

**URL Base:** `https://teching.tech/profile`  
**Versión:** 1.0.0  
**Autenticación:** JWT Token requerido  

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

Esto significa que puedes hacer requests directamente sin preocuparte por crear el usuario primero.

---

## 📚 Endpoints Disponibles

### 1. 👤 Perfil de Usuario

#### **GET** Obtener Perfil de Usuario
```http
GET https://teching.tech/profile/api/users/{userId}/profile
```

**Parámetros de Ruta:**
- `userId` (string): ID único del usuario

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "userId": "12345",
    "seniority": "Senior",
    "specialization": "Frontend",
    "currentStreakDays": 7,
    "pointsCurrent": 1250,
    "level": 3,
    "avatarUrl": "https://res.cloudinary.com/..."
  }
}
```

**Ejemplo de Implementación:**
```javascript
// React Native / JavaScript
const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`https://teching.tech/profile/api/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};
```

```swift
// Swift / iOS
func getUserProfile(userId: String, token: String) async throws -> UserProfile {
    let url = URL(string: "https://teching.tech/profile/api/users/\(userId)/profile")!
    var request = URLRequest(url: url)
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    let (data, _) = try await URLSession.shared.data(for: request)
    return try JSONDecoder().decode(UserProfile.self, from: data)
}
```

```kotlin
// Kotlin / Android
suspend fun getUserProfile(userId: String, token: String): UserProfile? {
    return try {
        val response = httpClient.get("https://teching.tech/profile/api/users/$userId/profile") {
            headers {
                append("Content-Type", "application/json")
                append("Authorization", "Bearer $token")
            }
        }
        response.body<UserProfileResponse>().data
    } catch (e: Exception) {
        null
    }
}
```

---

#### **POST** Crear Perfil de Usuario
```http
POST https://teching.tech/profile/api/users/{userId}/profile
```

**Body:**
```json
{
  "seniority": "Senior",
  "specialization": "Backend"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "data": {
    "userId": "12345",
    "seniority": "Senior",
    "specialization": "Backend",
    "currentStreakDays": 0,
    "pointsCurrent": 0,
    "level": 1,
    "avatarUrl": null
  }
}
```

---

#### **PUT** Actualizar Perfil de Usuario
```http
PUT https://teching.tech/profile/api/users/{userId}/profile
```

**Body:**
```json
{
  "seniority": "Lead",
  "specialization": "Full Stack"
}
```

---

### 2. 📊 Progreso Semanal

#### **GET** Obtener Progreso Semanal
```http
GET https://teching.tech/profile/api/users/{userId}/weekly-progress
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

### 3. 📈 Estadísticas de Usuario

#### **GET** Obtener Estadísticas Generales
```http
GET https://teching.tech/profile/api/users/{userId}/stats
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

### 4. 🎯 Gestión de Puntos

#### **POST** Agregar Puntos
```http
POST https://teching.tech/profile/api/users/{userId}/points
```

**Body:**
```json
{
  "points": 50,
  "source": "challenge_completed",
  "domain": "algorithm"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "pointsAdded": 50,
    "totalPoints": 1300,
    "newLevel": 3,
    "leveledUp": false
  }
}
```

---

### 5. 🏆 Sistema de Niveles

#### **GET** Obtener Reglas de Nivel
```http
GET https://teching.tech/profile/api/level-rules
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "minPoints": 0,
      "maxPoints": 500
    },
    {
      "level": 2,
      "minPoints": 500,
      "maxPoints": 1000
    },
    {
      "level": 3,
      "minPoints": 1000,
      "maxPoints": 2000
    }
  ]
}
```

---

### 6. 📊 Analytics Avanzados

#### **GET** Actividades Diarias
```http
GET https://teching.tech/profile/api/users/{userId}/daily-activities
```

**Parámetros de Query Opcionales:**
- `startDate` (YYYY-MM-DD): Fecha de inicio
- `endDate` (YYYY-MM-DD): Fecha de fin
- `domain` (string): Filtrar por dominio específico

**Ejemplo:**
```http
GET https://teching.tech/profile/api/users/12345/daily-activities?startDate=2025-07-01&endDate=2025-07-31&domain=algorithm
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
        "domain": "algorithm"
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

**Parámetros de Query Opcionales:**
- `year` (number): Año específico
- `month` (number): Mes específico (1-12)

**Ejemplo:**
```http
GET https://teching.tech/profile/api/users/12345/monthly-metrics?year=2025&month=7
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

**Parámetros de Query Opcionales:**
- `timeframe` (string): "week", "month", "all_time"
- `limit` (number): Número de usuarios a retornar (default: 20)
- `offset` (number): Para paginación (default: 0)

**Ejemplo:**
```http
GET https://teching.tech/profile/api/leaderboard?timeframe=month&limit=10&offset=0
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
        "avatarUrl": "https://...",
        "recentActivity": {
          "lastActiveDate": "2025-07-26",
          "pointsThisTimeframe": 850
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

### 7. 🖼️ Gestión de Avatar

#### **POST** Subir Avatar
```http
POST https://teching.tech/profile/api/users/{userId}/avatar
```

**Content-Type:** `multipart/form-data`  
**Body:** Form-data con campo `avatar` (archivo de imagen)

**Tipos de archivo permitidos:** JPG, PNG, GIF, WebP  
**Tamaño máximo:** 5MB

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://res.cloudinary.com/...",
    "avatarPublicId": "profile_avatars/user123"
  }
}
```

---

#### **PUT** Actualizar Avatar por URL
```http
PUT https://teching.tech/profile/api/users/{userId}/avatar
```

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

---

## 🔄 Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción | Acción Recomendada |
|--------|-------------|-------------------|
| 400 | Bad Request | Verificar parámetros enviados |
| 401 | Unauthorized | Renovar token JWT |
| 404 | Not Found | Recurso no existe |
| 429 | Too Many Requests | Implementar retry con backoff |
| 500 | Internal Server Error | Reintentar o contactar soporte |

### Estructura de Error Estándar

```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "Información adicional"
  }
}
```

---

## 🔄 Mejores Prácticas

### 1. **Manejo de Rate Limiting**
```javascript
const retryWithBackoff = async (fetchFunction, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFunction();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
};
```

### 2. **Cache Local**
```javascript
// Cachear datos del perfil por 5 minutos
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const profileCache = new Map();

const getCachedProfile = (userId) => {
  const cached = profileCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};
```

### 3. **Optimización de Requests**
```javascript
// Cargar datos en paralelo
const loadUserDashboard = async (userId) => {
  const [profile, weeklyProgress, stats] = await Promise.all([
    getUserProfile(userId),
    getWeeklyProgress(userId),
    getUserStats(userId)
  ]);
  
  return { profile, weeklyProgress, stats };
};
```

---

## 📱 Modelos de Datos

### TypeScript / JavaScript
```typescript
interface UserProfile {
  userId: string;
  seniority: string;
  specialization: string;
  currentStreakDays: number;
  pointsCurrent: number;
  level: number;
  avatarUrl: string | null;
}

interface WeeklyProgress {
  weekStartDate: string;
  completedDays: boolean[];
  totalActiveDays: number;
  currentStreak: number;
}

interface UserStats {
  currentStreakDays: number;
  bestStreak: number;
  pointsCurrent: number;
  pointsToNextLevel: number;
  level: number;
  totalActiveDays: number;
  thisWeekActiveDays: number;
  averagePointsPerDay: number;
}
```

### Swift / iOS
```swift
struct UserProfile: Codable {
    let userId: String
    let seniority: String
    let specialization: String
    let currentStreakDays: Int
    let pointsCurrent: Int
    let level: Int
    let avatarUrl: String?
}

struct WeeklyProgress: Codable {
    let weekStartDate: String
    let completedDays: [Bool]
    let totalActiveDays: Int
    let currentStreak: Int
}
```

### Kotlin / Android
```kotlin
data class UserProfile(
    val userId: String,
    val seniority: String,
    val specialization: String,
    val currentStreakDays: Int,
    val pointsCurrent: Int,
    val level: Int,
    val avatarUrl: String?
)

data class WeeklyProgress(
    val weekStartDate: String,
    val completedDays: List<Boolean>,
    val totalActiveDays: Int,
    val currentStreak: Int
)
```

---

## 🧪 Testing

### Endpoints de Prueba
Para testing en desarrollo, puedes usar estos usuarios de ejemplo:

| User ID | Descripción |
|---------|-------------|
| `test_user_1` | Usuario básico con datos mínimos |
| `test_user_2` | Usuario con progreso avanzado |
| `test_user_3` | Usuario nuevo (se creará automáticamente) |

---

## 🆘 Soporte

**Contacto del Equipo de Backend:**
- Email: backend@teching.tech
- Slack: #profile-service
- Documentación: https://docs.teching.tech/profile-service

**Logs y Debugging:**
- Todos los requests se loggean con IDs únicos
- En caso de error 500, proporcionar el timestamp del request

---

## 📋 Checklist de Implementación

### ✅ Tareas Básicas
- [ ] Configurar autenticación JWT
- [ ] Implementar obtención de perfil de usuario
- [ ] Mostrar progreso semanal
- [ ] Implementar subida de avatar
- [ ] Manejar errores 401/403

### ✅ Tareas Avanzadas
- [ ] Implementar analytics de actividades
- [ ] Mostrar leaderboard
- [ ] Cache local de datos
- [ ] Retry automático con backoff
- [ ] Optimización de requests paralelos

### ✅ UX/UI
- [ ] Loading states para requests
- [ ] Error states con retry
- [ ] Offline state handling
- [ ] Pull-to-refresh
- [ ] Skeleton loading

---

**Última actualización:** 27 de Julio, 2025  
**Versión del documento:** 1.0.0
