import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import ProfileUser from '../../domain/entities/ProfileUser';

export interface UpdateUserProfileRequest {
    userId: string;
    seniority?: string;
    specialization?: string;
    avatarUrl?: string;
}

export class UpdateUserProfileUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(request: UpdateUserProfileRequest): Promise<ProfileUser> {
        // Verificar si el usuario existe
        const existingUser = await this.userProfileRepository.findById(request.userId);
        if (!existingUser) {
            throw new Error('User profile not found');
        }

        // Actualizar campos específicos si se proporcionan
        if (request.seniority) {
            await this.userProfileRepository.updateSeniority(request.userId, request.seniority);
        }

        if (request.specialization) {
            await this.userProfileRepository.updateSpecialization(request.userId, request.specialization);
        }

        if (request.avatarUrl) {
            await this.userProfileRepository.updateImage(request.userId, request.avatarUrl);
        }

        // Obtener el perfil actualizado
        const updatedProfile = await this.userProfileRepository.findById(request.userId);
        
        if (!updatedProfile) {
            throw new Error('Error retrieving updated profile');
        }

        return updatedProfile;
    }
}
