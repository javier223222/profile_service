import { WeeklyProgressRepository } from '../../domain/repositories/WeeklyProgressRepository';
import WeeklyProgress from '../../domain/entities/WeeklyProgress';

export class GetWeeklyProgressUseCase {
    constructor(
        private weeklyProgressRepository: WeeklyProgressRepository
    ) {}

    async execute(userId: string): Promise<WeeklyProgress> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Intentar obtener el progreso de la semana actual
            let weeklyProgress = await this.weeklyProgressRepository.getCurrentWeekProgress(userId);
            
            if (!weeklyProgress) {
                // Si no existe, crear un progreso vacío para la semana actual
                const today = new Date();
                const weekStartDate = this.getWeekStart(today);
                
                weeklyProgress = {
                    id: crypto.randomUUID(),
                    userId: userId,
                    weekStartDate: weekStartDate,
                    completedDays: [false, false, false, false, false, false, false], // M T W T F S S
                    currentStreak: 0,
                    totalActiveDays: 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }

            return weeklyProgress;
        } catch (error) {
            console.error('Error in GetWeeklyProgressUseCase:', error);
            throw error;
        }
    }

    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
        return new Date(d.setDate(diff));
    }
}
