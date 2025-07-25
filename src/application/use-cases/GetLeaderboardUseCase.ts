import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import ProfileUser from '../../domain/entities/ProfileUser';

export interface LeaderboardEntry {
    userId: string;
    pointsCurrent: number;
    level: number;
    streakBest: number;
    currentStreakDays: number;
    avatarUrl: string | null;
    seniority: string;
    specialization: string;
    rank: number;
    recentActivity: {
        last7Days: number;
        last30Days: number;
    };
}

export interface GetLeaderboardRequest {
    domain?: string;
    timeframe?: 'all-time' | 'monthly' | 'weekly';
    limit?: number;
    offset?: number;
    seniority?: string;
    specialization?: string;
}

export interface GetLeaderboardResponse {
    leaderboard: LeaderboardEntry[];
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    filters: {
        domain?: string;
        timeframe: string;
        seniority?: string;
        specialization?: string;
    };
}

export class GetLeaderboardUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private dailyActivityRepository: DailyActivityRepository
    ) {}

    async execute(request: GetLeaderboardRequest): Promise<GetLeaderboardResponse> {
        const {
            domain,
            timeframe = 'all-time',
            limit = 50,
            offset = 0,
            seniority,
            specialization
        } = request;

        // Obtener todos los perfiles de usuario con filtros
        const allProfiles = await this.userProfileRepository.findAllWithFilters({
            seniority,
            specialization
        });

        if (allProfiles.length === 0) {
            return {
                leaderboard: [],
                totalUsers: 0,
                currentPage: 1,
                totalPages: 0,
                filters: { domain, timeframe, seniority, specialization }
            };
        }

        // Calcular puntos según el timeframe
        const leaderboardEntries: LeaderboardEntry[] = [];

        for (const profile of allProfiles) {
            let relevantPoints = profile.pointsCurrent.value;

            if (timeframe !== 'all-time') {
                relevantPoints = await this.calculateTimeframePoints(
                    profile.userId,
                    timeframe,
                    domain
                );
            }

            // Calcular actividad reciente
            const recentActivity = await this.calculateRecentActivity(
                profile.userId,
                domain
            );

            leaderboardEntries.push({
                userId: profile.userId,
                pointsCurrent: relevantPoints,
                level: profile.level,
                streakBest: profile.streakBest,
                currentStreakDays: profile.currentStreakDays,
                avatarUrl: profile.avatarUrl || null,
                seniority: profile.seniority,
                specialization: profile.specialization,
                rank: 0, // Se asignará después del ordenamiento
                recentActivity
            });
        }

        // Ordenar por puntos (descendente)
        leaderboardEntries.sort((a, b) => b.pointsCurrent - a.pointsCurrent);

        // Asignar ranks
        leaderboardEntries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Aplicar paginación
        const totalUsers = leaderboardEntries.length;
        const totalPages = Math.ceil(totalUsers / limit);
        const currentPage = Math.floor(offset / limit) + 1;
        
        const paginatedLeaderboard = leaderboardEntries.slice(offset, offset + limit);

        return {
            leaderboard: paginatedLeaderboard,
            totalUsers,
            currentPage,
            totalPages,
            filters: { domain, timeframe, seniority, specialization }
        };
    }

    private async calculateTimeframePoints(
        userId: string,
        timeframe: 'monthly' | 'weekly',
        domain?: string
    ): Promise<number> {
        const now = new Date();
        let startDate: Date;

        if (timeframe === 'weekly') {
            // Última semana
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            // Último mes
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        try {
            const activities = await this.dailyActivityRepository.findByUserAndDateRange(
                userId,
                startDate,
                now,
                domain
            );

            return activities.reduce((sum: number, activity) => sum + activity.points, 0);
        } catch (error) {
            console.error(`Error calculating ${timeframe} points for user ${userId}:`, error);
            return 0;
        }
    }

    private async calculateRecentActivity(userId: string, domain?: string) {
        const now = new Date();
        
        try {
            // Últimos 7 días
            const last7DaysStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const last7DaysActivities = await this.dailyActivityRepository.findByUserAndDateRange(
                userId,
                last7DaysStart,
                now,
                domain
            );

            // Últimos 30 días
            const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const last30DaysActivities = await this.dailyActivityRepository.findByUserAndDateRange(
                userId,
                last30DaysStart,
                now,
                domain
            );

            return {
                last7Days: last7DaysActivities.reduce((sum: number, activity) => sum + activity.points, 0),
                last30Days: last30DaysActivities.reduce((sum: number, activity) => sum + activity.points, 0)
            };
        } catch (error) {
            console.error(`Error calculating recent activity for user ${userId}:`, error);
            return { last7Days: 0, last30Days: 0 };
        }
    }
}
