import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import DailyActivity from '../../domain/entities/DailyActivity';

export interface GetDailyActivitiesRequest {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    domain?: string;
}

export interface GetDailyActivitiesResponse {
    activities: DailyActivity[];
    totalDays: number;
    totalEvents: number;
    totalPoints: number;
    averagePointsPerDay: number;
    mostActiveDay: Date | null;
    domains: string[];
}

export class GetDailyActivitiesUseCase {
    constructor(
        private dailyActivityRepository: DailyActivityRepository
    ) {}

    async execute(request: GetDailyActivitiesRequest): Promise<GetDailyActivitiesResponse> {
        const { userId, startDate, endDate, domain } = request;

        // Si no se especifica fecha, usar los últimos 30 días
        const defaultEndDate = endDate || new Date();
        const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const activities = await this.dailyActivityRepository.findByUserAndDateRange(
            userId,
            defaultStartDate,
            defaultEndDate,
            domain
        );

        // Calcular métricas
        const totalDays = activities.length;
        const totalEvents = activities.reduce((sum: number, activity: DailyActivity) => sum + activity.events, 0);
        const totalPoints = activities.reduce((sum: number, activity: DailyActivity) => sum + activity.points, 0);
        const averagePointsPerDay = totalDays > 0 ? totalPoints / totalDays : 0;

        // Encontrar el día más activo (más puntos)
        const mostActiveDay = activities.length > 0 
            ? activities.reduce((max: DailyActivity, current: DailyActivity) => 
                current.points > max.points ? current : max
              ).day
            : null;

        // Obtener dominios únicos
        const domains = [...new Set(activities.map((activity: DailyActivity) => activity.domain))];

        return {
            activities,
            totalDays,
            totalEvents,
            totalPoints,
            averagePointsPerDay: Math.round(averagePointsPerDay * 100) / 100,
            mostActiveDay,
            domains
        };
    }
}
