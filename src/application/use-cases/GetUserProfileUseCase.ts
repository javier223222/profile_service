import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import ProfileUser from '../../domain/entities/ProfileUser';

export class GetUserProfileUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(userId: string): Promise<ProfileUser | null> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const profile = await this.userProfileRepository.findById(userId);
            
            if (!profile) {
                return null;
            }

            return profile;
        } catch (error) {
            console.error('Error in GetUserProfileUseCase:', error);
            throw error;
        }
    }
}
