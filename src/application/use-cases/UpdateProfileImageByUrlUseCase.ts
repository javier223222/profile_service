import { UserProfileRepository } from "../../domain/repositories/UserProfileRepository";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";

export class UpdateProfileImageByUrlUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private cloudinaryService: CloudinaryService
    ) {}

    async execute(userId: string, avatarUrl: string): Promise<{ avatarUrl: string }> {
      
        const user = await this.userProfileRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        console.log(user)
        console.log(`Updating profile image for user ${userId} with URL: ${avatarUrl}`);

        
        // if (!this.cloudinaryService.isValidImageUrl(avatarUrl)) {
        //     throw new Error('Invalid image URL');
        //

      
        if (user.avatarPublicId) {
            await this.cloudinaryService.deleteImage(user.avatarPublicId);
        }

       
        await this.userProfileRepository.updateImage(userId, avatarUrl, null);

        return {
            avatarUrl: avatarUrl
        };
    }
}
