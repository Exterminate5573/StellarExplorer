import Decimal from "break_eternity.js";
import { Tree } from "./interfaces/tree";
import { Mining } from "./layers/mining_layer";
import type { Layer } from "./interfaces/layer";
import  { Achievement } from "./interfaces/achievement";

export class ExampleTree extends Tree {

    constructor() {
        super(new Decimal(10));
    }

    public createTree(): Layer[] {
        return [
            new Mining(this)
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
        let cps = new Decimal(0);

        for (const layer of this.tree) {
            cps = layer.getBaseEffect(cps);
        }

        //Softcaps
        // if (cps.gt(1000)) {
        //     cps = cps.sqrt().times(Math.sqrt(10));
        // }

        return cps;
    }

}