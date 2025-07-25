import { LevelRuleRepository } from "../../domain/repositories/LevelRuleRepository";
import LevelRule from "../../domain/entities/LevelRule";
import { PrismaClient } from "@prisma/client";
export class PrismaLevelRuleRepository implements LevelRuleRepository{
    private prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async save(levelRule: LevelRule): Promise<LevelRule> {
      try{

      
        const savedRule = await this.prisma.levelRule.upsert({
            where: { level: levelRule.level },
            update: {
                minPoints: levelRule.minPoints,
                maxPoints: levelRule.maxPoints
            },
            create: {
                level: levelRule.level,
                minPoints: levelRule.minPoints,
                maxPoints: levelRule.maxPoints
            }
        });

        return {
            level: savedRule.level,
            minPoints: savedRule.minPoints,
            maxPoints: savedRule.maxPoints
        };  
    }catch (error) {
        throw new Error(`Error saving level rule: ${error}`);
      }
    }
    async findByLevel(level: number): Promise<LevelRule | null> {
      try{

      
        const rule = await this.prisma.levelRule.findUnique({
            where: { level }
        });

        if (!rule) return null;

        return {
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        };}
        catch (error) {
            throw new Error(`Error finding level rule by level: ${error}`);
        }
    }
    async findAll(): Promise<LevelRule[]> {
        try{

        
        const rules = await this.prisma.levelRule.findMany();
        return rules.map(rule => ({
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        }));
    }catch (error) {
        throw new Error(`Error finding all level rules: ${error}`);}
    }
    async findByMinPoints(minPoints: number): Promise<LevelRule | null> {
      try{

      
        const rule = await this.prisma.levelRule.findFirst({
            where: { minPoints }
        });

        if (!rule) return null;

        return {
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        };}
        catch (error) {
            throw new Error(`Error finding level rule by min points: ${error}`);
        }
    }
    async findByMaxPoints(maxPoints: number): Promise<LevelRule | null> {
      try{

      
        const rule = await this.prisma.levelRule.findFirst({
            where: { maxPoints }
        });

        if (!rule) return null;

        return {
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        };}
        catch (error) {
            throw new Error(`Error finding level rule by max points: ${error}`);
        }
    }
    async findByPointsRange(minPoints: number, maxPoints: number): Promise<LevelRule[]> {
      try{

      
        const rules = await this.prisma.levelRule.findMany({
            where: {
                minPoints: { gte: minPoints },
                maxPoints: { lte: maxPoints }
            }
        });

        return rules.map(rule => ({
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        }));
    }catch (error) {
        throw new Error(`Error finding level rules by points range: ${error}`);
    }
}
    async findByLevelAndPoints(level: number, points: number): Promise<LevelRule | null> {
      try{

      
        const rule = await this.prisma.levelRule.findFirst({
            where: {
                level,
                minPoints: { lte: points },
                maxPoints: { gte: points }
            }
        });

        if (!rule) return null;

        return {
            level: rule.level,
            minPoints: rule.minPoints,
            maxPoints: rule.maxPoints
        };}
        catch (error) {
            throw new Error(`Error finding level rule by level and points: ${error}`);
        }
    }
    async deleteByLevel(level: number): Promise<void> {
      try{

      
        await this.prisma.levelRule.delete({
            where: { level }
        });
    }catch (error) {
        throw new Error(`Error deleting level rule by level: ${error}`);
    }
}

}