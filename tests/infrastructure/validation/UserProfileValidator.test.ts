import { UserProfileValidator } from '../../../src/infrastructure/validation/UserProfileValidator';

describe('UserProfileValidator', () => {
    describe('validateUserId', () => {
        it('should validate correct user IDs', () => {
            const validUserIds = ['user123', 'test_user', 'user-456', 'a'.repeat(20)];
            
            validUserIds.forEach(userId => {
                const result = UserProfileValidator.validateUserId(userId);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should reject invalid user IDs', () => {
            const invalidUserIds = [
                '', // empty
                'ab', // too short
                'a'.repeat(51), // too long
                'user@123', // invalid characters
                'user 123', // spaces
                'user#123', // special characters
                null as any,
                undefined as any,
                123 as any
            ];

            invalidUserIds.forEach(userId => {
                const result = UserProfileValidator.validateUserId(userId);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });
    });

    describe('validateSeniority', () => {
        it('should validate allowed seniorities', () => {
            const validSeniorities = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
            
            validSeniorities.forEach(seniority => {
                const result = UserProfileValidator.validateSeniority(seniority);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should reject invalid seniorities', () => {
            const invalidSeniorities = ['junior', 'SENIOR', 'Beginner', 'Expert', '', 'Jr.'];

            invalidSeniorities.forEach(seniority => {
                const result = UserProfileValidator.validateSeniority(seniority);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });
    });

    describe('validateSpecialization', () => {
        it('should validate allowed specializations', () => {
            const validSpecializations = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data Science', 'QA', 'UX/UI', 'General'];
            
            validSpecializations.forEach(specialization => {
                const result = UserProfileValidator.validateSpecialization(specialization);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should reject invalid specializations', () => {
            const invalidSpecializations = ['frontend', 'BackEnd', 'ML', 'AI', '', 'React Developer'];

            invalidSpecializations.forEach(specialization => {
                const result = UserProfileValidator.validateSpecialization(specialization);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });
    });

    describe('validatePoints', () => {
        it('should validate correct points', () => {
            const validPoints = [1, 50, 100, 500, 1000];
            
            validPoints.forEach(points => {
                const result = UserProfileValidator.validatePoints(points);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should reject invalid points', () => {
            const invalidPoints = [
                -1, // negative
                0, // zero
                1001, // too high
                1.5, // decimal
                '100' as any, // string
                null as any,
                undefined as any
            ];

            invalidPoints.forEach(points => {
                const result = UserProfileValidator.validatePoints(points);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });
    });

    describe('validateDomain', () => {
        it('should validate allowed domains', () => {
            const validDomains = ['algorithm', 'frontend', 'backend', 'mobile', 'devops', 'data-science', 'interview', 'general', 'testing', 'design', 'leadership'];
            
            validDomains.forEach(domain => {
                const result = UserProfileValidator.validateDomain(domain);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should validate domains case-insensitively', () => {
            const validDomains = ['ALGORITHM', 'Frontend', 'BACKEND'];
            
            validDomains.forEach(domain => {
                const result = UserProfileValidator.validateDomain(domain);
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should reject invalid domains', () => {
            const invalidDomains = ['javascript', 'python', 'web', '', 'machine-learning'];

            invalidDomains.forEach(domain => {
                const result = UserProfileValidator.validateDomain(domain);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });
    });
});
