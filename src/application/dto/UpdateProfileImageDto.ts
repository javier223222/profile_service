export interface UpdateProfileImageDto {
    avatarUrl: string;
    avatarPublicId: string;
}

export interface UpdateProfileImageByUrlDto {
    avatarUrl: string;
}

export interface UpdateProfileImageResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        avatarUrl: string;
        avatarPublicId?: string;
    };
}
