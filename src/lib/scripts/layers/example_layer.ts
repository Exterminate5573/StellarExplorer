import Decimal from "break_eternity.js";
import { Layer } from "../interfaces/layer";
import { Upgrade } from "../interfaces/upgrade";

export class ExampleLayer extends Layer {

    constructor(tree: any) {
        super(tree, "example_layer", "#4002b4ff", true, new Decimal(10));
    }

    public registerSubcomponents(): void {
        this.subcomponents.push(
            new Upgrade(
                "example_upgrade",
                new Decimal(1),
                this
            )
        );
    }
    
    public canBuyCurrency(): boolean {
        return this.tree.baseCurrency.gte(this.currency.times(5).plus(1));
    }

    public buyCurrency(): void {
        if (this.canBuyCurrency()) {
            this.tree.baseCurrency = new Decimal(0); //Full reset until more complex mechanics are added
            this.currency = this.currency.plus(1);
        }
    }

    public currencyPerSecond(): Decimal {
        return new Decimal(0);
    }

    public reset(): void {
        this.currency = new Decimal(0);
        this.subcomponents.forEach(c => {
            c.reset();
        });
        this.tree.reset();
    }
}