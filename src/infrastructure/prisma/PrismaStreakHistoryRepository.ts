import { PrismaClient } from "@prisma/client";
import { StreakHistoryRepository } from "../../domain/repositories/StreakHistoryRepository";
import StreakHistory from "../../domain/entities/StreakHistory";

export class PrismaStreakHistoryRepository implements StreakHistoryRepository{
    private prisma:PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async save(streakHistory: StreakHistory): Promise<StreakHistory> {
        
        try{
        const savedStreak = await this.prisma.streakHistory.upsert({
            where: { id: streakHistory.id },
            update: {
                startDate: streakHistory.startDate,
                endDate: streakHistory.endDate,
                lengthDays: streakHistory.lengthDays,
                pointsTotal: streakHistory.pointsTotal,
                brokenBy: streakHistory.brokenBy
            },
            create: {
                userId: streakHistory.userId,
                startDate: streakHistory.startDate,
                endDate: streakHistory.endDate,
                lengthDays: streakHistory.lengthDays,
                pointsTotal: streakHistory.pointsTotal,
                brokenBy: streakHistory.brokenBy
            }
        });
        return {
            id: savedStreak.id,
            userId: savedStreak.userId,
            startDate: savedStreak.startDate,
            endDate: savedStreak.endDate,
            lengthDays: savedStreak.lengthDays,
            pointsTotal: savedStreak.pointsTotal,
            brokenBy: savedStreak.brokenBy || null,
            createdAt: savedStreak.createdAt || null
        };
        

        }catch (error) {
            throw new Error(`Error saving streak history: ${error}`);
        }
    }

    async findByUserId(userId: string): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: { userId }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak history: ${error}`);
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        try {
            await this.prisma.streakHistory.deleteMany({
                where: { userId }
            });
        } catch (error) {
            throw new Error(`Error deleting streak history for user ${userId}: ${error}`);
        }
    }
    async findById(id: string): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findUnique({
                where: { id }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak history by ID ${id}: ${error}`);
        }
    }

    async findAllByUserId(userId: string): Promise<StreakHistory[]> {
        try {
            const streaks = await this.prisma.streakHistory.findMany({
                where: { userId }
            });
            return streaks.map(streak => ({
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            }));
        } catch (error) {
            throw new Error(`Error finding all streak histories for user ${userId}: ${error}`);
        }
    }
    async findByStartDateAndEndDate(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate,
                    endDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by start and end date for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory[]> {
        try {
            const streaks = await this.prisma.streakHistory.findMany({
                where: {
                    userId,
                    startDate: { gte: startDate },
                    endDate: { lte: endDate }
                }
            });
            return streaks.map(streak => ({
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            }));
        } catch (error) {
            throw new Error(`Error finding streaks by user ID and date range for user ${userId}: ${error}`);
        }
    }


    async findByUserIdAndLengthDays(userId: string, lengthDays: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    lengthDays
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID and length days for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndPointsTotal(userId: string, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID and points total for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenBy(userId: string, brokenBy: string): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID and broken by for user ${userId}: ${error}`);
        }
    }

    async findByUserIdAndStartDate(userId: string, startDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID and start date for user ${userId}: ${error}`);
        }
    }

    async findByUserIdAndEndDate(userId: string, endDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    endDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID and end date for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndLengthDaysAndPointsTotal(userId: string, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    lengthDays,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, length days and points total for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndStartDateAndEndDate(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate,
                    endDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, start date and end date for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndStartDate(userId: string, brokenBy: string, startDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    startDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by and start date for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndEndDate(userId: string, brokenBy: string, endDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    endDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by and end date for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndLengthDays(userId: string, brokenBy: string, lengthDays: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    lengthDays
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by and length days for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndPointsTotal(userId: string, brokenBy: string, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by and points total for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndStartDateAndEndDate(userId: string, brokenBy: string, startDate: Date, endDate: Date): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    startDate,
                    endDate
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by, start date and end date for user ${userId}: ${error}`);
        }
    }

    async findByUserIdAndBrokenByAndLengthDaysAndPointsTotal(userId: string, brokenBy: string, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    lengthDays,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by, length days and points total for user ${userId}: ${error}`);
        }
    }

    async findByUserIdAndStartDateAndEndDateAndLengthDays(userId: string, startDate: Date, endDate: Date, lengthDays: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate,
                    endDate,
                    lengthDays
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, start date, end date and length days for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndStartDateAndEndDateAndPointsTotal(userId: string, startDate: Date, endDate: Date, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate,
                    endDate,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, start date, end date and points total for user ${userId}: ${error}`);
        }
    }
   
    async findByUserIdAndStartDateAndEndDateAndLengthDaysAndPointsTotal(userId: string, startDate: Date, endDate: Date, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    startDate,
                    endDate,
                    lengthDays,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, start date, end date, length days and points total for user ${userId}: ${error}`);
        }
    }

    async findByUserIdAndBrokenByAndStartDateAndEndDateAndLengthDays(userId: string, brokenBy: string, startDate: Date, endDate: Date, lengthDays: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    startDate,
                    endDate,
                    lengthDays
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by, start date, end date and length days for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndStartDateAndEndDateAndPointsTotal(userId: string, brokenBy: string, startDate: Date, endDate: Date, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    startDate,
                    endDate,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by, start date, end date and points total for user ${userId}: ${error}`);
        }
    }
    async findByUserIdAndBrokenByAndStartDateAndEndDateAndLengthDaysAndPointsTotal(userId: string, brokenBy: string, startDate: Date, endDate: Date, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null> {
        try {
            const streak = await this.prisma.streakHistory.findFirst({
                where: {
                    userId,
                    brokenBy,
                    startDate,
                    endDate,
                    lengthDays,
                    pointsTotal
                }
            });
            return streak ? {
                id: streak.id,
                userId: streak.userId,
                startDate: streak.startDate,
                endDate: streak.endDate,
                lengthDays: streak.lengthDays,
                pointsTotal: streak.pointsTotal,
                brokenBy: streak.brokenBy || null,
                createdAt: streak.createdAt || null
            } : null;
        } catch (error) {
            throw new Error(`Error finding streak by user ID, broken by, start date, end date, length days and points total for user ${userId}: ${error}`);
        }
    }
    
    


    


}