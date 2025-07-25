import { UserProfileRepository } from "../../domain/repositories/UserProfileRepository";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { UploadedFile } from 'express-fileupload';

export class UploadProfileImageUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private cloudinaryService: CloudinaryService
    ) {}

    async execute(userId: string, file: UploadedFile): Promise<{ avatarUrl: string; avatarPublicId: string }> {
        
        const user = await this.userProfileRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

       
        if (user.avatarPublicId) {
            await this.cloudinaryService.deleteImage(user.avatarPublicId);
        }

        const uploadResult = await this.cloudinaryService.uploadProfileImage(file, userId);

       
        await this.userProfileRepository.updateImage(userId, uploadResult.secure_url, uploadResult.public_id);

        return {
            avatarUrl: uploadResult.secure_url,
            avatarPublicId: uploadResult.public_id
        };
    }
}
