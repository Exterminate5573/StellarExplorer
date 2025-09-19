import Decimal from "break_eternity.js";
import { Layer } from "../interfaces/layer";
import { Upgrade } from "../interfaces/upgrade";
import { Buyable } from "../interfaces/buyable";

export class ExampleLayer extends Layer {

    constructor(tree: any) {
        super(tree, "example_layer", undefined, "#250068ff", true);
    }

    public registerSubcomponents(): void {
        this.addComponentContainer(
            new Upgrade(
                "example_upgrade",
                this,
                new Decimal(1),
            )
        );

        this.addComponentContainer(
            //TODO: Fix ts-ignore
            new Buyable(
                "example_buyable",
                this,
                //@ts-ignore
                function() { return new Decimal(10).times(Decimal.pow(2, this.amount.toNumber())); }
            )
        );
    }
    
    public currencyCost(): Decimal {
        return this.currency.times(2).plus(10);
    }
    
    //Overrides the default canBuyCurrency method to use base currency
    public canBuyCurrency(): boolean {
        return this.tree.baseCurrency.gte(this.currencyCost());
    }

    public buyCurrency(): void {
        if (this.canBuyCurrency()) {
            this.tree.baseCurrency = new Decimal(0); //Full reset until more complex mechanics are added
            this.currency = this.currency.plus(this.buyCurrencyGain());
        }
    }

    public buyCurrencyGain(): Decimal {
        return new Decimal(1);
    }

    public currencyPerSecond(): Decimal {
        return new Decimal(0);
    }

    public getBaseEffect(cps: Decimal): Decimal {
        cps = cps.plus(this.currency.times(0.1));

        if (this.getSubcomponentByID("example_buyable")?.amount.gt(0)) {
            cps = cps.times(this.getSubcomponentByID("example_buyable").amount.pow(0.7).plus(1));
        }

        return cps;
    }

    public reset(): void {
        this.currency = new Decimal(0);
        this.getAllSubcomponents().forEach(c => c.reset());
        this.tree.reset();
    }
}