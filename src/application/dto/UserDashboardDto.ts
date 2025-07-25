interface UserDashboardDto {
    userId: string;
    currentStreakDays: number;
    pointsCurrent: number;
    level: number;
    weeklyProgress: boolean[]; 
    streakBest: number;
    totalActiveDaysThisWeek: number;
}

export default UserDashboardDto;
