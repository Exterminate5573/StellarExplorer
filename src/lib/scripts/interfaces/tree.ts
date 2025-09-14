import Decimal from "break_eternity.js";
import type { Layer } from "./layer";

export abstract class Tree {

    public baseCurrency: Decimal;
    public tree: Layer[];

    constructor(baseCurrency: Decimal) {
        this.baseCurrency = baseCurrency;
        this.tree = this.createTree();
    }

    public abstract createTree(): Layer[];

    public getLayer(layerId: string): Layer | undefined {
        return this.tree.find(layer => layer.layerID === layerId);
    }
    
    public abstract currencyPerSecond(): Decimal;

    public reset(): void {
        this.baseCurrency = new Decimal(10);
    }

    update(diff: number) {
        for (const layer of this.tree) {
            layer.update(diff);
        }

        this.baseCurrency = this.baseCurrency.plus(this.currencyPerSecond().times(diff / 1000));
    }
}