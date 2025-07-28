import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { UploadProfileImageUseCase } from '../../application/use-cases/UploadProfileImageUseCase';
import { UpdateProfileImageByUrlUseCase } from '../../application/use-cases/UpdateProfileImageByUrlUseCase';
import { UpdateProfileImageResponse } from '../../application/dto/UpdateProfileImageDto';

export class ProfileController {
    constructor(
        private uploadProfileImageUseCase: UploadProfileImageUseCase,
        private updateProfileImageByUrlUseCase: UpdateProfileImageByUrlUseCase
    ) {}

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                    data: null
                });
                return;
            }

            if (!req.files || !req.files.avatar) {
                res.status(400).json({
                    success: false,
                    message: 'No image file provided',
                    data: null
                });
                return;
            }

            const file = req.files.avatar as UploadedFile;

            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only images are allowed.',
                    data: null
                });
                return;
            }

            const maxSize = 20 * 1024 * 1024; 
            if (file.size > maxSize) {
                res.status(400).json({
                    success: false,
                    message: 'File size too large. Maximum 5MB allowed.',
                    data: null
                });
                return;
            }

            const result = await this.uploadProfileImageUseCase.execute(userId, file);

            const response: UpdateProfileImageResponse = {
                success: true,
                message: 'Profile image updated successfully',
                data: {
                    userId: userId,
                    avatarUrl: result.avatarUrl,
                    avatarPublicId: result.avatarPublicId
                }
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Error uploading profile image:', error);
            
            if (error.message === 'User not found') {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                    data: null
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null
            });
        }
    }

    async updateProfileImageByUrl(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { avatarUrl } = req.body;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                    data: null
                });
                return;
            }

            if (!avatarUrl || typeof avatarUrl !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Avatar URL is required and must be a string',
                    data: null
                });
                return;
            }

            const result = await this.updateProfileImageByUrlUseCase.execute(userId, avatarUrl);

            const response: UpdateProfileImageResponse = {
                success: true,
                message: 'Profile image updated successfully',
                data: {
                    userId: userId,
                    avatarUrl: result.avatarUrl
                }
            };

            res.status(200).json(response);
        } catch (error: any) {
            console.error('Error updating profile image by URL:', error);
            
            if (error.message === 'User not found') {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                    data: null
                });
                return;
            }

            if (error.message === 'Invalid image URL') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid image URL format',
                    data: null
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null
            });
        }
    }
}
