import { Points } from "../value-objects/Points";

interface ProfileUser {
   userId: string;
   pointsCurrent: Points;
   level: number;
   streakBest: number;
   currentStreakDays: number; // Para mostrar "21 day streak"
   avatarUrl?: string | null;
   avatarPublicId?: string | null;
   createdAt?: Date | null;
   updatedAt?: Date | null;
   seniority: string;
   specialization: string;
}

export default ProfileUser;