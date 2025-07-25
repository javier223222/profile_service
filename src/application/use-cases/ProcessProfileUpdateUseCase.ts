import { ProfileUpdateMessage } from '../../domain/entities/ProfileUpdateMessage';
import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { StreakSnapshotRepository } from '../../domain/repositories/StreakSnapshotRepository';
import { WeeklyProgressRepository } from '../../domain/repositories/WeeklyProgressRepository';
import PracticeEvent from '../../domain/entities/PracticeEvent';
import DailyActivity from '../../domain/entities/DailyActivity';
import { Points } from '../../domain/value-objects/Points';

export class ProcessProfileUpdateUseCase {
    constructor(
        private userProfileRepository: UserProfileRepository,
        private streakSnapshotRepository: StreakSnapshotRepository,
        private weeklyProgressRepository: WeeklyProgressRepository,
        private dailyActivityRepository: any 
    ) {}

    async execute(message: ProfileUpdateMessage): Promise<void> {
        try {
            console.log(`Processing profile update for user: ${message.user_id}`);

            const user = await this.userProfileRepository.findById(message.user_id);
            if (!user) {
                console.error(`User not found: ${message.user_id}`);
                return;
            }

            
            const practiceEvent: PracticeEvent = {
                eventId: crypto.randomUUID(),
                userId: message.user_id,
                occurredAt: new Date(message.created_at),
                points: new Points(message.points_earned),
                sourceService: message.service,
                domain: message.type,
                createdAt: new Date()
            };

            // 3. Actualizar puntos del usuario
            const newTotalPoints = user.pointsCurrent.value + message.points_earned;
            await this.userProfileRepository.updatePoints(message.user_id, newTotalPoints);

           
            await this.updateDailyActivity(message);

            // 5. Actualizar streak
            await this.updateStreak(message);

            // 6. Actualizar progreso semanal
            await this.updateWeeklyProgress(message);

            console.log(`Profile update processed successfully for user: ${message.user_id}`);
        } catch (error) {
            console.error('Error processing profile update:', error);
            throw error;
        }
    }

    private async updateDailyActivity(message: ProfileUpdateMessage): Promise<void> {
        const today = new Date(message.created_at);
        const dayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Verificar si ya existe actividad para hoy
        const existingActivity = await this.dailyActivityRepository?.findByUserAndDay?.(
            message.user_id, 
            dayOnly
        );

        if (existingActivity) {
            // Actualizar actividad existente
            const updatedActivity: DailyActivity = {
                ...existingActivity,
                events: existingActivity.events + 1,
                points: existingActivity.points + message.points_earned
            };
            await this.dailyActivityRepository?.update?.(updatedActivity);
        } else {
            // Crear nueva actividad diaria
            const newActivity: DailyActivity = {
                userId: message.user_id,
                day: dayOnly,
                domain: message.type,
                events: 1,
                points: message.points_earned
            };
            await this.dailyActivityRepository?.create?.(newActivity);
        }
    }

    private async updateStreak(message: ProfileUpdateMessage): Promise<void> {
        const currentStreak = await this.streakSnapshotRepository.getCurrentStreak(message.user_id);
        const today = new Date(message.created_at);
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (!currentStreak) {
            // Crear nuevo streak
            await this.streakSnapshotRepository.save({
                userId: message.user_id,
                startDate: todayOnly,
                lastActive: todayOnly,
                lengthDays: 1,
                pointsInStreak: message.points_earned,
                updatedAt: new Date()
            });
            await this.userProfileRepository.updateCurrentStreakDays(message.user_id, 1);
        } else {
            const lastActiveDate = new Date(currentStreak.lastActive);
            const daysDifference = Math.floor((todayOnly.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDifference === 1) {
                // Continuar streak
                const newLength = currentStreak.lengthDays + 1;
                await this.streakSnapshotRepository.updateStreakLength(message.user_id, newLength);
                await this.streakSnapshotRepository.updateLastActive(message.user_id, todayOnly);
                await this.streakSnapshotRepository.addPointsToStreak(message.user_id, message.points_earned);
                await this.userProfileRepository.updateCurrentStreakDays(message.user_id, newLength);
            } else if (daysDifference === 0) {
                // Mismo día, solo agregar puntos
                await this.streakSnapshotRepository.addPointsToStreak(message.user_id, message.points_earned);
            } else if (daysDifference > 1) {
                // Streak roto, crear nuevo
                await this.streakSnapshotRepository.resetStreak(message.user_id);
                await this.streakSnapshotRepository.save({
                    userId: message.user_id,
                    startDate: todayOnly,
                    lastActive: todayOnly,
                    lengthDays: 1,
                    pointsInStreak: message.points_earned,
                    updatedAt: new Date()
                });
                await this.userProfileRepository.updateCurrentStreakDays(message.user_id, 1);
            }
        }
    }

    private async updateWeeklyProgress(message: ProfileUpdateMessage): Promise<void> {
        const activityDate = new Date(message.created_at);
        const currentWeekProgress = await this.weeklyProgressRepository.getCurrentWeekProgress(message.user_id);

        if (currentWeekProgress) {
            await this.weeklyProgressRepository.markDayCompleted(
                message.user_id, 
                activityDate
            );
        } else {
            // Get week start date and check if weekly progress exists
            const weekStartDate = new Date(activityDate);
            weekStartDate.setDate(activityDate.getDate() - activityDate.getDay());
            
            const weekProgress = await this.weeklyProgressRepository.getWeekProgress(message.user_id, weekStartDate);
            if (!weekProgress) {
                // Create new weekly progress logic should be handled by the repository or domain service
                console.log(`Weekly progress not found for user ${message.user_id}, week starting ${weekStartDate}`);
            }
            
            await this.weeklyProgressRepository.markDayCompleted(
                message.user_id, 
                activityDate
            );
        }
    }
}