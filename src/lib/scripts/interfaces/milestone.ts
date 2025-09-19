import MilestoneTile from "$lib/components/milestone_tile.svelte";
import { GameComponent } from "./game_component";
import type { Layer } from "./layer";

export class Milestone extends GameComponent {

    private achieved: boolean = false;
    private meetsRequirements: () => boolean;

    constructor(componentId: string, layer: Layer, meetsRequirements: () => boolean, unlocked?: () => boolean) {
        super(componentId, layer, MilestoneTile, unlocked);
        this.meetsRequirements = meetsRequirements;
    }

    public isAchieved(): boolean {
        return this.achieved;
    }
    
    public update(diff: number): void {
        if (!this.achieved && this.meetsRequirements()) {
            this.achieved = true;
        }
    }

    public reset(): void {
        this.achieved = false;
    }

    public getColor(): string {
        return this.layer.getColor(this.achieved, false);
    }

    public getHoverColor(): string {
        return this.layer.getColor(this.achieved, false);
    }

    public getBorderColor(): string {
        return this.layer.getColor(true, false);
    }
    
    public getSave(): JSON {
        return {
            componentId: this.componentId,
            achieved: this.achieved
        } as unknown as JSON;
    }

    public loadSave(obj: any): void {
        if (obj.achieved !== undefined) {
            this.achieved = obj.achieved;
        }
    }

}