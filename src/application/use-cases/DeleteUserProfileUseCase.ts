import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';

export class DeleteUserProfileUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(userId: string): Promise<boolean> {
        // Verificar que el usuario existe
        const existingUser = await this.userProfileRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User profile not found');
        }

        // Eliminar el perfil
        const deleted = await this.userProfileRepository.deleteById(userId);
        
        return deleted;
    }
}
