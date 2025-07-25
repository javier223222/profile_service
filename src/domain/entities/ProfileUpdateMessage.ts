export interface ProfileUpdateMessage{
    event: string,
    type: string,
    created_at: string,
    points_earned: number,
    user_id: string,
    timestamp: string,
    service: string,
    version: string,
    queue: string
}