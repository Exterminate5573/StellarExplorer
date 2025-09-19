import type Decimal from "break_eternity.js";
import { GameComponent } from "./game_component";
import type { Layer } from "./layer";
import UpgradeButton from "$lib/components/upgrade_button.svelte";
import { greyOutColor, highlightColor } from "../utils/utils";

export class Upgrade extends GameComponent {

    public bought: boolean = false;
    public cost: Decimal;

    constructor(componentId: string, cost: Decimal, layer: Layer, unlocked?: boolean) {
        super(componentId, layer, UpgradeButton, unlocked);
        this.cost = cost;
    }

    public canAfford(): boolean {
        return this.layer.currency.gte(this.cost) && !this.bought;
    }

    public buy(): void {
        if (this.canAfford()) {
            this.layer.currency = this.layer.currency.minus(this.cost);
            this.bought = true;
        }
    }

    public reset(): void {
        this.bought = false;
    }

    public getColor(): string {
        return this.layer.getColor(false, !this.canAfford());
    }

    public getHoverColor(): string {
        return this.layer.getColor(this.canAfford(), !this.canAfford(), 0.8);
    }

    public getBorderColor(): string {
        return (!this.bought && this.canAfford()) ? "#0dff00ff" : this.layer.getColor(this.canAfford(), !this.canAfford());
    }

}