import { PrismaClient } from "@prisma/client";
import { StreakSnapshotRepository } from "../../domain/repositories/StreakSnapshotRepository";
import StreakSnapshot from "../../domain/entities/StreakSnapshot";

export class PrismaStreakSnapshotRepository implements StreakSnapshotRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async save(snapshot: StreakSnapshot): Promise<void> {
        try {
            await this.prisma.streakSnapshot.upsert({
                where: { userId: snapshot.userId },
                update: {
                    startDate: snapshot.startDate,
                    lastActive: snapshot.lastActive,
                    lengthDays: snapshot.lengthDays,
                    pointsInStreak: snapshot.pointsInStreak
                },
                create: {
                    userId: snapshot.userId,
                    startDate: snapshot.startDate,
                    lastActive: snapshot.lastActive,
                    lengthDays: snapshot.lengthDays,
                    pointsInStreak: snapshot.pointsInStreak
                }
            });
        } catch (error) {
            console.error(`Error saving streak snapshot: ${error}`);
            throw new Error(`Error saving streak snapshot`);
        }
    }

    async findByUserId(userId: string): Promise<StreakSnapshot | null> {
        try {
            const snapshot = await this.prisma.streakSnapshot.findUnique({
                where: { userId: userId }
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
            console.error(`Error finding streak snapshot by user ID: ${error}`);
            throw new Error(`Error finding streak snapshot by user ID`);
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        try {
            await this.prisma.streakSnapshot.delete({
                where: { userId: userId }
            });
        } catch (error) {
            console.error(`Error deleting streak snapshot: ${error}`);
            throw new Error(`Error deleting streak snapshot`);
        }
    }

    async getCurrentStreak(userId: string): Promise<StreakSnapshot | null> {
        return this.findByUserId(userId);
    }

    async updateStreakLength(userId: string, newLength: number): Promise<void> {
        try {
            await this.prisma.streakSnapshot.update({
                where: { userId: userId },
                data: { lengthDays: newLength }
            });
        } catch (error) {
            console.error(`Error updating streak length: ${error}`);
            throw new Error(`Error updating streak length`);
        }
    }

    async updateLastActive(userId: string, date: Date): Promise<void> {
        try {
            await this.prisma.streakSnapshot.update({
                where: { userId: userId },
                data: { lastActive: date }
            });
        } catch (error) {
            console.error(`Error updating last active date: ${error}`);
            throw new Error(`Error updating last active date`);
        }
    }

    async addPointsToStreak(userId: string, points: number): Promise<void> {
        try {
            const currentSnapshot = await this.prisma.streakSnapshot.findUnique({
                where: { userId: userId }
            });

            if (currentSnapshot) {
                await this.prisma.streakSnapshot.update({
                    where: { userId: userId },
                    data: { pointsInStreak: currentSnapshot.pointsInStreak + points }
                });
            }
        } catch (error) {
            console.error(`Error adding points to streak: ${error}`);
            throw new Error(`Error adding points to streak`);
        }
    }

    async resetStreak(userId: string): Promise<void> {
        try {
            const today = new Date();
            await this.prisma.streakSnapshot.upsert({
                where: { userId: userId },
                update: {
                    startDate: today,
                    lastActive: today,
                    lengthDays: 0,
                    pointsInStreak: 0
                },
                create: {
                    userId: userId,
                    startDate: today,
                    lastActive: today,
                    lengthDays: 0,
                    pointsInStreak: 0
                }
            });
        } catch (error) {
            console.error(`Error resetting streak: ${error}`);
            throw new Error(`Error resetting streak`);
        }
    }
}
