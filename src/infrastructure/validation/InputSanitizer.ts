export class InputSanitizer {
    // Sanitización básica de strings
    static sanitizeString(input: string, maxLength: number = 255): string {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()                           // Eliminar espacios
            .replace(/[<>]/g, '')            // Remover posibles tags HTML
            .replace(/[^\w\s-_.@]/g, '')     // Mantener solo caracteres seguros
            .substring(0, maxLength);        // Limitar longitud
    }
    
    // Normalización de seniority
    static normalizeSeniority(seniority: string): string {
        if (typeof seniority !== 'string') return '';
        
        const normalized = seniority.trim().toLowerCase();
        
        // Mapeo de variaciones comunes
        const seniorityMap: { [key: string]: string } = {
            'jr': 'Junior',
            'junior': 'Junior',
            'mid': 'Mid',
            'middle': 'Mid',
            'sr': 'Senior',
            'senior': 'Senior',
            'lead': 'Lead',
            'principal': 'Principal'
        };
        
        return seniorityMap[normalized] || seniority;
    }
    
    // Normalización de specialization
    static normalizeSpecialization(specialization: string): string {
        if (typeof specialization !== 'string') return '';
        
        const normalized = specialization.trim().toLowerCase();
        
        const specializationMap: { [key: string]: string } = {
            'fe': 'Frontend',
            'frontend': 'Frontend',
            'front-end': 'Frontend',
            'be': 'Backend',
            'backend': 'Backend',
            'back-end': 'Backend',
            'fullstack': 'Full Stack',
            'full-stack': 'Full Stack',
            'devops': 'DevOps',
            'mobile': 'Mobile',
            'data': 'Data Science',
            'datascience': 'Data Science',
            'data-science': 'Data Science',
            'qa': 'QA',
            'testing': 'QA',
            'ux': 'UX/UI',
            'ui': 'UX/UI',
            'design': 'UX/UI',
            'general': 'General'
        };
        
        return specializationMap[normalized] || specialization;
    }
    
    // Sanitización de userId
    static sanitizeUserId(userId: string): string {
        if (typeof userId !== 'string') return '';
        
        return userId
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, '')  // Solo alfanumérico, guiones y underscores
            .substring(0, 50);               // Máximo 50 caracteres
    }
    
    // Sanitización de domain
    static sanitizeDomain(domain: string): string {
        if (typeof domain !== 'string') return '';
        
        return domain
            .trim()
            .toLowerCase()
            .replace(/[^a-z-]/g, '')         // Solo letras y guiones
            .substring(0, 30);               // Máximo 30 caracteres
    }
}
