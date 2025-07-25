import { RabbitMQService } from './RabbitMQService';
import { ProfileUpdateMessageHandler } from './ProfileUpdateMessageHandler';
import { ProcessProfileUpdateUseCase } from '../../application/use-cases/ProcessProfileUpdateUseCase';

export class MessagingService {
    private rabbitMQService: RabbitMQService;
    private profileUpdateHandler: ProfileUpdateMessageHandler;

    constructor(
        rabbitMQUrl: string,
        processProfileUpdateUseCase: ProcessProfileUpdateUseCase
    ) {
        this.rabbitMQService = new RabbitMQService(rabbitMQUrl);
        this.profileUpdateHandler = new ProfileUpdateMessageHandler(processProfileUpdateUseCase);
    }

    async start(): Promise<void> {
        try {
            await this.rabbitMQService.connect();
         
            await this.rabbitMQService.consume("any", async (message) => {
                await this.profileUpdateHandler.handle(message);
            });

            console.log('Messaging service started successfully');
        } catch (error) {
            console.error('Failed to start messaging service:', error);
            throw error;
        }
    }

    async stop(): Promise<void> {
        await this.rabbitMQService.disconnect();
        console.log('Messaging service stopped');
    }
}