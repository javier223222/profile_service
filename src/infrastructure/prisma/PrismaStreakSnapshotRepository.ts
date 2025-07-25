import { PrismaClient } from '@prisma/client';
import { StreakSnapshotRepository } from '../../domain/repositories/StreakSnapshotRepository';
import StreakSnapshot from '../../domain/entities/StreakSnapshot';

export class PrismaStreakSnapshotRepository implements StreakSnapshotRepository {
    constructor(private prisma: PrismaClient) {}

    async save(snapshot: StreakSnapshot): Promise<void> {
        try {
            await this.prisma.streakSnapshot.upsert({
                where: { userId: snapshot.userId },
                update: {
                    startDate: snapshot.startDate,
                    lastActive: snapshot.lastActive,
                    lengthDays: snapshot.lengthDays,
                    pointsInStreak: snapshot.pointsInStreak,
                    updatedAt: new Date()
                },
                create: {
                    userId: snapshot.userId,
                    startDate: snapshot.startDate,
                    lastActive: snapshot.lastActive,
                    lengthDays: snapshot.lengthDays,
                    pointsInStreak: snapshot.pointsInStreak,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error saving streak snapshot:', error);
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<StreakSnapshot | null> {
        try {
            const snapshot = await this.prisma.streakSnapshot.findUnique({
                where: { userId }
            });

            if (!snapshot) return null;

            return {
                userId: snapshot.userId,
                startDate: snapshot.startDate,
                lastActive: snapshot.lastActive,
                lengthDays: snapshot.lengthDays,
                pointsInStreak: snapshot.pointsInStreak,
                updatedAt: snapshot.updatedAt
            };
        } catch (error) {
            console.error('Error finding streak snapshot:', error);
            throw error;
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        try {
            await this.prisma.streakSnapshot.delete({
                where: { userId }
            });
        } catch (error) {
            console.error('Error deleting streak snapshot:', error);
            throw error;
        }
    }

    async getCurrentStreak(userId: string): Promise<StreakSnapshot | null> {
        return this.findByUserId(userId);
    }

    async updateStreakLength(userId: string, newLength: number): Promise<void> {
        try {
            await this.prisma.streakSnapshot.update({
                where: { userId },
                data: { 
                    lengthDays: newLength,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error updating streak length:', error);
            throw error;
        }
    }

    async updateLastActive(userId: string, date: Date): Promise<void> {
        try {
            await this.prisma.streakSnapshot.update({
                where: { userId },
                data: { 
                    lastActive: date,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error updating last active:', error);
            throw error;
        }
    }

    async addPointsToStreak(userId: string, points: number): Promise<void> {
        try {
            const currentSnapshot = await this.prisma.streakSnapshot.findUnique({
                where: { userId }
            });

            if (currentSnapshot) {
                await this.prisma.streakSnapshot.update({
                    where: { userId },
                    data: { 
                        pointsInStreak: currentSnapshot.pointsInStreak + points,
                        updatedAt: new Date()
                    }
                });
            }
        } catch (error) {
            console.error('Error adding points to streak:', error);
            throw error;
        }
    }

    async resetStreak(userId: string): Promise<void> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            await this.prisma.streakSnapshot.upsert({
                where: { userId },
                update: {
                    startDate: today,
                    lastActive: today,
                    lengthDays: 1,
                    pointsInStreak: 0,
                    updatedAt: new Date()
                },
                create: {
                    userId: userId,
                    startDate: today,
                    lastActive: today,
                    lengthDays: 1,
                    pointsInStreak: 0,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error resetting streak:', error);
            throw error;
        }
    }
}
