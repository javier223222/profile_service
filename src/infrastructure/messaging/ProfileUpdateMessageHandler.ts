import { ProcessProfileUpdateUseCase } from '../../application/use-cases/ProcessProfileUpdateUseCase';
import {ProfileUpdateMessage} from '../../domain/entities/ProfileUpdateMessage';

export class ProfileUpdateMessageHandler {
    constructor(
        private processProfileUpdateUseCase: ProcessProfileUpdateUseCase
    ) {}

    async handle(message: ProfileUpdateMessage): Promise<void> {
        try {
            console.log('Handling profile update message:', message);
            
            // Validar estructura del mensaje
            this.validateMessage(message);
            
            // Procesar el mensaje
            await this.processProfileUpdateUseCase.execute(message);
            
        } catch (error) {
            console.error('Error handling profile update message:', error);
            throw error;
        }
    }

    private validateMessage(message: ProfileUpdateMessage): void {
        const requiredFields = ['event', 'type', 'created_at', 'points_earned', 'user_id', 'timestamp', 'service', 'version', 'queue'];
        
        for (const field of requiredFields) {
            if (!(field in message)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (typeof message.points_earned !== 'number') {
            throw new Error('points_earned must be a number');
        }

        if (message.points_earned < 0) {
            throw new Error('points_earned cannot be negative');
        }
    }
}