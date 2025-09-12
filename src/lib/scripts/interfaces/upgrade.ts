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
        return this.layer.currency.gte(this.cost)  && !this.bought;
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
        if (!this.canAfford()) {
            return greyOutColor(this.layer.color);
        } else {
            return this.layer.color;
        }
    }

    public getHoverColor(): string {
        if (!this.canAfford()) {
            return greyOutColor(this.layer.color, 0.8);
        }
        return highlightColor(this.layer.color, 0.8);
    }

    public getBorderColor(): string {
        if (!this.canAfford()) {
            return greyOutColor(this.layer.color, 0.7);
        } else if (!this.bought && this.canAfford()) {
            return "#0dff00ff";
        } else {
            return highlightColor(this.layer.color);
        }
    }

}