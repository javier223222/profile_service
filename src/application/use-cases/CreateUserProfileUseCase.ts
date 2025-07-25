import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import ProfileUser from '../../domain/entities/ProfileUser';
import { Points } from '../../domain/value-objects/Points';

export interface CreateUserProfileRequest {
    userId: string;
    seniority: string;
    specialization: string;
    avatarUrl?: string;
}

export class CreateUserProfileUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(request: CreateUserProfileRequest): Promise<ProfileUser> {
        // Verificar si el usuario ya existe
        const existingUser = await this.userProfileRepository.findById(request.userId);
        if (existingUser) {
            throw new Error('User profile already exists');
        }

        // Crear nuevo perfil de usuario
        const newProfile: ProfileUser = {
            userId: request.userId,
            seniority: request.seniority,
            specialization: request.specialization,
            currentStreakDays: 0,
            pointsCurrent: new Points(0),
            level: 1,
            streakBest: 0,
            avatarUrl: request.avatarUrl || null,
            avatarPublicId: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Guardar en el repositorio
        const savedProfile = await this.userProfileRepository.create(newProfile);

        return savedProfile;
    }
}
