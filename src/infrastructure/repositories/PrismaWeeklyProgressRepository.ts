import { PrismaClient } from '@prisma/client';
import { WeeklyProgressRepository } from '../../domain/repositories/WeeklyProgressRepository';
import WeeklyProgress from '../../domain/entities/WeeklyProgress';

export class PrismaWeeklyProgressRepository implements WeeklyProgressRepository {
    constructor(private prisma: PrismaClient) {}

    async findByUserIdAndWeek(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null> {
        try {
            const weeklyProgress = await this.prisma.weeklyProgress.findFirst({
                where: {
                    userId: userId,
                    weekStartDate: weekStartDate
                }
            });

            if (!weeklyProgress) {
                return null;
            }

            return {
                id: weeklyProgress.id,
                userId: weeklyProgress.userId,
                weekStartDate: weeklyProgress.weekStartDate,
                completedDays: weeklyProgress.completedDays,
                currentStreak: weeklyProgress.currentStreak,
                totalActiveDays: weeklyProgress.totalActiveDays,
                createdAt: weeklyProgress.createdAt,
                updatedAt: weeklyProgress.updatedAt
            };
        } catch (error) {
            console.error('Error finding weekly progress:', error);
            throw error;
        }
    }

    async save(weeklyProgress: WeeklyProgress): Promise<void> {
        try {
            // Usar upsert para manejar tanto creación como actualización
            await this.prisma.weeklyProgress.upsert({
                where: {
                    userId_weekStartDate: {
                        userId: weeklyProgress.userId,
                        weekStartDate: weeklyProgress.weekStartDate
                    }
                },
                update: {
                    completedDays: weeklyProgress.completedDays,
                    currentStreak: weeklyProgress.currentStreak,
                    totalActiveDays: weeklyProgress.totalActiveDays,
                    updatedAt: new Date()
                },
                create: {
                    userId: weeklyProgress.userId,
                    weekStartDate: weeklyProgress.weekStartDate,
                    completedDays: weeklyProgress.completedDays,
                    currentStreak: weeklyProgress.currentStreak,
                    totalActiveDays: weeklyProgress.totalActiveDays,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error saving weekly progress:', error);
            throw error;
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            await this.prisma.weeklyProgress.delete({
                where: { id }
            });
        } catch (error) {
            console.error('Error deleting weekly progress:', error);
            throw error;
        }
    }

    async getCurrentWeekProgress(userId: string): Promise<WeeklyProgress | null> {
        try {
            const today = new Date();
            const weekStart = this.getWeekStart(today);

            return await this.findByUserIdAndWeek(userId, weekStart);
        } catch (error) {
            console.error('Error getting current week progress:', error);
            throw error;
        }
    }

    async getWeekProgress(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null> {
        return await this.findByUserIdAndWeek(userId, weekStartDate);
    }

    async markDayCompleted(userId: string, date: Date): Promise<void> {
        try {
            const weekStart = this.getWeekStart(date);
            const dayOfWeek = this.getDayOfWeek(date);
            
            let progress = await this.findByUserIdAndWeek(userId, weekStart);
            
            if (!progress) {
                // Crear nuevo progreso semanal usando upsert
                const completedDays = new Array(7).fill(false);
                completedDays[dayOfWeek] = true;
                
                await this.prisma.weeklyProgress.upsert({
                    where: {
                        userId_weekStartDate: {
                            userId,
                            weekStartDate: weekStart
                        }
                    },
                    update: {
                        // Si existe, no hacer nada (este caso no debería pasar aquí)
                    },
                    create: {
                        userId,
                        weekStartDate: weekStart,
                        completedDays,
                        currentStreak: 1,
                        totalActiveDays: 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
            } else {
                // Actualizar progreso existente
                const updatedCompletedDays = [...progress.completedDays];
                let updatedTotalActiveDays = progress.totalActiveDays;
                
                if (!updatedCompletedDays[dayOfWeek]) {
                    updatedCompletedDays[dayOfWeek] = true;
                    updatedTotalActiveDays += 1;
                }

                await this.prisma.weeklyProgress.update({
                    where: { id: progress.id },
                    data: {
                        completedDays: updatedCompletedDays,
                        totalActiveDays: updatedTotalActiveDays,
                        updatedAt: new Date()
                    }
                });
            }
        } catch (error) {
            console.error('Error marking day completed:', error);
            throw error;
        }
    }

    async getCompletedDaysThisWeek(userId: string): Promise<boolean[]> {
        try {
            const currentWeekProgress = await this.getCurrentWeekProgress(userId);
            return currentWeekProgress?.completedDays || new Array(7).fill(false);
        } catch (error) {
            console.error('Error getting completed days this week:', error);
            throw error;
        }
    }

    async getWeeklyHistory(userId: string, limit: number = 4): Promise<WeeklyProgress[]> {
        try {
            const weeklyProgressList = await this.prisma.weeklyProgress.findMany({
                where: { userId },
                orderBy: { weekStartDate: 'desc' },
                take: limit
            });

            return weeklyProgressList.map(progress => ({
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
            console.error('Error getting weekly history:', error);
            throw error;
        }
    }

    async updateTotalActiveDays(userId: string, weekStartDate: Date, totalDays: number): Promise<void> {
        try {
            await this.prisma.weeklyProgress.updateMany({
                where: {
                    userId,
                    weekStartDate
                },
                data: {
                    totalActiveDays: totalDays,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error updating total active days:', error);
            throw error;
        }
    }

    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
        return new Date(d.setDate(diff));
    }

    private getDayOfWeek(date: Date): number {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1; // Convertir domingo (0) a 6, lunes (1) a 0, etc.
    }
}
