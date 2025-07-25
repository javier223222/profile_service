export interface IMessageConsumer {
    consume(queue: string, callback: (message: any) => Promise<void>): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}