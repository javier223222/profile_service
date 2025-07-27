import { ProcessProfileUpdateUseCase } from '../../application/use-cases/ProcessProfileUpdateUseCase';
import {ProfileUpdateMessage} from '../../domain/entities/ProfileUpdateMessage';
import { UserProfileValidator } from '../validation/UserProfileValidator';
import { InputSanitizer } from '../validation/InputSanitizer';

export class ProfileUpdateMessageHandler {
    constructor(
        private processProfileUpdateUseCase: ProcessProfileUpdateUseCase
    ) {}

    async handle(message: ProfileUpdateMessage): Promise<void> {
        try {
            console.log('=== HANDLING PROFILE UPDATE MESSAGE ===');
            console.log('Message received:', JSON.stringify(message, null, 2));
            
            // Validar estructura del mensaje
            this.validateMessage(message);
            
            // Verificar que no sea un mensaje duplicado reciente
            if (this.isDuplicateMessage(message)) {
                console.log('Duplicate message detected, skipping processing');
                return;
            }
            
            // Procesar el mensaje
            await this.processProfileUpdateUseCase.execute(message);
            
            console.log('=== MESSAGE PROCESSED SUCCESSFULLY ===');
            
        } catch (error) {
            console.error('=== ERROR HANDLING MESSAGE ===');
            console.error('Error details:', error);
            console.error('Message that caused error:', JSON.stringify(message, null, 2));
            // No relanzar el error para evitar reprocessing infinito
        }
    }

    private isDuplicateMessage(message: ProfileUpdateMessage): boolean {
        // Implementar lógica simple para detectar duplicados
        const messageId = `${message.user_id}-${message.timestamp}-${message.type}`;
        const now = Date.now();
        const messageTime = new Date(message.timestamp).getTime();
        
        // Si el mensaje es muy viejo (más de 1 hora), ignorarlo
        if (now - messageTime > 3600000) {
            console.log('Message too old, ignoring');
            return true;
        }
        
        return false;
    }

    private validateMessage(message: ProfileUpdateMessage): void {
        console.log('Validating message structure...');
        
        const requiredFields = ['event', 'type', 'created_at', 'points_earned', 'user_id', 'timestamp', 'service', 'version', 'queue'];
        
        for (const field of requiredFields) {
            if (!(field in message)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validar points_earned con los nuevos validadores
        const pointsValidation = UserProfileValidator.validatePoints(message.points_earned);
        if (!pointsValidation.isValid) {
            throw new Error(`Invalid points_earned: ${pointsValidation.error}`);
        }

        // Sanitizar y validar user_id
        const sanitizedUserId = InputSanitizer.sanitizeUserId(message.user_id);
        const userIdValidation = UserProfileValidator.validateUserId(sanitizedUserId);
        if (!userIdValidation.isValid) {
            console.warn(`[VALIDATION WARNING] Invalid user_id in message: ${userIdValidation.error}`);
        }

        // Nota: domain no está en ProfileUpdateMessage interface, se valida en el use case si está presente
        
        if (message.points_earned > 500) {
            console.warn(`[VALIDATION WARNING] Unusually high points earned: ${message.points_earned} for user ${message.user_id}`);
        }

        console.log('Message validation passed');
    }
}