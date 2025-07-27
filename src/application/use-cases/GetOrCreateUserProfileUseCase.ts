import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import ProfileUser from '../../domain/entities/ProfileUser';
import { Points } from '../../domain/value-objects/Points';

export interface GetOrCreateUserProfileRequest {
    userId: string;
    seniority?: string;
    specialization?: string;
    avatarUrl?: string;
}

export class GetOrCreateUserProfileUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(request: GetOrCreateUserProfileRequest | string): Promise<ProfileUser> {
        try {
            // Si se pasa solo un string, usar ese como userId
            const userId = typeof request === 'string' ? request : request.userId;
            const defaultSeniority = typeof request === 'object' ? request.seniority : undefined;
            const defaultSpecialization = typeof request === 'object' ? request.specialization : undefined;
            const defaultAvatarUrl = typeof request === 'object' ? request.avatarUrl : undefined;

            if (!userId) {
                throw new Error('User ID is required');
            }

            // Intentar encontrar el usuario existente
            const existingProfile = await this.userProfileRepository.findById(userId);
            
            if (existingProfile) {
                console.log(`User profile found for user: ${userId}`);
                return existingProfile;
            }

            // Si no existe, crear un nuevo perfil con valores por defecto
            console.log(`User profile not found for user: ${userId}, creating new profile...`);
            
            const newProfile: ProfileUser = {
                userId: userId,
                seniority: defaultSeniority || 'Junior', // Valor por defecto
                specialization: defaultSpecialization || 'General', // Valor por defecto
                currentStreakDays: 0,
                pointsCurrent: new Points(0),
                level: 1,
                streakBest: 0,
                avatarUrl: defaultAvatarUrl || null,
                avatarPublicId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Guardar el nuevo perfil
            const savedProfile = await this.userProfileRepository.create(newProfile);
            console.log(`New user profile created for user: ${userId}`);

            return savedProfile;
        } catch (error) {
            console.error('Error in GetOrCreateUserProfileUseCase:', error);
            throw error;
        }
    }
}
