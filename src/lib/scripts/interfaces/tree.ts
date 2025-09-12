import Decimal from "break_eternity.js";
import type { Layer } from "./layer";

export abstract class Tree {

    public baseCurrency: Decimal;

    constructor(baseCurrency: Decimal) {
        this.baseCurrency = baseCurrency;
    }

    public abstract getTree(): Layer[];

    public getLayer(layerId: string): Layer | undefined {
        return this.getTree().find(layer => layer.layerID === layerId);
    }
    
    public abstract currencyPerSecond(): Decimal;

    public reset(): void {
        this.baseCurrency = new Decimal(10);
    }

    update(diff: number) {
        const layers = this.getTree();
        for (const layer of layers) {
            layer.update(diff);
        }

        this.baseCurrency = this.baseCurrency.plus(this.currencyPerSecond().times(diff / 1000));
    }
}