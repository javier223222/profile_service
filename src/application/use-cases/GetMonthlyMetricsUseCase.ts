import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import DailyActivity from '../../domain/entities/DailyActivity';

export interface GetMonthlyMetricsRequest {
    userId: string;
    year?: number;
    month?: number; // 1-12
}

export interface MonthlyMetrics {
    year: number;
    month: number;
    totalPoints: number;
    totalEvents: number;
    activeDays: number;
    averagePointsPerDay: number;
    averagePointsPerActiveDay: number;
    streakDays: number;
    levelProgress: {
        startLevel: number;
        endLevel: number;
        leveledUp: boolean;
    };
    domainBreakdown: {
        domain: string;
        points: number;
        events: number;
        percentage: number;
    }[];
    weeklyBreakdown: {
        week: number;
        points: number;
        events: number;
        activeDays: number;
    }[];
    comparisonToPreviousMonth: {
        pointsChange: number;
        pointsChangePercentage: number;
        activeDaysChange: number;
        eventsChange: number;
    } | null;
}

export class GetMonthlyMetricsUseCase {
    constructor(
        private dailyActivityRepository: DailyActivityRepository,
        private userProfileRepository: UserProfileRepository
    ) {}

    async execute(request: GetMonthlyMetricsRequest): Promise<MonthlyMetrics> {
        const currentDate = new Date();
        const year = request.year || currentDate.getFullYear();
        const month = request.month || (currentDate.getMonth() + 1);

        // Calcular fechas del mes
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Obtener actividades del mes
        const activities = await this.dailyActivityRepository.findByUserAndDateRange(
            request.userId,
            startDate,
            endDate
        );

        // Calcular métricas básicas
        const totalPoints = activities.reduce((sum: number, activity: DailyActivity) => sum + activity.points, 0);
        const totalEvents = activities.reduce((sum: number, activity: DailyActivity) => sum + activity.events, 0);
        const activeDays = activities.length;
        const daysInMonth = endDate.getDate();
        
        const averagePointsPerDay = daysInMonth > 0 ? totalPoints / daysInMonth : 0;
        const averagePointsPerActiveDay = activeDays > 0 ? totalPoints / activeDays : 0;

        // Calcular breakdown por dominio
        const domainMap = new Map<string, { points: number; events: number }>();
        activities.forEach((activity: DailyActivity) => {
            const existing = domainMap.get(activity.domain) || { points: 0, events: 0 };
            domainMap.set(activity.domain, {
                points: existing.points + activity.points,
                events: existing.events + activity.events
            });
        });

        const domainBreakdown = Array.from(domainMap.entries()).map(([domain, data]) => ({
            domain,
            points: data.points,
            events: data.events,
            percentage: totalPoints > 0 ? Math.round((data.points / totalPoints) * 100 * 100) / 100 : 0
        })).sort((a, b) => b.points - a.points);

        // Calcular breakdown semanal
        const weeklyBreakdown = this.calculateWeeklyBreakdown(activities, year, month);

        // Obtener perfil para información de nivel
        const userProfile = await this.userProfileRepository.findById(request.userId);
        const currentLevel = userProfile?.level || 1;

        // Calcular comparación con mes anterior (si existe)
        const comparisonToPreviousMonth = await this.calculatePreviousMonthComparison(
            request.userId,
            year,
            month,
            totalPoints,
            totalEvents,
            activeDays
        );

        return {
            year,
            month,
            totalPoints,
            totalEvents,
            activeDays,
            averagePointsPerDay: Math.round(averagePointsPerDay * 100) / 100,
            averagePointsPerActiveDay: Math.round(averagePointsPerActiveDay * 100) / 100,
            streakDays: userProfile?.currentStreakDays || 0,
            levelProgress: {
                startLevel: currentLevel,
                endLevel: currentLevel,
                leveledUp: false // Esto se podría calcular con más datos históricos
            },
            domainBreakdown,
            weeklyBreakdown,
            comparisonToPreviousMonth
        };
    }

    private calculateWeeklyBreakdown(activities: DailyActivity[], year: number, month: number) {
        const weeklyMap = new Map<number, { points: number; events: number; activeDays: number }>();

        activities.forEach(activity => {
            const activityDate = new Date(activity.day);
            const weekOfMonth = Math.ceil(activityDate.getDate() / 7);
            
            const existing = weeklyMap.get(weekOfMonth) || { points: 0, events: 0, activeDays: 0 };
            weeklyMap.set(weekOfMonth, {
                points: existing.points + activity.points,
                events: existing.events + activity.events,
                activeDays: existing.activeDays + 1
            });
        });

        return Array.from(weeklyMap.entries())
            .map(([week, data]) => ({
                week,
                points: data.points,
                events: data.events,
                activeDays: data.activeDays
            }))
            .sort((a, b) => a.week - b.week);
    }

    private async calculatePreviousMonthComparison(
        userId: string,
        year: number,
        month: number,
        currentPoints: number,
        currentEvents: number,
        currentActiveDays: number
    ) {
        try {
            // Calcular mes anterior
            const prevMonth = month === 1 ? 12 : month - 1;
            const prevYear = month === 1 ? year - 1 : year;

            const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
            const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);

            const prevActivities = await this.dailyActivityRepository.findByUserAndDateRange(
                userId,
                prevStartDate,
                prevEndDate
            );

            const prevPoints = prevActivities.reduce((sum: number, activity: DailyActivity) => sum + activity.points, 0);
            const prevEvents = prevActivities.reduce((sum: number, activity: DailyActivity) => sum + activity.events, 0);
            const prevActiveDays = prevActivities.length;

            const pointsChange = currentPoints - prevPoints;
            const pointsChangePercentage = prevPoints > 0 
                ? Math.round(((pointsChange / prevPoints) * 100) * 100) / 100 
                : 0;

            return {
                pointsChange,
                pointsChangePercentage,
                activeDaysChange: currentActiveDays - prevActiveDays,
                eventsChange: currentEvents - prevEvents
            };
        } catch (error) {
            console.error('Error calculating previous month comparison:', error);
            return null;
        }
    }
}
