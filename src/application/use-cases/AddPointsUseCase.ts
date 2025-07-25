import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import { LevelRuleRepository } from '../../domain/repositories/LevelRuleRepository';
import { Points } from '../../domain/value-objects/Points';

export interface AddPointsRequest {
    userId: string;
    points: number;
    domain: string;
    sessionId?: string;
    sourceService?: string;
}

export interface AddPointsResponse {
    pointsAdded: number;
    totalPoints: number;
    previousLevel: number;
    currentLevel: number;
    leveledUp: boolean;
    pointsToNextLevel: number;
}

export class AddPointsUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private dailyActivityRepository: DailyActivityRepository,
        private levelRuleRepository: LevelRuleRepository
    ) {}

    async execute(request: AddPointsRequest): Promise<AddPointsResponse> {
        // Verificar que el usuario existe
        const profile = await this.userProfileRepository.findById(request.userId);
        if (!profile) {
            throw new Error('User profile not found');
        }

        const previousLevel = profile.level;
        const previousPoints = profile.pointsCurrent.value;

        // Calcular nuevos puntos
        const newTotalPoints = previousPoints + request.points;
        const newPoints = new Points(newTotalPoints);

        // Calcular nuevo nivel
        const newLevel = await this.calculateLevel(newTotalPoints);
        const leveledUp = newLevel > previousLevel;

        // Actualizar perfil del usuario
        const updatedProfile = {
            ...profile,
            pointsCurrent: newPoints,
            level: newLevel,
            updatedAt: new Date()
        };

        await this.userProfileRepository.update(updatedProfile);

        // Registrar actividad diaria
        await this.registerDailyActivity(
            request.userId,
            request.domain,
            request.points
        );

        // Calcular puntos para el siguiente nivel
        const pointsToNextLevel = await this.calculatePointsToNextLevel(newTotalPoints, newLevel);

        return {
            pointsAdded: request.points,
            totalPoints: newTotalPoints,
            previousLevel,
            currentLevel: newLevel,
            leveledUp,
            pointsToNextLevel
        };
    }

    private async calculateLevel(totalPoints: number): Promise<number> {
        const levelRules = await this.levelRuleRepository.findAll();
        
        // Encontrar el nivel apropiado
        for (const rule of levelRules.sort((a, b) => b.level - a.level)) {
            if (totalPoints >= rule.minPoints) {
                return rule.level;
            }
        }
        
        return 1; // Nivel mínimo
    }

    private async calculatePointsToNextLevel(currentPoints: number, currentLevel: number): Promise<number> {
        const levelRules = await this.levelRuleRepository.findAll();
        const nextLevelRule = levelRules.find(rule => rule.level === currentLevel + 1);
        
        if (!nextLevelRule) {
            return 0; // Nivel máximo alcanzado
        }
        
        return nextLevelRule.minPoints - currentPoints;
    }

    private async registerDailyActivity(userId: string, domain: string, points: number): Promise<void> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        try {
            // Buscar actividad existente del día
            const existingActivity = await this.dailyActivityRepository.findByUserAndDay(userId, today);

            if (existingActivity) {
                // Actualizar actividad existente
                const updatedActivity = {
                    ...existingActivity,
                    events: existingActivity.events + 1,
                    points: existingActivity.points + points
                };
                await this.dailyActivityRepository.update(updatedActivity);
            } else {
                // Crear nueva actividad del día
                const newActivity = {
                    userId,
                    day: today,
                    domain,
                    events: 1,
                    points
                };
                await this.dailyActivityRepository.create(newActivity);
            }
        } catch (error) {
            console.error('Error registering daily activity:', error);
            // No lanzamos error aquí para no afectar el proceso principal
        }
    }
}
