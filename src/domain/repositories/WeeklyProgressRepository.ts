import WeeklyProgress from "../entities/WeeklyProgress";

export interface WeeklyProgressRepository {
    // Operaciones básicas CRUD
    save(progress: WeeklyProgress): Promise<void>;
    findByUserIdAndWeek(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null>;
    deleteById(id: string): Promise<void>;
    
    // Operaciones específicas para la app móvil
    getCurrentWeekProgress(userId: string): Promise<WeeklyProgress | null>;
    getWeekProgress(userId: string, weekStartDate: Date): Promise<WeeklyProgress | null>;
    
    // Para los checkmarks diarios (M, T, W, T, F, S, S)
    markDayCompleted(userId: string, date: Date): Promise<void>;
    getCompletedDaysThisWeek(userId: string): Promise<boolean[]>;
    
    // Historial y estadísticas
    getWeeklyHistory(userId: string, limit?: number): Promise<WeeklyProgress[]>;
    updateTotalActiveDays(userId: string, weekStartDate: Date, totalDays: number): Promise<void>;
}

export default WeeklyProgressRepository;
