import dotenv from 'dotenv';
import { App } from './App';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
    try {
        const app = new App();
        
        // Iniciar servidor HTTP
        const server = app.app.listen(PORT, () => {
            console.log(`Profile Service running on port ${PORT}`);
        });

        // Iniciar consumo de mensajes
        await app.startMessaging();

        // Manejo de cierre graceful
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            server.close(async () => {
                await app.close();
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('SIGINT received, shutting down gracefully');
            server.close(async () => {
                await app.close();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}

bootstrap();