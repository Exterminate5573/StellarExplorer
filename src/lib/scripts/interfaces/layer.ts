import Decimal from "break_eternity.js";
import type { Component } from "svelte";

export abstract class Layer {

    public layerID: string;
    public currency: Decimal;
    public unlocked: boolean;

    public subcomponents: Component[] = [];

    constructor(id: string, unlocked?: boolean, initialCurrency?: Decimal) {
        this.layerID = id;
        this.unlocked = unlocked ?? false;
        this.currency = initialCurrency ?? new Decimal(0);
        this.registerSubcomponents();
    }
    public abstract registerSubcomponents(): void;
    
    public abstract currencyPerSecond(): Decimal;
    public abstract canReset(): boolean;
    public abstract reset(): void;
    
    public getActiveSubcomponents(): Component[] {
        return this.subcomponents;
    }
}