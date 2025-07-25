interface StreakHistory{
    id:string;
    userId:string;
    startDate:Date;
    endDate:Date;
    lengthDays:number;
    pointsTotal:number;
    brokenBy ?: string | null; 
    createdAt?: Date | null;


   
}

export default StreakHistory;
