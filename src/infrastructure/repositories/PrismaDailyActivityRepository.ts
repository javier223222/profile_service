import { PrismaClient } from '@prisma/client';
import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import DailyActivity from '../../domain/entities/DailyActivity';

export class PrismaDailyActivityRepository implements DailyActivityRepository {
    constructor(private prisma: PrismaClient) {}

    async findByUserAndDay(userId: string, day: Date): Promise<DailyActivity | null> {
        return this.findByUserIdAndDay(userId, day);
    }

    async findByUserIdAndDay(userId: string, day: Date): Promise<DailyActivity | null> {
        try {
            const activity = await this.prisma.dailyActivity.findUnique({
                where: {
                    userId_day: {
                        userId,
                        day
                    }
                }
            });

            if (!activity) return null;

            return {
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            };
        } catch (error) {
            console.error('Error finding daily activity:', error);
            throw error;
        }
    }

    async findByUserAndDateRange(userId: string, startDate: Date, endDate: Date, domain?: string): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    day: {
                        gte: startDate,
                        lte: endDate
                    },
                    ...(domain && { domain })
                },
                orderBy: {
                    day: 'asc'
                }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding daily activities by date range:', error);
            throw error;
        }
    }

    async create(dailyActivity: DailyActivity): Promise<DailyActivity> {
        try {
            const created = await this.prisma.dailyActivity.create({
                data: {
                    userId: dailyActivity.userId,
                    day: dailyActivity.day,
                    domain: dailyActivity.domain,
                    events: dailyActivity.events,
                    points: dailyActivity.points
                }
            });

            return {
                userId: created.userId,
                day: created.day,
                domain: created.domain,
                events: created.events,
                points: created.points
            };
        } catch (error) {
            console.error('Error creating daily activity:', error);
            throw error;
        }
    }

    async update(dailyActivity: DailyActivity): Promise<DailyActivity> {
        try {
            const updated = await this.prisma.dailyActivity.update({
                where: {
                    userId_day: {
                        userId: dailyActivity.userId,
                        day: dailyActivity.day
                    }
                },
                data: {
                    domain: dailyActivity.domain,
                    events: dailyActivity.events,
                    points: dailyActivity.points
                }
            });

            return {
                userId: updated.userId,
                day: updated.day,
                domain: updated.domain,
                events: updated.events,
                points: updated.points
            };
        } catch (error) {
            console.error('Error updating daily activity:', error);
            throw error;
        }
    }

    async save(dailyActivity: DailyActivity): Promise<DailyActivity> {
        try {
            const saved = await this.prisma.dailyActivity.upsert({
                where: {
                    userId_day: {
                        userId: dailyActivity.userId,
                        day: dailyActivity.day
                    }
                },
                update: {
                    domain: dailyActivity.domain,
                    events: dailyActivity.events,
                    points: dailyActivity.points
                },
                create: {
                    userId: dailyActivity.userId,
                    day: dailyActivity.day,
                    domain: dailyActivity.domain,
                    events: dailyActivity.events,
                    points: dailyActivity.points
                }
            });

            return {
                userId: saved.userId,
                day: saved.day,
                domain: saved.domain,
                events: saved.events,
                points: saved.points
            };
        } catch (error) {
            console.error('Error saving daily activity:', error);
            throw error;
        }
    }

    async deleteByUserIdAndDay(userId: string, day: Date): Promise<void> {
        try {
            await this.prisma.dailyActivity.delete({
                where: {
                    userId_day: {
                        userId,
                        day
                    }
                }
            });
        } catch (error) {
            console.error('Error deleting daily activity:', error);
            throw error;
        }
    }

    async findAllByUserId(userId: string): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: { userId },
                orderBy: { day: 'desc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user:', error);
            throw error;
        }
    }

    async findAllByUserIdAndMonth(userId: string, month: number): Promise<DailyActivity[]> {
        try {
            const year = new Date().getFullYear();
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    day: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user and month:', error);
            throw error;
        }
    }

    async findAllByUserIdAndYear(userId: string, year: number): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    day: {
                        gte: new Date(year, 0, 1),
                        lt: new Date(year + 1, 0, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user and year:', error);
            throw error;
        }
    }

    async findAllByUserIdAndDomain(userId: string, domain: string): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: { userId, domain },
                orderBy: { day: 'desc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user and domain:', error);
            throw error;
        }
    }

    async findAllByUserIdAndDomainAndMonth(userId: string, domain: string, month: number): Promise<DailyActivity[]> {
        try {
            const year = new Date().getFullYear();
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    domain,
                    day: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user, domain and month:', error);
            throw error;
        }
    }

    async findAllByUserIdAndDomainAndYear(userId: string, domain: string, year: number): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    userId,
                    domain,
                    day: {
                        gte: new Date(year, 0, 1),
                        lt: new Date(year + 1, 0, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by user, domain and year:', error);
            throw error;
        }
    }

    async findAllByDomain(domain: string): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: { domain },
                orderBy: { day: 'desc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by domain:', error);
            throw error;
        }
    }

    async findAllByDomainAndMonth(domain: string, month: number): Promise<DailyActivity[]> {
        try {
            const year = new Date().getFullYear();
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    domain,
                    day: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by domain and month:', error);
            throw error;
        }
    }

    async findAllByDomainAndYear(domain: string, year: number): Promise<DailyActivity[]> {
        try {
            const activities = await this.prisma.dailyActivity.findMany({
                where: {
                    domain,
                    day: {
                        gte: new Date(year, 0, 1),
                        lt: new Date(year + 1, 0, 1)
                    }
                },
                orderBy: { day: 'asc' }
            });

            return activities.map(activity => ({
                userId: activity.userId,
                day: activity.day,
                domain: activity.domain,
                events: activity.events,
                points: activity.points
            }));
        } catch (error) {
            console.error('Error finding activities by domain and year:', error);
            throw error;
        }
    }
}
