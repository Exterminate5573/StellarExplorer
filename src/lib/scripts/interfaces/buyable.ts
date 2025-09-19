import Decimal from "break_eternity.js";
import { GameComponent } from "./game_component";
import BuyableButton from "$lib/components/buyable_button.svelte";
import type { Layer } from "./layer";

export class Buyable extends GameComponent {

    public amount: Decimal;
    public cost: () => Decimal;

    constructor(componentId: string, layer: Layer, cost: () => Decimal, unlocked?: boolean) {
        super(componentId, layer, BuyableButton, unlocked);
        this.amount = new Decimal(0);
        this.cost = cost;
    }

    public canAfford(): boolean {
        return this.layer.currency.gte(this.cost());
    }

    public buy(): void {
        if (this.canAfford()) {
            this.layer.currency = this.layer.currency.minus(this.cost());
            this.amount = this.amount.plus(1);
        }
    }

    public reset(): void {
        this.amount = new Decimal(0);
    }

    public getColor(): string {
        return this.layer.getColor(false, !this.canAfford());
    }

    public getHoverColor(): string {
        return this.layer.getColor(this.canAfford(), !this.canAfford());
    }

    public getBorderColor(): string {
        return this.layer.getColor(this.canAfford(), !this.canAfford());
    }

    public getSave(): JSON {
        return {
            componentId: this.componentId,
            amount: this.amount
        } as unknown as JSON;
    }

    public loadSave(obj: any): void {
        if (obj.amount) {
            this.amount = new Decimal(obj.amount);
        }
    }

}