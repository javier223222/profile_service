interface StreakSnapshot {
    userId:string;
    startDate:Date;
    lastActive:Date;
    lengthDays:number;
    pointsInStreak:number;
    updatedAt?: Date | null;
}
export default StreakSnapshot;