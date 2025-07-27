export class CrossValidator {
    // Validación de fechas de actividad
    static validateActivityDate(activityDate: Date): { isValid: boolean; error?: string } {
        const now = new Date();
        const maxPastDays = 90; // No más de 90 días en el pasado
        const minDate = new Date(now.getTime() - (maxPastDays * 24 * 60 * 60 * 1000));
        
        if (activityDate < minDate) {
            return { 
                isValid: false, 
                error: `Activity date cannot be more than ${maxPastDays} days in the past` 
            };
        }
        
        if (activityDate > now) {
            return { 
                isValid: false, 
                error: 'Activity date cannot be in the future' 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de rangos de puntos por dominio
    static validatePointsRange(points: number, domain: string): { isValid: boolean; error?: string } {
        const domainLimits: { [key: string]: { min: number; max: number } } = {
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
        };
        
        const limits = domainLimits[domain.toLowerCase()] || domainLimits['general'];
        
        if (points < limits.min || points > limits.max) {
            return { 
                isValid: false, 
                error: `Points for domain '${domain}' must be between ${limits.min} and ${limits.max}` 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de consistencia de level y puntos
    static validateLevelConsistency(level: number, points: number): { isValid: boolean; error?: string } {
        // Reglas de niveles basadas en puntos
        const levelRules = [
            { level: 1, minPoints: 0, maxPoints: 499 },
            { level: 2, minPoints: 500, maxPoints: 999 },
            { level: 3, minPoints: 1000, maxPoints: 1999 },
            { level: 4, minPoints: 2000, maxPoints: 3999 },
            { level: 5, minPoints: 4000, maxPoints: 7999 },
            { level: 6, minPoints: 8000, maxPoints: 15999 },
            { level: 7, minPoints: 16000, maxPoints: 31999 },
            { level: 8, minPoints: 32000, maxPoints: 63999 },
            { level: 9, minPoints: 64000, maxPoints: 127999 },
            { level: 10, minPoints: 128000, maxPoints: Number.MAX_SAFE_INTEGER }
        ];
        
        const expectedLevelRule = levelRules.find(rule => 
            points >= rule.minPoints && points <= rule.maxPoints
        );
        
        if (!expectedLevelRule || expectedLevelRule.level !== level) {
            const expectedLevel = expectedLevelRule ? expectedLevelRule.level : 1;
            return { 
                isValid: false, 
                error: `Level ${level} is inconsistent with points ${points}. Expected level: ${expectedLevel}` 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de streak consistency
    static validateStreakConsistency(currentStreak: number, lastActiveDate: Date | null): { isValid: boolean; error?: string } {
        if (currentStreak > 0 && !lastActiveDate) {
            return { 
                isValid: false, 
                error: 'Cannot have active streak without last active date' 
            };
        }
        
        if (currentStreak > 365) {
            return { 
                isValid: false, 
                error: 'Streak cannot exceed 365 days' 
            };
        }
        
        if (lastActiveDate) {
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Si han pasado más de 2 días, el streak debería ser 0
            if (daysDiff > 2 && currentStreak > 0) {
                return { 
                    isValid: false, 
                    error: 'Streak should be 0 when more than 2 days have passed since last activity' 
                };
            }
        }
        
        return { isValid: true };
    }
}
