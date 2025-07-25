import DailyActivity from "../entities/DailyActivity";

export interface DailyActivityRepository {
    findByUserAndDay(userId: string, day: Date): Promise<DailyActivity | null>;
    findByUserIdAndDay(userId: string, day: Date): Promise<DailyActivity | null>;
    findByUserAndDateRange(userId: string, startDate: Date, endDate: Date, domain?: string): Promise<DailyActivity[]>;
    create(dailyActivity: DailyActivity): Promise<DailyActivity>;
    update(dailyActivity: DailyActivity): Promise<DailyActivity>;
    save(dailyActivity: DailyActivity): Promise<DailyActivity>;
    deleteByUserIdAndDay(userId: string, day: Date): Promise<void>;
    findAllByUserId(userId: string): Promise<DailyActivity[]>;
    findAllByUserIdAndMonth(userId: string, month: number): Promise<DailyActivity[]>;
    findAllByUserIdAndYear(userId: string, year: number): Promise<DailyActivity[]>;
    findAllByUserIdAndDomain(userId: string, domain: string): Promise<DailyActivity[]>;
    findAllByUserIdAndDomainAndMonth(userId: string, domain: string, month: number): Promise<DailyActivity[]>;
    findAllByUserIdAndDomainAndYear(userId: string, domain: string, year: number): Promise<DailyActivity[]>;
    findAllByDomain(domain: string): Promise<DailyActivity[]>;
    findAllByDomainAndMonth(domain: string, month: number): Promise<DailyActivity[]>;
    findAllByDomainAndYear(domain: string, year: number): Promise<DailyActivity[]>;
}
