import Decimal from "break_eternity.js";
import { Layer } from "../interfaces/layer";
import { Upgrade } from "../interfaces/upgrade";
import { Buyable } from "../interfaces/buyable";
import { Milestone } from "../interfaces/milestone";

export class Mining extends Layer {

    constructor(tree: any) {
        super(tree, "mining_layer", undefined, "#c4c725ff", true);
    }

    public registerSubcomponents(): void {

        this.addComponentContainer(
            //TODO: Fix ts-ignore
            new Buyable(
                "miners",
                this,
                //@ts-ignore
                function() { return new Decimal(1).times(Decimal.pow(2, this.amount.toNumber())); }
            )
        );

        this.addComponentContainer(
            new Upgrade(
                "stronger_pickaxes",
                this,
                new Decimal(10),
            ),
            new Upgrade(
                "better_drills",
                this,
                new Decimal(20)
            )
        );

        this.addComponentContainer(
          new Milestone(
            "milestone_1", 
            this, 
            () => this.currency.gte(50)
          )  
        );
    }
    
    public currencyCost(): Decimal {
        let cost = new Decimal(10);
        cost = cost.plus(this.currency.times(2));

        if (this.currency.gte(1e6)) {
            // Softcap
            cost = cost.pow(this.currency.div(1e5).log(10).plus(1));
        }

        return cost;
    }
    
    //Overrides the default canBuyCurrency method to use base currency
    public canBuyCurrency(): boolean {
        return this.tree.baseCurrency.gte(this.currencyCost());
    }

    public buyCurrency(): void {
        if (this.canBuyCurrency()) {
            if (!this.getSubcomponentByID("milestone_1")?.achieved) {
                this.tree.baseCurrency = new Decimal(0);
            } else {
                this.tree.baseCurrency = this.tree.baseCurrency.minus(this.currencyCost());
            }
            this.currency = this.currency.plus(this.buyCurrencyGain());
        }
    }

    public buyCurrencyGain(): Decimal {
        let gain = new Decimal(1);
        
        return gain;
    }

    public currencyPerSecond(): Decimal {
        return new Decimal(0);
    }

    public getBaseEffect(cps: Decimal): Decimal {
        cps = cps.plus(Decimal.mul(1, this.getSubcomponentByID("miners")?.amount));
        
        if (this.getSubcomponentByID("stronger_pickaxes")?.bought) {
            cps = cps.plus(this.currency.divide(30)).times(1.3);
        }

        if (this.getSubcomponentByID("better_drills")?.bought) {
            cps = cps.times(2);
        }

        return cps;
    }

    public reset(): void {
        this.currency = new Decimal(0);
        this.getAllSubcomponents().forEach(c => c.reset());
        this.tree.reset();
    }
}