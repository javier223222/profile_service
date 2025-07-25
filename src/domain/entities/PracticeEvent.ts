import { Points } from "../value-objects/Points";

interface PracticeEvent {
    userId: string;
    eventId: string;
    occurredAt: Date;
    points: Points;
    sourceService: string;
    domain: string;
    createdAt?: Date | null;
}

export default PracticeEvent;