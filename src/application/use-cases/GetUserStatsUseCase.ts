import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { WeeklyProgressRepository } from '../../domain/repositories/WeeklyProgressRepository';
import { StreakSnapshotRepository } from '../../domain/repositories/StreakSnapshotRepository';

interface UserStats {
    currentStreakDays: number;
    bestStreak: number;
    pointsCurrent: number;
    pointsToNextLevel: number;
    level: number;
    totalActiveDays: number;
    thisWeekActiveDays: number;
    weeklyProgress: boolean[];
}

export class GetUserStatsUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private weeklyProgressRepository: WeeklyProgressRepository,
        private streakSnapshotRepository: StreakSnapshotRepository
    ) {}

    async execute(userId: string): Promise<UserStats> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Obtener datos del perfil
            const profile = await this.userProfileRepository.findById(userId);
            if (!profile) {
                throw new Error('User profile not found');
            }

            // Obtener progreso semanal actual
            const weeklyProgress = await this.weeklyProgressRepository.getCurrentWeekProgress(userId);
            const completedDays = weeklyProgress?.completedDays || [false, false, false, false, false, false, false];
            const thisWeekActiveDays = completedDays.filter(day => day).length;

            // Calcular puntos para siguiente nivel
            const pointsToNextLevel = this.calculatePointsToNextLevel(profile.pointsCurrent.value, profile.level);

            // Obtener mejor racha (se puede calcular desde el perfil o historial)
            const bestStreak = Math.max(profile.currentStreakDays, profile.streakBest || 0);

            // Calcular días activos totales (esto podría venir de algún cálculo agregado)
            const totalActiveDays = weeklyProgress?.totalActiveDays || 0;

            return {
                currentStreakDays: profile.currentStreakDays,
                bestStreak: bestStreak,
                pointsCurrent: profile.pointsCurrent.value,
                pointsToNextLevel: pointsToNextLevel,
                level: profile.level,
                totalActiveDays: totalActiveDays,
                thisWeekActiveDays: thisWeekActiveDays,
                weeklyProgress: completedDays
            };
        } catch (error) {
            console.error('Error in GetUserStatsUseCase:', error);
            throw error;
        }
    }

    private calculatePointsToNextLevel(currentPoints: number, currentLevel: number): number {
        // Lógica simple: cada nivel requiere 1000 puntos más que el anterior
        // Nivel 1: 0-999, Nivel 2: 1000-1999, etc.
        const pointsForCurrentLevel = (currentLevel - 1) * 1000;
        const pointsForNextLevel = currentLevel * 1000;
        
        return pointsForNextLevel - currentPoints;
    }
}
