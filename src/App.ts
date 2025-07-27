import express from 'express';
import fileUpload from 'express-fileupload';
import { PrismaClient } from '@prisma/client';
import { ProfileRoutes } from './interfaces/http/routes/ProfileRoutes';
import { ProfileController } from './interfaces/http/ProfileController';
import { MobileProfileRoutes } from './interfaces/http/routes/MobileProfileRoutes';
import { MobileProfileController } from './interfaces/http/MobileProfileController';
import { PrismaUserProfileRepository } from './infrastructure/prisma/PrismaUserProfileRepository';
import { PrismaWeeklyProgressRepository } from './infrastructure/repositories/PrismaWeeklyProgressRepository';
import { PrismaStreakSnapshotRepository } from './infrastructure/prisma/PrismaStreakSnapshotRepository';
import { CloudinaryService } from './infrastructure/services/CloudinaryService';
import { UploadProfileImageUseCase } from './application/use-cases/UploadProfileImageUseCase';
import { UpdateProfileImageByUrlUseCase } from './application/use-cases/UpdateProfileImageByUrlUseCase';
import { GetUserProfileUseCase } from './application/use-cases/GetUserProfileUseCase';
import { GetOrCreateUserProfileUseCase } from './application/use-cases/GetOrCreateUserProfileUseCase';
import { GetWeeklyProgressUseCase } from './application/use-cases/GetWeeklyProgressUseCase';
import { GetUserStatsUseCase } from './application/use-cases/GetUserStatsUseCase';
import { CreateUserProfileUseCase } from './application/use-cases/CreateUserProfileUseCase';
import { UpdateUserProfileUseCase } from './application/use-cases/UpdateUserProfileUseCase';
import { DeleteUserProfileUseCase } from './application/use-cases/DeleteUserProfileUseCase';
import { AddPointsUseCase } from './application/use-cases/AddPointsUseCase';
import { GetLevelRulesUseCase } from './application/use-cases/GetLevelRulesUseCase';
import { GetDailyActivitiesUseCase } from './application/use-cases/GetDailyActivitiesUseCase';
import { GetMonthlyMetricsUseCase } from './application/use-cases/GetMonthlyMetricsUseCase';
import { GetLeaderboardUseCase } from './application/use-cases/GetLeaderboardUseCase';
import { MessagingService } from './infrastructure/messaging/MessagingService';
import { ProcessProfileUpdateUseCase } from './application/use-cases/ProcessProfileUpdateUseCase';
import { PrismaDailyActivityRepository } from './infrastructure/repositories/PrismaDailyActivityRepository';
import { PrismaLevelRuleRepository } from './infrastructure/prisma/PrismaLevelRuleRepository';

export class App {
    public app: express.Application;
    private messagingService!: MessagingService;
    private prisma: PrismaClient;

    constructor() {
        this.app = express();
        this.prisma = new PrismaClient();
        this.setupMiddleware();
        this.setupRoutes();
        this.initializeMessaging();
    }
    private initializeMessaging(): void {
        // Inicializar repositorios
        const userProfileRepo = new PrismaUserProfileRepository(this.prisma);
        const streakSnapshotRepo = new PrismaStreakSnapshotRepository(this.prisma);
        const weeklyProgressRepo = new PrismaWeeklyProgressRepository(this.prisma);
        const dailyActivityRepo = new PrismaDailyActivityRepository(this.prisma);

        // Inicializar caso de uso
        const processProfileUpdateUseCase = new ProcessProfileUpdateUseCase(
            userProfileRepo,
            streakSnapshotRepo,
            weeklyProgressRepo,
            dailyActivityRepo
        );

       
        const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
        this.messagingService = new MessagingService(rabbitMQUrl, processProfileUpdateUseCase);
    }
     public async startMessaging(): Promise<void> {
        try {
            await this.messagingService.start();
        } catch (error) {
            console.error('Failed to start messaging:', error);
        }
    }

    public async stopMessaging(): Promise<void> {
        if (this.messagingService) {
            await this.messagingService.stop();
        }
    }

    public async close(): Promise<void> {
        await this.stopMessaging();
        await this.prisma.$disconnect();
    }

