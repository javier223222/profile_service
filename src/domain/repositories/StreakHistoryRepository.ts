import StreakHistory from "../entities/StreakHistory";
export interface StreakHistoryRepository {

    save(streakHistory: StreakHistory): Promise<StreakHistory>;

    findByUserId(userId: string): Promise<StreakHistory | null>;

    deleteByUserId(userId: string): Promise<void>;
    findById(id: string): Promise<StreakHistory | null>;
    findAllByUserId(userId: string): Promise<StreakHistory[]>;
    findByStartDateAndEndDate(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory[]>;
    findByUserIdAndLengthDays(userId: string, lengthDays: number): Promise<StreakHistory | null>;
    findByUserIdAndPointsTotal(userId: string, pointsTotal: number): Promise<StreakHistory | null>
    findByUserIdAndBrokenBy(userId: string, brokenBy: string): Promise<StreakHistory | null>;
    findByUserIdAndStartDate(userId: string, startDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndEndDate(userId: string, endDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndLengthDaysAndPointsTotal(userId: string, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndStartDateAndEndDate(userId: string, startDate: Date, endDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndStartDate(userId: string, brokenBy: string, startDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndEndDate(userId: string, brokenBy: string, endDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndLengthDays(userId: string, brokenBy: string, lengthDays: number): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndPointsTotal(userId: string, brokenBy: string, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndStartDateAndEndDate(userId: string, brokenBy: string, startDate: Date, endDate: Date): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndLengthDaysAndPointsTotal(userId: string, brokenBy: string, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndStartDateAndEndDateAndLengthDays(userId: string, startDate: Date, endDate: Date, lengthDays: number): Promise<StreakHistory | null>;
    findByUserIdAndStartDateAndEndDateAndPointsTotal(userId: string, startDate: Date, endDate: Date, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndLengthDaysAndPointsTotal(userId: string, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndStartDateAndEndDateAndLengthDaysAndPointsTotal(userId: string, startDate: Date, endDate: Date, lengthDays: number, pointsTotal: number): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndStartDateAndEndDateAndLengthDays(userId: string, brokenBy: string, startDate: Date, endDate: Date, lengthDays: number): Promise<StreakHistory | null>;
    findByUserIdAndBrokenByAndStartDateAndEndDateAndPointsTotal(userId: string, brokenBy: string, startDate: Date, endDate: Date, pointsTotal: number): Promise<StreakHistory | null>;

}