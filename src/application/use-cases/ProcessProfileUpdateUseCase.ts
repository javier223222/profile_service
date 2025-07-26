import { ProfileUpdateMessage } from '../../domain/entities/ProfileUpdateMessage';
import { UserProfileRepository } from '../../domain/repositories/UserProfileRepository';
import { StreakSnapshotRepository } from '../../domain/repositories/StreakSnapshotRepository';
import { WeeklyProgressRepository } from '../../domain/repositories/WeeklyProgressRepository';
import { DailyActivityRepository } from '../../domain/repositories/DailyActivityRepository';
import PracticeEvent from '../../domain/entities/PracticeEvent';
import DailyActivity from '../../domain/entities/DailyActivity';
import { Points } from '../../domain/value-objects/Points';

export class ProcessProfileUpdateUseCase {
    private processedEvents = new Set<string>(); // Cache para evitar duplicados

    constructor(
        private userProfileRepository: UserProfileRepository,
        private streakSnapshotRepository: StreakSnapshotRepository,
        private weeklyProgressRepository: WeeklyProgressRepository,
        private dailyActivityRepository: DailyActivityRepository 
    ) {}

    async execute(message: ProfileUpdateMessage): Promise<void> {
        try {
            console.log(`Processing profile update for user: ${message.user_id}`);

            // 1. Crear un ID único para este evento para evitar duplicados
            const eventId = `${message.user_id}-${message.timestamp}-${message.points_earned}-${message.type}`;
            
            // 2. Verificar si ya procesamos este evento
            if (this.processedEvents.has(eventId)) {
                console.log(`Event already processed: ${eventId}`);
                return;
            }

            // 3. Verificar que el usuario existe
            const user = await this.userProfileRepository.findById(message.user_id);
            if (!user) {
                console.error(`User not found: ${message.user_id}`);
                return;
            }

            // 4. Marcar el evento como procesado
            this.processedEvents.add(eventId);

            // 5. Procesar solo actividades diarias, streaks y progreso semanal
            // NO actualizar puntos directamente para evitar bucles
            await this.updateDailyActivity(message);
            await this.updateStreak(message);
            await this.updateWeeklyProgress(message);

            console.log(`Profile update processed successfully for user: ${message.user_id}`);
            
            // 6. Limpiar cache después de un tiempo para evitar memory leaks
            setTimeout(() => {
                this.processedEvents.delete(eventId);
            }, 300000); // 5 minutos

        } catch (error) {
            console.error('Error processing profile update:', error);
            throw error;
        }
    }

    private async updateDailyActivity(message: ProfileUpdateMessage): Promise<void> {
        try {
            const today = new Date(message.created_at);
            const dayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            // Verificar si ya existe actividad para hoy
            const existingActivity = await this.dailyActivityRepository.findByUserAndDay(
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
                await this.dailyActivityRepository.update(updatedActivity);
                console.log(`Updated daily activity for user ${message.user_id} on ${dayOnly.toISOString().split('T')[0]}`);
            } else {
                // Crear nueva actividad diaria
                const newActivity: DailyActivity = {
                    userId: message.user_id,
                    day: dayOnly,
                    domain: message.type,
                    events: 1,
                    points: message.points_earned
                };
                await this.dailyActivityRepository.create(newActivity);
                console.log(`Created daily activity for user ${message.user_id} on ${dayOnly.toISOString().split('T')[0]}`);
            }
        } catch (error) {
            console.error(`Error updating daily activity for user ${message.user_id}:`, error);
            // No relanzar el error para evitar que falle todo el procesamiento
        }
    }

    private async updateStreak(message: ProfileUpdateMessage): Promise<void> {
        try {
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
                console.log(`Created new streak for user ${message.user_id}`);
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
                    console.log(`Extended streak to ${newLength} days for user ${message.user_id}`);
                } else if (daysDifference === 0) {
                    // Mismo día, solo agregar puntos
                    await this.streakSnapshotRepository.addPointsToStreak(message.user_id, message.points_earned);
                    console.log(`Added points to current day streak for user ${message.user_id}`);
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
                    console.log(`Reset and created new streak for user ${message.user_id}`);
                }
            }
        } catch (error) {
            console.error(`Error updating streak for user ${message.user_id}:`, error);
            // No relanzar el error para evitar que falle todo el procesamiento
        }
    }

    private async updateWeeklyProgress(message: ProfileUpdateMessage): Promise<void> {
        try {
            const activityDate = new Date(message.created_at);
            const currentWeekProgress = await this.weeklyProgressRepository.getCurrentWeekProgress(message.user_id);

            if (currentWeekProgress) {
                await this.weeklyProgressRepository.markDayCompleted(
                    message.user_id, 
                    activityDate
                );
                console.log(`Marked day completed in weekly progress for user ${message.user_id}`);
            } else {
                // Get week start date and check if weekly progress exists
                const weekStartDate = new Date(activityDate);
                weekStartDate.setDate(activityDate.getDate() - activityDate.getDay());
                
                const weekProgress = await this.weeklyProgressRepository.getWeekProgress(message.user_id, weekStartDate);
                if (!weekProgress) {
                    console.log(`Weekly progress not found for user ${message.user_id}, week starting ${weekStartDate.toISOString().split('T')[0]}`);
                }
                
                await this.weeklyProgressRepository.markDayCompleted(
                    message.user_id, 
                    activityDate
                );
                console.log(`Created and marked day completed in weekly progress for user ${message.user_id}`);
            }
        } catch (error) {
            console.error(`Error updating weekly progress for user ${message.user_id}:`, error);
            // No relanzar el error para evitar que falle todo el procesamiento
        }
    }
}