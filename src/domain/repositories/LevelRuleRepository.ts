
import LevelRule from "../entities/LevelRule";
export interface LevelRuleRepository {
    findByLevel(level: number): Promise<LevelRule | null>;
    findAll(): Promise<LevelRule[]>;
    findByMinPoints(minPoints: number): Promise<LevelRule | null>;
    findByMaxPoints(maxPoints: number): Promise<LevelRule | null>;
    findByPointsRange(minPoints: number, maxPoints: number): Promise<LevelRule[]>;
    findByLevelAndPoints(level: number, points: number): Promise<LevelRule | null>;
    save(levelRule: LevelRule): Promise<LevelRule>;
    deleteByLevel(level: number): Promise<void>;
}