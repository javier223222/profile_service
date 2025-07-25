import { PrismaClient } from "@prisma/client";
import WeeklyProgressRepository from "../../domain/repositories/WeeklyProgressRepository";
import WeeklyProgress from "../../domain/entities/WeeklyProgress";

export class PrismaWeeklyProgressRepository implements WeeklyProgressRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async save(progress: WeeklyProgress): Promise<void> {
        try {
            await this.prisma.weeklyProgress.upsert({
                where: {
                    userId_weekStartDate: {
                        userId: progress.userId,
                        weekStartDate: progress.weekStartDate
                    }
                },
                update: {
                    completedDays: progress.completedDays,
                    currentStreak: progress.currentStreak,
                    totalActiveDays: progress.totalActiveDays
                },
                create: {
                    userId: progress.userId,
                    weekStartDate: progress.weekStartDate,
                    completedDays: progress.completedDays,
                    currentStreak: progress.currentStreak,
                    totalActiveDays: progress.totalActiveDays
                }
            });
        } catch (error) {
            console.error(`Error saving weekly progress: ${error}`);
            throw new Error(`Error saving weekly progress`);
        }
    }

    async findByUserIdAndWeek(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null> {
        try {
            const progress = await this.prisma.weeklyProgress.findUnique({
                where: {
                    userId_weekStartDate: {
                        userId: userId,
                        weekStartDate: weekStartDate
                    }
                }
            });

            if (!progress) return null;

            return {
                id: progress.id,
                userId: progress.userId,
                weekStartDate: progress.weekStartDate,
                completedDays: progress.completedDays,
                currentStreak: progress.currentStreak,
                totalActiveDays: progress.totalActiveDays,
                createdAt: progress.createdAt,
                updatedAt: progress.updatedAt
            };
        } catch (error) {
            console.error(`Error finding weekly progress: ${error}`);
            throw new Error(`Error finding weekly progress`);
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            await this.prisma.weeklyProgress.delete({
                where: { id: id }
            });
        } catch (error) {
            console.error(`Error deleting weekly progress: ${error}`);
            throw new Error(`Error deleting weekly progress`);
        }
    }

    async getCurrentWeekProgress(userId: string): Promise<WeeklyProgress | null> {
        try {
            const now = new Date();
            const weekStartDate = this.getWeekStartDate(now);
            return this.findByUserIdAndWeek(userId, weekStartDate);
        } catch (error) {
            console.error(`Error getting current week progress: ${error}`);
            throw new Error(`Error getting current week progress`);
        }
    }

    async getWeekProgress(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null> {
        return this.findByUserIdAndWeek(userId, weekStartDate);
    }

    async markDayCompleted(userId: string, date: Date): Promise<void> {
        try {
            const weekStartDate = this.getWeekStartDate(date);
            const dayOfWeek = this.getDayOfWeek(date);
            
            const currentProgress = await this.findByUserIdAndWeek(userId, weekStartDate);
            
            if (currentProgress) {
                const updatedCompletedDays = [...currentProgress.completedDays];
                updatedCompletedDays[dayOfWeek] = true;
                
                await this.prisma.weeklyProgress.update({
                    where: {
                        userId_weekStartDate: {
                            userId: userId,
                            weekStartDate: weekStartDate
                        }
                    },
                    data: {
                        completedDays: updatedCompletedDays,
                        totalActiveDays: updatedCompletedDays.filter(day => day).length
                    }
                });
            } else {
                
                const completedDays = new Array(7).fill(false);
                completedDays[dayOfWeek] = true;
                
                await this.save({
                    id: '',
                    userId: userId,
                    weekStartDate: weekStartDate,
                    completedDays: completedDays,
                    currentStreak: 1,
                    totalActiveDays: 1
                });
            }
        } catch (error) {
            console.error(`Error marking day completed: ${error}`);
            throw new Error(`Error marking day completed`);
        }
    }

    async getCompletedDaysThisWeek(userId: string): Promise<boolean[]> {
        try {
            const currentProgress = await this.getCurrentWeekProgress(userId);
            return currentProgress ? currentProgress.completedDays : new Array(7).fill(false);
        } catch (error) {
            console.error(`Error getting completed days this week: ${error}`);
            throw new Error(`Error getting completed days this week`);
        }
    }

    async getWeeklyHistory(userId: string, limit: number = 10): Promise<WeeklyProgress[]> {
        try {
            const progressList = await this.prisma.weeklyProgress.findMany({
                where: { userId: userId },
                orderBy: { weekStartDate: 'desc' },
                take: limit
            });

            return progressList.map(progress => ({
                id: progress.id,
                userId: progress.userId,
                weekStartDate: progress.weekStartDate,
                completedDays: progress.completedDays,
                currentStreak: progress.currentStreak,
                totalActiveDays: progress.totalActiveDays,
                createdAt: progress.createdAt,
                updatedAt: progress.updatedAt
            }));
        } catch (error) {
            console.error(`Error getting weekly history: ${error}`);
            throw new Error(`Error getting weekly history`);
        }
    }

    async updateTotalActiveDays(userId: string, weekStartDate: Date, totalDays: number): Promise<void> {
        try {
            await this.prisma.weeklyProgress.update({
                where: {
                    userId_weekStartDate: {
                        userId: userId,
                        weekStartDate: weekStartDate
                    }
                },
                data: { totalActiveDays: totalDays }
            });
        } catch (error) {
            console.error(`Error updating total active days: ${error}`);
            throw new Error(`Error updating total active days`);
        }
    }

    
    private getWeekStartDate(date: Date): Date {
        const result = new Date(date);
        const dayOfWeek = result.getDay();
        const diff = result.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
        result.setDate(diff);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    private getDayOfWeek(date: Date): number {
        
        const day = date.getDay();
        return day === 0 ? 6 : day - 1;
    }
}
