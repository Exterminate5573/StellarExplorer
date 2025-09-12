import Decimal from "break_eternity.js";
import { Tree } from "../interfaces/tree";
import { ExampleLayer } from "./example_layer";
import type { Layer } from "../interfaces/layer";

export class ExampleTree extends Tree {

    constructor() {
        super(new Decimal(10));
    }

    public getTree(): Layer[] {
        return [
            new ExampleLayer(this)
        ];
    }

    public currencyPerSecond(): Decimal {
        //Don't continue if the upgrade isn't bought
        if (!this.getLayer("example_layer")?.getSubcomponentByID("example_upgrade")?.bought) {
            return new Decimal(0);
        }

        //Return 1 currency per second
        let cps = new Decimal(1);

        cps = cps.plus(this.getLayer("example_layer")?.currency.div(5) ?? 0);

        return cps;
    }

}