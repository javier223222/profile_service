import { InputSanitizer } from '../../../src/infrastructure/validation/InputSanitizer';

describe('InputSanitizer', () => {
    describe('sanitizeString', () => {
        it('should trim whitespace', () => {
            expect(InputSanitizer.sanitizeString('  hello world  ')).toBe('hello world');
        });

        it('should remove HTML tags', () => {
            expect(InputSanitizer.sanitizeString('hello <script>alert("xss")</script> world')).toBe('hello scriptalert(xss)/script world');
        });

        it('should limit length', () => {
            const longString = 'a'.repeat(300);
            expect(InputSanitizer.sanitizeString(longString, 100)).toHaveLength(100);
        });

        it('should handle non-string input', () => {
            expect(InputSanitizer.sanitizeString(123 as any)).toBe('');
            expect(InputSanitizer.sanitizeString(null as any)).toBe('');
            expect(InputSanitizer.sanitizeString(undefined as any)).toBe('');
        });
    });

    describe('normalizeSeniority', () => {
        it('should normalize common variations', () => {
            expect(InputSanitizer.normalizeSeniority('jr')).toBe('Junior');
            expect(InputSanitizer.normalizeSeniority('junior')).toBe('Junior');
            expect(InputSanitizer.normalizeSeniority('sr')).toBe('Senior');
            expect(InputSanitizer.normalizeSeniority('senior')).toBe('Senior');
            expect(InputSanitizer.normalizeSeniority('mid')).toBe('Mid');
            expect(InputSanitizer.normalizeSeniority('middle')).toBe('Mid');
            expect(InputSanitizer.normalizeSeniority('lead')).toBe('Lead');
            expect(InputSanitizer.normalizeSeniority('principal')).toBe('Principal');
        });

        it('should handle case insensitive input', () => {
            expect(InputSanitizer.normalizeSeniority('JUNIOR')).toBe('Junior');
            expect(InputSanitizer.normalizeSeniority('Senior')).toBe('Senior');
            expect(InputSanitizer.normalizeSeniority('MID')).toBe('Mid');
        });

        it('should return original for unknown values', () => {
            expect(InputSanitizer.normalizeSeniority('Expert')).toBe('Expert');
            expect(InputSanitizer.normalizeSeniority('Beginner')).toBe('Beginner');
        });

        it('should handle non-string input', () => {
            expect(InputSanitizer.normalizeSeniority(123 as any)).toBe('');
            expect(InputSanitizer.normalizeSeniority(null as any)).toBe('');
        });
    });

    describe('normalizeSpecialization', () => {
        it('should normalize common variations', () => {
            expect(InputSanitizer.normalizeSpecialization('fe')).toBe('Frontend');
            expect(InputSanitizer.normalizeSpecialization('frontend')).toBe('Frontend');
            expect(InputSanitizer.normalizeSpecialization('front-end')).toBe('Frontend');
            expect(InputSanitizer.normalizeSpecialization('be')).toBe('Backend');
            expect(InputSanitizer.normalizeSpecialization('backend')).toBe('Backend');
            expect(InputSanitizer.normalizeSpecialization('back-end')).toBe('Backend');
            expect(InputSanitizer.normalizeSpecialization('fullstack')).toBe('Full Stack');
            expect(InputSanitizer.normalizeSpecialization('full-stack')).toBe('Full Stack');
            expect(InputSanitizer.normalizeSpecialization('devops')).toBe('DevOps');
            expect(InputSanitizer.normalizeSpecialization('data')).toBe('Data Science');
            expect(InputSanitizer.normalizeSpecialization('datascience')).toBe('Data Science');
            expect(InputSanitizer.normalizeSpecialization('data-science')).toBe('Data Science');
            expect(InputSanitizer.normalizeSpecialization('qa')).toBe('QA');
            expect(InputSanitizer.normalizeSpecialization('testing')).toBe('QA');
            expect(InputSanitizer.normalizeSpecialization('ux')).toBe('UX/UI');
            expect(InputSanitizer.normalizeSpecialization('ui')).toBe('UX/UI');
            expect(InputSanitizer.normalizeSpecialization('design')).toBe('UX/UI');
        });

        it('should handle case insensitive input', () => {
            expect(InputSanitizer.normalizeSpecialization('FRONTEND')).toBe('Frontend');
            expect(InputSanitizer.normalizeSpecialization('Backend')).toBe('Backend');
        });

        it('should return original for unknown values', () => {
            expect(InputSanitizer.normalizeSpecialization('AI')).toBe('AI');
            expect(InputSanitizer.normalizeSpecialization('Blockchain')).toBe('Blockchain');
        });
    });

    describe('sanitizeUserId', () => {
        it('should remove invalid characters', () => {
            expect(InputSanitizer.sanitizeUserId('user@123')).toBe('user123');
            expect(InputSanitizer.sanitizeUserId('user 123')).toBe('user123');
            expect(InputSanitizer.sanitizeUserId('user#$%123')).toBe('user123');
        });

        it('should preserve valid characters', () => {
            expect(InputSanitizer.sanitizeUserId('user_123')).toBe('user_123');
            expect(InputSanitizer.sanitizeUserId('user-123')).toBe('user-123');
            expect(InputSanitizer.sanitizeUserId('User123')).toBe('user123');
        });

        it('should limit length', () => {
            const longUserId = 'a'.repeat(100);
            expect(InputSanitizer.sanitizeUserId(longUserId)).toHaveLength(50);
        });

        it('should handle non-string input', () => {
            expect(InputSanitizer.sanitizeUserId(123 as any)).toBe('');
        });
    });

    describe('sanitizeDomain', () => {
        it('should normalize domain', () => {
            expect(InputSanitizer.sanitizeDomain('ALGORITHM')).toBe('algorithm');
            expect(InputSanitizer.sanitizeDomain('Data-Science')).toBe('data-science');
            expect(InputSanitizer.sanitizeDomain('  frontend  ')).toBe('frontend');
        });

        it('should remove invalid characters', () => {
            expect(InputSanitizer.sanitizeDomain('algo123rithm')).toBe('algorithm');
            expect(InputSanitizer.sanitizeDomain('front@end')).toBe('frontend');
        });

        it('should limit length', () => {
            const longDomain = 'a'.repeat(50);
            expect(InputSanitizer.sanitizeDomain(longDomain)).toHaveLength(30);
        });
    });
});
