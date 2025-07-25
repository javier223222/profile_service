interface DailyActivity {
    userId: string;
    day: Date;
    domain: string; 
    events: number;
    points: number;
}

export default DailyActivity;
