import Decimal from "break_eternity.js";
import { Tree } from "./interfaces/tree";
import { ExampleLayer } from "./layers/example_layer";
import type { Layer } from "./interfaces/layer";
import  { Achievement } from "./interfaces/achievement";

export class ExampleTree extends Tree {

    constructor() {
        super(new Decimal(10));
    }

    public createTree(): Layer[] {
        return [
            new ExampleLayer(this)
        ];
    }

    public createAchievements(): Achievement[] {
        return [
            new Achievement(
                "example_achievement", 
                () => this.baseCurrency.gte(100)
            ),
            new Achievement(
                "example_hidden_achievement", 
                () => this.baseCurrency.gte(1000), 
                () => this.baseCurrency.gte(500)
            )
        ];
    }

    public currencyPerSecond(): Decimal {
        //Don't continue if the upgrade isn't bought
        if (!this.getLayer("example_layer")?.getSubcomponentByID("example_upgrade")?.bought) {
            return new Decimal(0);
        }

        //Return 1 currency per second
        let cps = new Decimal(1);

        for (const layer of this.tree) {
            cps = layer.getBaseEffect(cps);
        }

        //Softcaps
        if (cps.gt(1000)) {
            cps = cps.sqrt().times(Math.sqrt(10));
        }

        return cps;
    }

}