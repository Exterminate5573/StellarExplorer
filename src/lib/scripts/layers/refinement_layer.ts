import Decimal from "break_eternity.js";
import { Layer } from "../interfaces/layer";

export class Refinement extends Layer {

    constructor(tree: any) {
        super(tree, "refinement_layer", "mining_layer", "#1ea603");
    }

    public registerSubcomponents(): void {
        


    }

    public canUnlock(): boolean {
        return this.getParentLayer()!.currency.gte(100);
    }

    public currencyCost(): Decimal {
        let cost = new Decimal(100);
        if (this.currency.gte(1)) {
            cost = cost.plus(this.currency.plus(10).div(5).pow(1.1));
        }
        
        return cost;
    }

    public buyCurrencyGain(): Decimal {
        let gain = new Decimal(1);
        return gain;
    }

    public buyCurrency(): void {
        if (this.canBuyCurrency()) {
            const gain = this.buyCurrencyGain();
            this.getParentLayer()!.reset();
            this.currency = this.currency.plus(gain);
        }
    }

    public currencyPerSecond(): Decimal {
        return new Decimal(0);
    }

    public reset(): void {
        this.currency = new Decimal(0);
        this.getAllSubcomponents().forEach(c => c.reset());
        this.getParentLayer()!.reset();
    }

}