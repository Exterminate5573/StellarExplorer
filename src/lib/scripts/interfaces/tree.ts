import Decimal from "break_eternity.js";
import type { Layer } from "./layer";
import type { Achievement } from "./achievement";

export abstract class Tree {

    public baseCurrency: Decimal;
    public tree: Layer[];
    public achievements: Achievement[] = [];

    constructor(baseCurrency: Decimal) {
        this.baseCurrency = baseCurrency;
        this.tree = this.createTree();
        this.achievements = this.createAchievements();
    }

    public abstract createTree(): Layer[];
    public abstract createAchievements(): Achievement[];

    public getLayer(layerId: string): Layer | undefined {
        return this.tree.find(layer => layer.layerID === layerId);
    }

    public getAchievement(achievementId: string): Achievement | undefined {
        return this.achievements.find(achievement => achievement.id === achievementId);
    }
    
    public comletedAchievementsCount(): number {
        return this.achievements.filter(achievement => achievement.isCompleted()).length;
    }
    
    public abstract currencyPerSecond(): Decimal;

    public reset(): void {
        this.baseCurrency = new Decimal(10);
    }

    update(diff: number) {
        for (const layer of this.tree) {
            layer.update(diff);
        }

        this.baseCurrency = this.baseCurrency.plus(this.currencyPerSecond().times(diff / 1000));
    }

    public getSave(): JSON {
        return {
            baseCurrency: this.baseCurrency,
            tree: this.tree.map(layer => layer.getSave())
        } as unknown as JSON;
    }

    public loadSave(obj: any): void {
        if (obj.baseCurrency) {
            this.baseCurrency = new Decimal(obj.baseCurrency);
        }
        if (obj.tree) {
            for (const layerObj of obj.tree) {
                if (!layerObj.layerID) continue;
                const layer = this.getLayer(layerObj.layerID);
                if (layer) {
                    layer.loadSave(layerObj);
                }
            }
        }
    }
}