export const ValidationConfig = {
    // Configuración de límites de puntos por dominio
    DOMAIN_POINT_LIMITS: {
        'algorithm': { min: 1, max: 100 },
        'interview': { min: 5, max: 200 },
        'frontend': { min: 1, max: 75 },
        'backend': { min: 1, max: 75 },
        'mobile': { min: 1, max: 75 },
        'devops': { min: 1, max: 50 },
        'data-science': { min: 5, max: 150 },
        'testing': { min: 1, max: 50 },
        'design': { min: 1, max: 50 },
        'leadership': { min: 5, max: 100 },
        'general': { min: 1, max: 50 }
    },

    // Configuración de seniorities permitidos
    ALLOWED_SENIORITIES: ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'],

    // Configuración de especializaciones permitidas
    ALLOWED_SPECIALIZATIONS: [
        'Frontend', 'Backend', 'Full Stack', 'DevOps', 
        'Mobile', 'Data Science', 'QA', 'UX/UI', 'General'
    ],

    // Configuración de dominios permitidos
    ALLOWED_DOMAINS: [
        'algorithm', 'frontend', 'backend', 'mobile', 
        'devops', 'data-science', 'interview', 'general',
        'testing', 'design', 'leadership'
    ],

    // Configuración de sources de puntos permitidos
    ALLOWED_POINT_SOURCES: [
        'challenge_completed',
        'quiz_passed',
        'project_submitted',
        'interview_practice',
        'daily_login',
        'streak_bonus',
        'peer_review',
        'mentor_session',
        'course_completed',
        'certification_earned',
        'manual_adjustment'
    ],

    // Configuración de dominios permitidos para avatares
    ALLOWED_AVATAR_DOMAINS: [
        'res.cloudinary.com',
        'gravatar.com',
        'teching.tech',
        'avatars.githubusercontent.com',
        'secure.gravatar.com',
        'images.unsplash.com'
    ],

    // Configuración de límites generales
    LIMITS: {
        USER_ID_MIN_LENGTH: 3,
        USER_ID_MAX_LENGTH: 50,
        MAX_POINTS_PER_OPERATION: 1000,
        MAX_STREAK_DAYS: 365,
        MAX_PAST_ACTIVITY_DAYS: 90,
        MAX_DATE_RANGE_DAYS: 365
    },

    // Configuración de rate limiting
    RATE_LIMITS: {
        DAILY_POINTS_LIMIT: 1000,
        HOURLY_POINTS_LIMIT: 100
    },

    // Configuración de logging
    LOGGING: {
        ENABLE_VALIDATION_WARNINGS: true,
        ENABLE_METRICS_LOGGING: true,
        LOG_SANITIZATION_ACTIONS: false
    }
};
