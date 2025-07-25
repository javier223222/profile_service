import { Request, Response } from 'express';
import { GetUserProfileUseCase } from 'application/use-cases/GetUserProfileUseCase';
import { GetWeeklyProgressUseCase } from 'application/use-cases/GetWeeklyProgressUseCase';
import { GetUserStatsUseCase } from 'application/use-cases/GetUserStatsUseCase';
import { UpdateUserProfileUseCase } from 'application/use-cases/UpdateUserProfileUseCase';
import { DeleteUserProfileUseCase } from 'application/use-cases/DeleteUserProfileUseCase';
import { CreateUserProfileUseCase } from 'application/use-cases/CreateUserProfileUseCase';
import { AddPointsUseCase } from 'application/use-cases/AddPointsUseCase';
import { GetLevelRulesUseCase } from 'application/use-cases/GetLevelRulesUseCase';
import { GetDailyActivitiesUseCase } from 'application/use-cases/GetDailyActivitiesUseCase';
import { GetMonthlyMetricsUseCase } from 'application/use-cases/GetMonthlyMetricsUseCase';
import { GetLeaderboardUseCase } from 'application/use-cases/GetLeaderboardUseCase';

export class MobileProfileController {
    constructor(
        private getUserProfileUseCase: GetUserProfileUseCase,
        private getWeeklyProgressUseCase: GetWeeklyProgressUseCase,
        private getUserStatsUseCase: GetUserStatsUseCase,
        private createUserProfileUseCase: CreateUserProfileUseCase,
        private updateUserProfileUseCase: UpdateUserProfileUseCase,
        private deleteUserProfileUseCase: DeleteUserProfileUseCase,
        private addPointsUseCase: AddPointsUseCase,
        private getLevelRulesUseCase: GetLevelRulesUseCase,
        private getDailyActivitiesUseCase: GetDailyActivitiesUseCase,
        private getMonthlyMetricsUseCase: GetMonthlyMetricsUseCase,
        private getLeaderboardUseCase: GetLeaderboardUseCase
    ) {}

    // GET /api/users/:userId/profile
    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const profile = await this.getUserProfileUseCase.execute(userId);

