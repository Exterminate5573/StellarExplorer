import Decimal from "break_eternity.js";
import { Layer } from "../interfaces/layer";

export class ExampleLayer extends Layer {

    constructor() {
        super("e", true, new Decimal(10));
    }

    public registerSubcomponents(): void {
        throw new Error("Method not implemented.");
    }
    public currencyPerSecond(): Decimal {
        throw new Error("Method not implemented.");
    }
    public canReset(): boolean {
        throw new Error("Method not implemented.");
    }
    public reset(): void {
        this.currency = new Decimal(0);
    }
}