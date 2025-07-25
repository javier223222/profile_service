import StreakSnapshot from "../entities/StreakSnapshot";

export interface StreakSnapshotRepository {
    // Operaciones básicas CRUD
    save(snapshot: StreakSnapshot): Promise<void>;
    findByUserId(userId: string): Promise<StreakSnapshot | null>;
    deleteByUserId(userId: string): Promise<void>;
    
    // Operaciones específicas para streak management
    getCurrentStreak(userId: string): Promise<StreakSnapshot | null>;
    updateStreakLength(userId: string, newLength: number): Promise<void>;
    updateLastActive(userId: string, date: Date): Promise<void>;
    addPointsToStreak(userId: string, points: number): Promise<void>;
    
    // Para resetear streak cuando se rompe
    resetStreak(userId: string): Promise<void>;
}
