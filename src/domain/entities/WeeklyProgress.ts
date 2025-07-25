interface WeeklyProgress {
    id: string;
    userId: string;
    weekStartDate: Date;
    completedDays: boolean[]; // Array de 7 elementos [Monday, Tuesday, ..., Sunday]
    currentStreak: number;
    totalActiveDays: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export default WeeklyProgress;
