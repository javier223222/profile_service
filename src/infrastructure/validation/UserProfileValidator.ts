export class UserProfileValidator {
    // Validación de formato de userId
    static validateUserId(userId: string): { isValid: boolean; error?: string } {
        if (!userId || typeof userId !== 'string') {
            return { isValid: false, error: 'User ID is required and must be a string' };
        }
        
        if (userId.length < 3 || userId.length > 50) {
            return { isValid: false, error: 'User ID must be between 3 and 50 characters' };
        }
        
        const userIdPattern = /^[a-zA-Z0-9_-]+$/;
        if (!userIdPattern.test(userId)) {
            return { isValid: false, error: 'User ID can only contain letters, numbers, underscores and hyphens' };
        }
        
        return { isValid: true };
    }
    
    // Validación de seniority
    static validateSeniority(seniority: string): { isValid: boolean; error?: string } {
        const allowedSeniorities = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
        
        if (!allowedSeniorities.includes(seniority)) {
            return { 
                isValid: false, 
                error: `Seniority must be one of: ${allowedSeniorities.join(', ')}` 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de specialization
    static validateSpecialization(specialization: string): { isValid: boolean; error?: string } {
        const allowedSpecializations = [
            'Frontend', 'Backend', 'Full Stack', 'DevOps', 
            'Mobile', 'Data Science', 'QA', 'UX/UI', 'General'
        ];
        
        if (!allowedSpecializations.includes(specialization)) {
            return { 
                isValid: false, 
                error: `Specialization must be one of: ${allowedSpecializations.join(', ')}` 
            };
        }
        
        return { isValid: true };
    }
    
    // Validación de puntos
    static validatePoints(points: number): { isValid: boolean; error?: string } {
        if (typeof points !== 'number') {
            return { isValid: false, error: 'Points must be a number' };
        }
        
        if (!Number.isInteger(points)) {
            return { isValid: false, error: 'Points must be an integer' };
        }
        
        if (points < 0) {
            return { isValid: false, error: 'Points cannot be negative' };
        }
        
        if (points > 1000) {
            return { isValid: false, error: 'Points cannot exceed 1000 per operation' };
        }
        
        return { isValid: true };
    }
    
    // Validación de dominio
    static validateDomain(domain: string): { isValid: boolean; error?: string } {
        const allowedDomains = [
            'algorithm', 'frontend', 'backend', 'mobile', 
            'devops', 'data-science', 'interview', 'general',
            'testing', 'design', 'leadership'
        ];
        
        if (!allowedDomains.includes(domain.toLowerCase())) {
            return { 
                isValid: false, 
                error: `Domain must be one of: ${allowedDomains.join(', ')}` 
            };
        }
        
        return { isValid: true };
    }
}