            if (!profile) {
                res.status(404).json({ error: 'User profile not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    userId: profile.userId,
                    seniority: profile.seniority,
                    specialization: profile.specialization,
                    currentStreakDays: profile.currentStreakDays,
                    pointsCurrent: profile.pointsCurrent.value,
                    level: profile.level,
                    avatarUrl: profile.avatarUrl
                }
            });
        } catch (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/users/:userId/weekly-progress
    async getWeeklyProgress(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const weeklyProgress = await this.getWeeklyProgressUseCase.execute(userId);

            res.status(200).json({
                success: true,
                data: {
                    weekStartDate: weeklyProgress.weekStartDate,
                    completedDays: weeklyProgress.completedDays, // [false, true, true, false, true, false, false] = M T W T F S S
                    totalActiveDays: weeklyProgress.totalActiveDays,
                    currentStreak: weeklyProgress.currentStreak
                }
            });
        } catch (error) {
            console.error('Error getting weekly progress:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/users/:userId/stats
    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const stats = await this.getUserStatsUseCase.execute(userId);

            res.status(200).json({
                success: true,
                data: {
                    currentStreakDays: stats.currentStreakDays,
                    bestStreak: stats.bestStreak,
                    pointsCurrent: stats.pointsCurrent,
                    pointsToNextLevel: stats.pointsToNextLevel,
                    level: stats.level,
                    totalActiveDays: stats.totalActiveDays,
                    thisWeekActiveDays: stats.thisWeekActiveDays,
                    weeklyProgress: stats.weeklyProgress // Array de booleans para M-S
                }
            });
        } catch (error) {
            console.error('Error getting user stats:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/users/:userId/dashboard
    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            // Obtener todos los datos necesarios para el dashboard
            const [profile, weeklyProgress, stats] = await Promise.all([
                this.getUserProfileUseCase.execute(userId),
                this.getWeeklyProgressUseCase.execute(userId),
                this.getUserStatsUseCase.execute(userId)
            ]);

            if (!profile) {
                res.status(404).json({ error: 'User profile not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    // Datos del perfil
                    user: {
                        userId: profile.userId,
                        seniority: profile.seniority,
                        specialization: profile.specialization,
                        avatarUrl: profile.avatarUrl
                    },
                    // Datos de racha
                    streak: {
                        currentDays: profile.currentStreakDays,
                        bestDays: stats.bestStreak
                    },
                    // Datos de puntos
                    points: {
                        current: profile.pointsCurrent.value,
                        toNextLevel: stats.pointsToNextLevel,
                        level: profile.level
                    },
                    // Progreso semanal (checkmarks)
                    weekly: {
                        weekStartDate: weeklyProgress.weekStartDate,
                        completedDays: weeklyProgress.completedDays, // [M, T, W, T, F, S, S]
                        totalActiveDays: weeklyProgress.totalActiveDays
                    }
                }
            });
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/users - Crear nuevo perfil de usuario
    async createUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId, seniority, specialization, avatarUrl } = req.body;

            if (!userId || !seniority || !specialization) {
                res.status(400).json({ 
                    error: 'userId, seniority, and specialization are required' 
                });
                return;
            }
            console.log('Creating user profile:', { userId, seniority, specialization, avatarUrl });

            const profile = await this.createUserProfileUseCase.execute({
                userId,
                seniority,
                specialization,
                avatarUrl
            });

            res.status(201).json({
                success: true,
                data: {
                    userId: profile.userId,
                    seniority: profile.seniority,
                    specialization: profile.specialization,
                    currentStreakDays: profile.currentStreakDays,
                    pointsCurrent: profile.pointsCurrent.value,
                    level: profile.level,
                    streakBest: profile.streakBest,
                    avatarUrl: profile.avatarUrl,
                    createdAt: profile.createdAt
                }
            });
        } catch (error) {
            console.error('Error creating user profile:', error);
            if (error instanceof Error && error.message === 'User profile already exists') {
                res.status(409).json({ error: 'User profile already exists' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // PUT /api/users/:userId - Actualizar perfil de usuario
    async updateUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { seniority, specialization, avatarUrl } = req.body;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const profile = await this.updateUserProfileUseCase.execute({
                userId,
                seniority,
                specialization,
                avatarUrl
            });

            res.status(200).json({
                success: true,
                data: {
                    userId: profile.userId,
                    seniority: profile.seniority,
                    specialization: profile.specialization,
                    currentStreakDays: profile.currentStreakDays,
                    pointsCurrent: profile.pointsCurrent.value,
                    level: profile.level,
                    streakBest: profile.streakBest,
                    avatarUrl: profile.avatarUrl,
                    updatedAt: profile.updatedAt
                }
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            if (error instanceof Error && error.message === 'User profile not found') {
                res.status(404).json({ error: 'User profile not found' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // DELETE /api/users/:userId - Eliminar perfil de usuario
    async deleteUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            // Eliminar usando el caso de uso
            const deleted = await this.deleteUserProfileUseCase.execute(userId);

            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: 'User profile deleted successfully'
                });
            } else {
                res.status(500).json({ error: 'Failed to delete user profile' });
            }
        } catch (error) {
            console.error('Error deleting user profile:', error);
            if (error instanceof Error && error.message === 'User profile not found') {
                res.status(404).json({ error: 'User profile not found' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // GET /api/users/:userId/complete - Obtener perfil completo con todos los detalles
    async getCompleteProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            // Obtener todos los datos del usuario
            const [profile, weeklyProgress, stats] = await Promise.all([
                this.getUserProfileUseCase.execute(userId),
                this.getWeeklyProgressUseCase.execute(userId),
                this.getUserStatsUseCase.execute(userId)
            ]);

            if (!profile) {
                res.status(404).json({ error: 'User profile not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    // Información básica del perfil
                    profile: {
                        userId: profile.userId,
                        seniority: profile.seniority,
                        specialization: profile.specialization,
                        avatarUrl: profile.avatarUrl,
                        createdAt: profile.createdAt,
                        updatedAt: profile.updatedAt
                    },
                    // Estadísticas de puntos y nivel
                    progress: {
                        pointsCurrent: profile.pointsCurrent.value,
                        level: profile.level,
                        pointsToNextLevel: stats.pointsToNextLevel
                    },
                    // Estadísticas de racha
                    streaks: {
                        currentDays: profile.currentStreakDays,
                        bestDays: stats.bestStreak
                    },
                    // Actividad y progreso
                    activity: {
                        totalActiveDays: stats.totalActiveDays,
                        thisWeekActiveDays: stats.thisWeekActiveDays,
                        weeklyProgress: stats.weeklyProgress
                    },
                    // Datos específicos de la semana actual
                    currentWeek: {
                        weekStartDate: weeklyProgress.weekStartDate,
                        completedDays: weeklyProgress.completedDays,
                        totalActiveDays: weeklyProgress.totalActiveDays,
                        currentStreak: weeklyProgress.currentStreak
                    }
                }
            });
        } catch (error) {
            console.error('Error getting complete profile:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/users/:userId/points/add - Agregar puntos por actividad
    async addPoints(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { points, domain, sessionId, sourceService } = req.body;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            if (!points || !domain) {
                res.status(400).json({ 
                    error: 'points and domain are required' 
                });
                return;
            }

            if (typeof points !== 'number' || points <= 0) {
                res.status(400).json({ 
                    error: 'points must be a positive number' 
                });
                return;
            }

            const result = await this.addPointsUseCase.execute({
                userId,
                points,
                domain,
                sessionId,
                sourceService: sourceService || 'mobile-app'
            });

            res.status(200).json({
                success: true,
                data: {
                    pointsAdded: result.pointsAdded,
                    totalPoints: result.totalPoints,
                    previousLevel: result.previousLevel,
                    currentLevel: result.currentLevel,
                    leveledUp: result.leveledUp,
                    pointsToNextLevel: result.pointsToNextLevel
                }
            });
        } catch (error) {
            console.error('Error adding points:', error);
            if (error instanceof Error && error.message === 'User profile not found') {
                res.status(404).json({ error: 'User profile not found' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    // GET /api/levels/rules - Obtener reglas de niveles
    async getLevelRules(req: Request, res: Response): Promise<void> {
        try {
            const levelRules = await this.getLevelRulesUseCase.execute();

            res.status(200).json({
                success: true,
                data: levelRules
            });
        } catch (error) {
            console.error('Error getting level rules:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/users/:userId/daily-activities - Obtener actividades diarias
    async getDailyActivities(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { startDate, endDate, domain } = req.query;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const request = {
                userId,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                domain: domain as string
            };

            const result = await this.getDailyActivitiesUseCase.execute(request);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error getting daily activities:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/users/:userId/monthly-metrics - Obtener métricas mensuales
    async getMonthlyMetrics(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { year, month } = req.query;

            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            const request = {
                userId,
                year: year ? parseInt(year as string) : undefined,
                month: month ? parseInt(month as string) : undefined
            };

            const result = await this.getMonthlyMetricsUseCase.execute(request);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error getting monthly metrics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/leaderboard - Obtener leaderboard global
    async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const { 
                domain, 
                timeframe, 
                limit, 
                offset, 
                seniority, 
                specialization 
            } = req.query;

            const request = {
                domain: domain as string,
                timeframe: (timeframe as 'all-time' | 'monthly' | 'weekly') || 'all-time',
                limit: limit ? parseInt(limit as string) : 50,
                offset: offset ? parseInt(offset as string) : 0,
                seniority: seniority as string,
                specialization: specialization as string
            };

            const result = await this.getLeaderboardUseCase.execute(request);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
