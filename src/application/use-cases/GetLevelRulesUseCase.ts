import { LevelRuleRepository } from '../../domain/repositories/LevelRuleRepository';

export interface LevelRuleResponse {
    level: number;
    minPoints: number;
    maxPoints: number;
}

export class GetLevelRulesUseCase {
    constructor(
        private levelRuleRepository: LevelRuleRepository
    ) {}

    async execute(): Promise<LevelRuleResponse[]> {
        const levelRules = await this.levelRuleRepository.findAll();
        
        return levelRules
            .sort((a, b) => a.level - b.level)
            .map(rule => ({
                level: rule.level,
                minPoints: rule.minPoints,
                maxPoints: rule.maxPoints
            }));
    }
}