    private setupMiddleware(): void {
      
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        this.app.use(fileUpload({
            createParentPath: true,
            limits: { fileSize: 5 * 1024 * 1024 }, 
            abortOnLimit: true,
            responseOnLimit: 'File size limit exceeded',
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));

        
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    }

    private setupRoutes(): void {
      
        const userProfileRepository = new PrismaUserProfileRepository(this.prisma);
        const weeklyProgressRepo = new PrismaWeeklyProgressRepository(this.prisma);
        const streakSnapshotRepo = new PrismaStreakSnapshotRepository(this.prisma);
        const cloudinaryService = new CloudinaryService();
        
        const uploadProfileImageUseCase = new UploadProfileImageUseCase(
            userProfileRepository,
            cloudinaryService
        );
        
        const updateProfileImageByUrlUseCase = new UpdateProfileImageByUrlUseCase(
            userProfileRepository,
            cloudinaryService
        );

        const profileController = new ProfileController(
            uploadProfileImageUseCase,
            updateProfileImageByUrlUseCase
        );

        const profileRoutes = new ProfileRoutes(profileController);

        // Configurar rutas móviles
        const dailyActivityRepo = new PrismaDailyActivityRepository(this.prisma);
        const levelRuleRepo = new PrismaLevelRuleRepository(this.prisma);
        
        const getUserProfileUseCase = new GetUserProfileUseCase(userProfileRepository);
        const getOrCreateUserProfileUseCase = new GetOrCreateUserProfileUseCase(userProfileRepository);
        const getWeeklyProgressUseCase = new GetWeeklyProgressUseCase(weeklyProgressRepo);
        const getUserStatsUseCase = new GetUserStatsUseCase(
            userProfileRepository,
            weeklyProgressRepo,
            streakSnapshotRepo
        );

        // Casos de uso adicionales para perfil
        const createUserProfileUseCase = new CreateUserProfileUseCase(userProfileRepository);
        const updateUserProfileUseCase = new UpdateUserProfileUseCase(userProfileRepository);
        const deleteUserProfileUseCase = new DeleteUserProfileUseCase(userProfileRepository);
        
        // Nuevos casos de uso prioritarios
        const addPointsUseCase = new AddPointsUseCase(
            userProfileRepository,
            dailyActivityRepo,
            levelRuleRepo
        );
        const getLevelRulesUseCase = new GetLevelRulesUseCase(levelRuleRepo);
        
        // Nuevos casos de uso para métricas y actividades
        const getDailyActivitiesUseCase = new GetDailyActivitiesUseCase(dailyActivityRepo);
        const getMonthlyMetricsUseCase = new GetMonthlyMetricsUseCase(
            dailyActivityRepo,
            userProfileRepository
        );
        const getLeaderboardUseCase = new GetLeaderboardUseCase(
            userProfileRepository,
            dailyActivityRepo
        );

        const mobileProfileController = new MobileProfileController(
            getUserProfileUseCase,
            getOrCreateUserProfileUseCase,
            getWeeklyProgressUseCase,
            getUserStatsUseCase,
            createUserProfileUseCase,
            updateUserProfileUseCase,
            deleteUserProfileUseCase,
            addPointsUseCase,
            getLevelRulesUseCase,
            getDailyActivitiesUseCase,
            getMonthlyMetricsUseCase,
            getLeaderboardUseCase
        );

        const mobileProfileRoutes = new MobileProfileRoutes(mobileProfileController);

        // Registrar rutas
        this.app.use('/api', profileRoutes.getRouter());
        this.app.use('/api', mobileProfileRoutes.getRouter());

        
        this.app.get('/health', (req, res) => {
            res.status(200).json({ 
                status: 'OK', 
                service: 'profile-service',
                timestamp: new Date().toISOString()
            });
        });

      
        this.app.get('/', (req, res) => {
            res.status(200).json({ 
                message: 'Profile Service API',
                version: '1.0.0',
                endpoints: {
                    
                    'POST /api/users/:userId/avatar/upload': 'Upload profile image file',
                    'PUT /api/users/:userId/avatar/url': 'Update profile image by URL',
             
                    'GET /api/users/:userId/profile': 'Get user profile',
                    'GET /api/users/:userId/weekly-progress': 'Get weekly progress (checkmarks)',
                    'GET /api/users/:userId/stats': 'Get user statistics',
                    'GET /api/users/:userId/dashboard': 'Get dashboard data (recommended)',
                    'POST /api/users': 'Create user profile (avatarUrl optional)',
                    'PUT /api/users/:userId': 'Update user profile',
                    'DELETE /api/users/:userId': 'Delete user profile',
                    'GET /api/users/:userId/complete': 'Get complete user profile',
                    'POST /api/users/:userId/points/add': 'Add points to user (gamification)',
                    'GET /api/levels/rules': 'Get level progression rules',
                    // Analytics & Metrics
                    'GET /api/users/:userId/daily-activities': 'Get daily activities with metrics',
                    'GET /api/users/:userId/monthly-metrics': 'Get comprehensive monthly metrics',
                    'GET /api/leaderboard': 'Get global leaderboard with filters',
                    // Health
                    'GET /health': 'Health check'
                }
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    public async start(port: number = 3000): Promise<void> {
        try {
            await this.prisma.$connect();
            console.log('Connected to database');

            this.app.listen(port, () => {
                console.log(`Profile Service running on port ${port}`);
                console.log(`Health check: http://localhost:${port}/health`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        await this.prisma.$disconnect();
        console.log('Disconnected from database');
    }
}
