import amqp, { Channel, ConsumeMessage } from 'amqplib';
import { IMessageConsumer } from '../../domain/repositories/IMessageConsumer';

export class RabbitMQService implements IMessageConsumer {
    private connection: any | null = null;
    private channel: Channel | null = null;
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    async connect(): Promise<void> {
        try {
            console.log('Connecting to RabbitMQ...');
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            
            
            this.connection.on('error', (err:any) => {
                console.error('RabbitMQ connection error:', err);
            });

            this.connection.on('close', () => {
                console.log('RabbitMQ connection closed');
            });

            console.log('Connected to RabbitMQ successfully');
        } catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    async consume(queue: string, callback: (message: any) => Promise<void>): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            // Asegurar que la cola existe
            await this.channel.assertQueue(queue, { durable: true });

            console.log(`Waiting for messages from queue: ${queue}`);

            await this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
                if (msg) {
                    try {
                        const messageContent = msg.content.toString();
                        console.log('=== RECEIVED NEW MESSAGE ===');
                        console.log('Raw message:', messageContent);
                        
                        const parsedMessage = JSON.parse(messageContent);
                        
                        // Procesar el mensaje
                        await callback(parsedMessage);
                        
                        // Acknowledge el mensaje solo si se procesó correctamente
                        this.channel!.ack(msg);
                        console.log('=== MESSAGE ACKNOWLEDGED ===');
                    } catch (error) {
                        console.error('=== ERROR PROCESSING MESSAGE ===');
                        console.error('Error details:', error);
                        
                        // Para evitar bucles infinitos, hacer acknowledge del mensaje
                        // incluso si hubo error en el procesamiento
                        this.channel!.ack(msg);
                        console.log('Message acknowledged despite error to prevent infinite loop');
                    }
                }
            }, { noAck: false }); // Asegurar que noAck esté en false
        } catch (error) {
            console.error('Error setting up consumer:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('Disconnected from RabbitMQ');
        } catch (error) {
            console.error('Error disconnecting from RabbitMQ:', error);
        }
    }
}