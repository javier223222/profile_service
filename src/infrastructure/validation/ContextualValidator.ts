export class ContextualValidator {
    // Validación de URLs de avatar
    static validateAvatarUrl(url: string): { isValid: boolean; error?: string } {
        if (!url || typeof url !== 'string') {
            return { isValid: false, error: 'Avatar URL is required' };
        }
        
        const allowedDomains = [
            'res.cloudinary.com',
            'gravatar.com',
            'teching.tech',
            'avatars.githubusercontent.com',
            'secure.gravatar.com',
            'images.unsplash.com'
        ];
        
        try {
            const urlObj = new URL(url);
            
            // Verificar protocolo HTTPS
            if (urlObj.protocol !== 'https:') {
                return { isValid: false, error: 'Avatar URL must use HTTPS protocol' };
            }
            
            // Verificar dominio permitido
            const isAllowedDomain = allowedDomains.some(domain => 
                urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
            );
            
            if (!isAllowedDomain) {
                return { 
                    isValid: false, 
                    error: `Avatar URL domain not allowed. Allowed domains: ${allowedDomains.join(', ')}` 
                };
            }
            
            // Verificar extensión de archivo
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const hasValidExtension = allowedExtensions.some(ext => 
                urlObj.pathname.toLowerCase().endsWith(ext)
            );
            
            if (!hasValidExtension) {
                return { 
                    isValid: false, 
                    error: `Avatar URL must end with one of: ${allowedExtensions.join(', ')}` 
                };
            }
            
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: 'Invalid URL format' };
        }
    }
    
    // Validación de límites por usuario (rate limiting de negocio)
    static async validateUserPointsLimit(userId: string, pointsToAdd: number, timeframe: 'daily' | 'hourly' = 'daily'): Promise<{ isValid: boolean; error?: string }> {
        const limits = {
            daily: 1000,   // Máximo 1000 puntos por día
            hourly: 100    // Máximo 100 puntos por hora
        };
        
        const maxPoints = limits[timeframe];
        
        if (pointsToAdd > maxPoints) {
            return { 
                isValid: false, 
                error: `Cannot add more than ${maxPoints} points per ${timeframe}` 
            };
        }
        
        // Aquí se implementaría la lógica para verificar puntos acumulados
        // por el usuario en el período de tiempo especificado
        // Para esta implementación inicial, solo validamos el límite por operación
        
        return { isValid: true };
    }
    
    // Validación de source types para puntos
    static validatePointsSource(source: string): { isValid: boolean; error?: string } {
        const allowedSources = [
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
        ];
        
        if (!allowedSources.includes(source)) {
            return { 
                isValid: false, 
                error: `Source must be one of: ${allowedSources.join(', ')}` 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de parámetros de query para analytics
    static validateAnalyticsQuery(params: any): { isValid: boolean; error?: string; sanitized?: any } {
        const sanitized: any = {};
        
        // Validar startDate
        if (params.startDate) {
            const startDate = new Date(params.startDate);
            if (isNaN(startDate.getTime())) {
                return { isValid: false, error: 'Invalid startDate format. Use YYYY-MM-DD' };
            }
            sanitized.startDate = startDate;
        }
        
        // Validar endDate
        if (params.endDate) {
            const endDate = new Date(params.endDate);
            if (isNaN(endDate.getTime())) {
                return { isValid: false, error: 'Invalid endDate format. Use YYYY-MM-DD' };
            }
            sanitized.endDate = endDate;
        }
        
        // Validar rango de fechas
        if (sanitized.startDate && sanitized.endDate) {
            if (sanitized.startDate > sanitized.endDate) {
                return { isValid: false, error: 'startDate cannot be after endDate' };
            }
            
            const daysDiff = (sanitized.endDate.getTime() - sanitized.startDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff > 365) {
                return { isValid: false, error: 'Date range cannot exceed 365 days' };
            }
        }
        
        // Validar domain si está presente
        if (params.domain) {
            const allowedDomains = [
                'algorithm', 'frontend', 'backend', 'mobile', 
                'devops', 'data-science', 'interview', 'general',
                'testing', 'design', 'leadership'
            ];
            
            if (!allowedDomains.includes(params.domain.toLowerCase())) {
                return { 
                    isValid: false, 
                    error: `Domain must be one of: ${allowedDomains.join(', ')}` 
                };
            }
            sanitized.domain = params.domain.toLowerCase();
        }
        
        // Validar limit
        if (params.limit) {
            const limit = parseInt(params.limit);
            if (isNaN(limit) || limit < 1 || limit > 100) {
                return { isValid: false, error: 'Limit must be a number between 1 and 100' };
            }
            sanitized.limit = limit;
        }
        
        // Validar offset
        if (params.offset) {
            const offset = parseInt(params.offset);
            if (isNaN(offset) || offset < 0) {
                return { isValid: false, error: 'Offset must be a non-negative number' };
            }
            sanitized.offset = offset;
        }
        
        return { isValid: true, sanitized };
    }
}
