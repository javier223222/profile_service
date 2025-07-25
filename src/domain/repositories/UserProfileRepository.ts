import ProfileUser from "../entities/ProfileUser";

export interface UserProfileFilters {
    seniority?: string;
    specialization?: string;
}

export interface UserProfileRepository {
    findById(userId: string): Promise<ProfileUser | null>;
    create(profileUser: ProfileUser): Promise<ProfileUser>;
    update(profileUser: ProfileUser): Promise<ProfileUser>;
    findAllWithFilters(filters: UserProfileFilters): Promise<ProfileUser[]>;
    updateImage(userId: string, avatarUrl: string, avatarPublicId?: string | null): Promise<ProfileUser>;
    deleteById(userId: string): Promise<boolean>;
    updateLevel(userId: string, level: number): Promise<ProfileUser>;
    updatePoints(userId: string, points: number): Promise<ProfileUser>;
    updateStreak(userId: string, streak: number): Promise<ProfileUser>;
    updateCurrentStreakDays(userId: string, streakDays: number): Promise<ProfileUser>;
    updateSeniority(userId: string, seniority: string): Promise<ProfileUser>;
    updateSpecialization(userId: string, specialization: string): Promise<ProfileUser>;
}
