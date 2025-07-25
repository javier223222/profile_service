import { PrismaClient } from "@prisma/client";
import DailyActivity from "../../domain/entities/DailyActivity";
import { DailyActivityRepository } from "../../domain/repositories/DailyActivityRepository";

export class PrismaDailyActivityRepository implements DailyActivityRepository{
    private readonly prisma: PrismaClient;
    constructor(prismaInstance: PrismaClient) {
        this.prisma = prismaInstance;
    }

    async findByUserAndDay(userId: string, day: Date): Promise<DailyActivity | null> {
        return this.findByUserIdAndDay(userId, day);
    }

    async findByUserIdAndDay(userId: string, day: Date): Promise<DailyActivity | null> {
      try{
        const dailyActivity = await this.prisma.dailyActivity.findUnique({
            where: {
                userId_day: {
                    userId,
                    day: day.toISOString().split('T')[0] 
                }
            }
        });

        if (!dailyActivity) {
            return null;
        }

        return {
            userId: dailyActivity.userId,
            day: new Date(dailyActivity.day),
            domain: dailyActivity.domain,
            events: dailyActivity.events,
            points: dailyActivity.points
        };}
        catch (error) {
          throw new Error(`Error finding daily activity: ${error}`);
        }
        
    }
  async save(dailyActivity: DailyActivity): Promise<DailyActivity> {
    try{
        const savedActivity = await this.prisma.dailyActivity.upsert({
            where: {
            userId_day: {
                userId: dailyActivity.userId,
                day: dailyActivity.day.toISOString().split('T')[0] 
            }
            },
            update: {
            domain: dailyActivity.domain,
            events: dailyActivity.events,
            points: dailyActivity.points
            },
            create: {
            userId: dailyActivity.userId,
            day: dailyActivity.day.toISOString().split('T')[0],
            domain: dailyActivity.domain,
            events: dailyActivity.events,
            points: dailyActivity.points
            }
        });
    
        return {
            userId: savedActivity.userId,
            day: new Date(savedActivity.day),
            domain: savedActivity.domain,
            events: savedActivity.events,
            points: savedActivity.points
        };

    }catch (error) {
      throw new Error(`Error saving daily activity: ${error}`);

    }
      
  }

    async deleteByUserIdAndDay(userId: string, day: Date): Promise<void> {
      try{

      
        await this.prisma.dailyActivity.delete({
        where: {
            userId_day: {
            userId,
            day: day.toISOString().split('T')[0] 
            }
        }
        });
    }catch (error) {
      throw new Error(`Error deleting daily activity: ${error}`);
    }
    }
    async findAllByUserId(userId: string): Promise<DailyActivity[]> {
        try{

        
        const activities = await this.prisma.dailyActivity.findMany({
            where: { userId }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }
    catch (error) {
      throw new Error(`Error finding daily activities by userId: ${error}`);}
    }
    async findAllByUserIdAndMonth(userId: string, month: number): Promise<DailyActivity[]> {
      try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                userId,
                day: {
                    gte: new Date(new Date().getFullYear(), month - 1, 1),
                    lt: new Date(new Date().getFullYear(), month, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
      }catch (error) {
        throw new Error(`Error finding daily activities by userId and month: ${error}`);
      }
    }
    async findAllByUserIdAndYear(userId: string, year: number): Promise<DailyActivity[]> {
     try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                userId,
                day: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by userId and year: ${error}`);
    }   
    }
    async findAllByUserIdAndDomain(userId: string, domain: string): Promise<DailyActivity[]> {
      try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                userId,
                domain
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
      throw new Error(`Error finding daily activities by userId and domain: ${error}`);
    }}

    async findAllByUserIdAndDomainAndMonth(userId: string, domain: string, month: number): Promise<DailyActivity[]> {
        try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                userId,
                domain,
                day: {
                    gte: new Date(new Date().getFullYear(), month - 1, 1),
                    lt: new Date(new Date().getFullYear(), month, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by userId, domain and month: ${error}`);
    }
    }
    async findAllByUserIdAndDomainAndYear(userId: string, domain: string, year: number): Promise<DailyActivity[]> {
       try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                userId,
                domain,
                day: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by userId, domain and year: ${error}`);}

    }
    async findAllByDomain(domain: string): Promise<DailyActivity[]> {
        try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: { domain }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by domain: ${error}`);
    }
    }
    async findAllByDomainAndMonth(domain: string, month: number): Promise<DailyActivity[]> {
       try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                domain,
                day: {
                    gte: new Date(new Date().getFullYear(), month - 1, 1),
                    lt: new Date(new Date().getFullYear(), month, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by domain and month: ${error}`);
    }
    }
    async findAllByDomainAndYear(domain: string, year: number): Promise<DailyActivity[]> {
       try{
        const activities = await this.prisma.dailyActivity.findMany({
            where: {
                domain,
                day: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1)
                }
            }
        });

        return activities.map(activity => ({
            userId: activity.userId,
            day: new Date(activity.day),
            domain: activity.domain,
            events: activity.events,
            points: activity.points
        }));
    }catch (error) {
        throw new Error(`Error finding daily activities by domain and year: ${error}`);}
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

}