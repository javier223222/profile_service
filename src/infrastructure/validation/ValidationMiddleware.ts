import { Request, Response, NextFunction } from 'express';
import { UserProfileValidator } from './UserProfileValidator';
import { InputSanitizer } from './InputSanitizer';
import { CrossValidator } from './CrossValidator';
import { ContextualValidator } from './ContextualValidator';

export class ValidationMiddleware {
    // Middleware para validar userId en parámetros (no afecta endpoints existentes)
    static validateUserIdParam = (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        
        // Solo logear warnings, no bloquear requests para mantener compatibilidad
        if (userId) {
            const validation = UserProfileValidator.validateUserId(userId);
            if (!validation.isValid) {
                console.warn(`[VALIDATION WARNING] Invalid userId format: ${userId} - ${validation.error}`);
                // Sanitizar silenciosamente
                req.params.userId = InputSanitizer.sanitizeUserId(userId);
            }
        }
        
        next();
    };
    
    // Middleware para sanitizar datos de perfil (mejora seguridad sin romper funcionalidad)
    static sanitizeProfileData = (req: Request, res: Response, next: NextFunction) => {
        if (req.body.seniority) {
            const normalized = InputSanitizer.normalizeSeniority(req.body.seniority);
            const validation = UserProfileValidator.validateSeniority(normalized);
            
            if (validation.isValid) {
                req.body.seniority = normalized;
            } else {
                console.warn(`[VALIDATION WARNING] Invalid seniority: ${req.body.seniority} - ${validation.error}`);
            }
        }
        
        if (req.body.specialization) {
            const normalized = InputSanitizer.normalizeSpecialization(req.body.specialization);
            const validation = UserProfileValidator.validateSpecialization(normalized);
            
            if (validation.isValid) {
                req.body.specialization = normalized;
            } else {
                console.warn(`[VALIDATION WARNING] Invalid specialization: ${req.body.specialization} - ${validation.error}`);
            }
        }
        
        next();
    };
    
    // Middleware para validar y sanitizar datos de puntos
    static validatePointsData = (req: Request, res: Response, next: NextFunction) => {
        const { points, domain, source } = req.body;
        
        // Validaciones que SÍ pueden bloquear requests por seguridad
        if (points !== undefined) {
            const pointsValidation = UserProfileValidator.validatePoints(points);
            if (!pointsValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: pointsValidation.error,
                    code: 'INVALID_POINTS'
                });
            }
        }
        
        // Sanitizar domain
        if (domain) {
            const sanitizedDomain = InputSanitizer.sanitizeDomain(domain);
            const domainValidation = UserProfileValidator.validateDomain(sanitizedDomain);
            
            if (!domainValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: domainValidation.error,
                    code: 'INVALID_DOMAIN'
                });
            }
            
            // Validación cruzada de puntos y dominio (solo warning)
            const crossValidation = CrossValidator.validatePointsRange(points, sanitizedDomain);
            if (!crossValidation.isValid) {
                console.warn(`[VALIDATION WARNING] Points range validation: ${crossValidation.error}`);
            }
            
            req.body.domain = sanitizedDomain;
        }
        
        // Validar source si está presente
        if (source) {
            const sourceValidation = ContextualValidator.validatePointsSource(source);
            if (!sourceValidation.isValid) {
                console.warn(`[VALIDATION WARNING] Invalid source: ${source} - ${sourceValidation.error}`);
            }
        }
        
        next();
    };
    
    // Middleware para validar parámetros de analytics (mejora, no bloquea)
    static sanitizeAnalyticsQuery = (req: Request, res: Response, next: NextFunction) => {
        const validation = ContextualValidator.validateAnalyticsQuery(req.query);
        
        if (!validation.isValid) {
            console.warn(`[VALIDATION WARNING] Analytics query validation: ${validation.error}`);
        } else if (validation.sanitized) {
            // Aplicar datos sanitizados
            req.query = { ...req.query, ...validation.sanitized };
        }
        
        next();
    };
    
    // Middleware para validar URL de avatar (strict validation for security)
    static validateAvatarUrl = (req: Request, res: Response, next: NextFunction) => {
        const { imageUrl } = req.body;
        
        if (imageUrl) {
            const validation = ContextualValidator.validateAvatarUrl(imageUrl);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: validation.error,
                    code: 'INVALID_AVATAR_URL'
                });
            }
        }
        
        next();
    };
    
    // Middleware de logging para monitoreo
    static logValidationMetrics = (req: Request, res: Response, next: NextFunction) => {
        const startTime = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log(`[VALIDATION METRICS] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        });
        
        next();
    };
}
