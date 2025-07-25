import { Router } from 'express';
import { MobileProfileController } from '../MobileProfileController';

export class MobileProfileRoutes {
    private router: Router;
    private mobileProfileController: MobileProfileController;

    constructor(mobileProfileController: MobileProfileController) {
        this.router = Router();
        this.mobileProfileController = mobileProfileController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // GET /api/users/:userId/profile - Obtener perfil básico
        this.router.get(
            '/users/:userId/profile', 
            this.mobileProfileController.getUserProfile.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/weekly-progress - Obtener progreso semanal (checkmarks)
        this.router.get(
            '/users/:userId/weekly-progress', 
            this.mobileProfileController.getWeeklyProgress.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/stats - Obtener estadísticas completas
        this.router.get(
            '/users/:userId/stats', 
            this.mobileProfileController.getUserStats.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/dashboard - Obtener todos los datos para el dashboard (RECOMENDADO)
        this.router.get(
            '/users/:userId/dashboard', 
            this.mobileProfileController.getDashboardData.bind(this.mobileProfileController)
        );

        // POST /api/users - Crear nuevo perfil de usuario
        this.router.post(
            '/users', 
            this.mobileProfileController.createUserProfile.bind(this.mobileProfileController)
        );

        // PUT /api/users/:userId - Actualizar perfil de usuario
        this.router.put(
            '/users/:userId', 
            this.mobileProfileController.updateUserProfile.bind(this.mobileProfileController)
        );

        // DELETE /api/users/:userId - Eliminar perfil de usuario
        this.router.delete(
            '/users/:userId', 
            this.mobileProfileController.deleteUserProfile.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/complete - Obtener perfil completo con todos los detalles
        this.router.get(
            '/users/:userId/complete', 
            this.mobileProfileController.getCompleteProfile.bind(this.mobileProfileController)
        );

        // POST /api/users/:userId/points/add - Agregar puntos por actividad
        this.router.post(
            '/users/:userId/points/add', 
            this.mobileProfileController.addPoints.bind(this.mobileProfileController)
        );

        // GET /api/levels/rules - Obtener reglas de niveles
        this.router.get(
            '/levels/rules', 
            this.mobileProfileController.getLevelRules.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/daily-activities - Obtener actividades diarias
        this.router.get(
            '/users/:userId/daily-activities', 
            this.mobileProfileController.getDailyActivities.bind(this.mobileProfileController)
        );

        // GET /api/users/:userId/monthly-metrics - Obtener métricas mensuales
        this.router.get(
            '/users/:userId/monthly-metrics', 
            this.mobileProfileController.getMonthlyMetrics.bind(this.mobileProfileController)
        );

        // GET /api/leaderboard - Obtener leaderboard global
        this.router.get(
            '/leaderboard', 
            this.mobileProfileController.getLeaderboard.bind(this.mobileProfileController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
