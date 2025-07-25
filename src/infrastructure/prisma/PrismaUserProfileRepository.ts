import { PrismaClient } from "@prisma/client";
import { UserProfileRepository } from "../../domain/repositories/UserProfileRepository";
import ProfileUser from "../../domain/entities/ProfileUser";
import { Points } from "../../domain/value-objects/Points";


export class PrismaUserProfileRepository implements UserProfileRepository{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async findById(userId: string): Promise<ProfileUser | null> {
        try{
            console.log(`Finding user by ID: ${userId}`);
            const profile = await this.prisma.profileUser.findUnique({
                where: { userId: userId },
                
            });

            if (!profile) return null;
            
            let profileFinded: ProfileUser = {
                userId: profile?.userId || '',
                pointsCurrent: new Points(profile?.pointsCurrent || 0),
                level: profile?.level || 0,
                streakBest: profile?.streakBest || 0,
                currentStreakDays: profile?.currentStreakDays || 0,
                avatarUrl: profile?.avatarUrl || null,
                avatarPublicId: profile?.avatarPublicId || null,
                createdAt: profile?.createdAt || null,
                updatedAt: profile?.updatedAt || null,
                seniority: profile?.seniority || '',
                specialization: profile?.specialization || ''
            }
            
            
            return profileFinded;


            
        }catch (error) {
            console.error(`Error finding user by ID: ${error}`);
            
            throw new Error(`Error finding user by ID`);
        }
        
    }
    async create(profileUser: ProfileUser): Promise<ProfileUser> {
        try {
            const createdProfile = await this.prisma.profileUser.create({
                data: {
                    userId: profileUser.userId,
                    pointsCurrent: profileUser.pointsCurrent.value,
                    level: profileUser.level,
                    streakBest: profileUser.streakBest,
                    currentStreakDays: profileUser.currentStreakDays,
                    avatarUrl: profileUser.avatarUrl,
                    avatarPublicId: profileUser.avatarPublicId,
                    seniority: profileUser.seniority,
                    specialization: profileUser.specialization
                }
            });
            let profile: ProfileUser = {
                userId: createdProfile?.userId || '',
                pointsCurrent: new Points(createdProfile?.pointsCurrent || 0),
                level: createdProfile?.level || 0,
                streakBest: createdProfile?.streakBest || 0,
                currentStreakDays: createdProfile?.currentStreakDays || 0,
                avatarUrl: createdProfile?.avatarUrl || null,
                avatarPublicId: createdProfile?.avatarPublicId || null,
                createdAt: createdProfile?.createdAt || null,
                updatedAt: createdProfile?.updatedAt || null,
                seniority: createdProfile?.seniority || '',
                specialization: createdProfile?.specialization || ''
            }
            return profile;
          
        } catch (error) {
            console.error(`Error creating user profile: ${error}`);
            throw new Error(`Error creating user profile`);
        }
    }

    async update(profileUser: ProfileUser): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: profileUser.userId },
                data: {
                    pointsCurrent: profileUser.pointsCurrent.value,
                    level: profileUser.level,
                    streakBest: profileUser.streakBest,
                    currentStreakDays: profileUser.currentStreakDays,
                    avatarUrl: profileUser.avatarUrl,
                    avatarPublicId: profileUser.avatarPublicId,
                    seniority: profileUser.seniority,
                    specialization: profileUser.specialization
                }
            });

            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user profile: ${error}`);
            throw new Error(`Error updating user profile`);
        }
    }

    async findAllWithFilters(filters: { seniority?: string; specialization?: string }): Promise<ProfileUser[]> {
        try {
            const profiles = await this.prisma.profileUser.findMany({
                where: {
                    ...(filters.seniority && { seniority: filters.seniority }),
                    ...(filters.specialization && { specialization: filters.specialization })
                },
                orderBy: {
                    pointsCurrent: 'desc'
                }
            });

            return profiles.map(profile => ({
                userId: profile.userId,
                pointsCurrent: new Points(profile.pointsCurrent),
                level: profile.level,
                streakBest: profile.streakBest,
                currentStreakDays: profile.currentStreakDays,
                avatarUrl: profile.avatarUrl,
                avatarPublicId: profile.avatarPublicId,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
                seniority: profile.seniority,
                specialization: profile.specialization
            }));
        } catch (error) {
            console.error(`Error finding profiles with filters: ${error}`);
            throw new Error(`Error finding profiles with filters`);
        }
    }

    async updateImage(userId: string, avatarUrl: string, avatarPublicId?: string | null): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: {
                    avatarUrl: avatarUrl,
                    avatarPublicId: avatarPublicId || null
                }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user image: ${error}`);
            throw new Error(`Error updating user image`);
        }
    }
    async deleteById(userId: string): Promise<boolean> {
        try {
            await this.prisma.profileUser.delete({
                where: { userId: userId }
            });
            return true;
        } catch (error) {
            console.error(`Error deleting user profile: ${error}`);
            return false;
        }
    }
    async updateLevel(userId: string, level: number): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { level: level }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user level: ${error}`);
            throw new Error(`Error updating user level`);
        }
    }
    async updatePoints(userId: string, points: number): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { pointsCurrent: points }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user points: ${error}`);
            throw new Error(`Error updating user points`);
        }
    }
    async updateStreak(userId: string, streak: number): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { streakBest: streak }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user streak: ${error}`);
            throw new Error(`Error updating user streak`);
        }
    }
    async updateCurrentStreakDays(userId: string, streakDays: number): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { currentStreakDays: streakDays }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user current streak days: ${error}`);
            throw new Error(`Error updating user current streak days`);
        }
    }
    async updateSeniority(userId: string, seniority: string): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { seniority: seniority }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user seniority: ${error}`);
            throw new Error(`Error updating user seniority`);
        }
    }
    async updateSpecialization(userId: string, specialization: string): Promise<ProfileUser> {
        try {
            const updatedProfile = await this.prisma.profileUser.update({
                where: { userId: userId },
                data: { specialization: specialization }
            });
            return {
                userId: updatedProfile.userId,
                pointsCurrent: new Points(updatedProfile.pointsCurrent),
                level: updatedProfile.level,
                streakBest: updatedProfile.streakBest,
                currentStreakDays: updatedProfile.currentStreakDays,
                avatarUrl: updatedProfile.avatarUrl,
                avatarPublicId: updatedProfile.avatarPublicId,
                createdAt: updatedProfile.createdAt,
                updatedAt: updatedProfile.updatedAt,
                seniority: updatedProfile.seniority,
                specialization: updatedProfile.specialization
            };
        } catch (error) {
            console.error(`Error updating user specialization: ${error}`);
            throw new Error(`Error updating user specialization`);
        }
    }
}