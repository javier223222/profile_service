import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
}

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
          
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadProfileImage(file: UploadedFile, userId: string): Promise<CloudinaryUploadResult> {
        try {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath || file.data.toString('base64'), {
                folder: 'profile-images',
                public_id: `profile_${userId}_${Date.now()}`,
                transformation: [
                    { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            });

            return {
                public_id: uploadResult.public_id,
                secure_url: uploadResult.secure_url
            };
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image');
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
           
        }
    }

    isValidImageUrl(url: string): boolean {
        try {
            const urlObj = new URL(url);
            const validDomains = ['res.cloudinary.com', 'cloudinary.com',];
            const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
            const hasValidDomain = validDomains.some(domain => urlObj.hostname.includes(domain));
            
            return hasValidDomain || hasValidExtension;
        } catch {
            return false;
        }
    }
}
