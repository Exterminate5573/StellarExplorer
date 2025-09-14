import Decimal from "break_eternity.js";
import type { GameComponent } from "./game_component";
import type { Tree } from "./tree";

export abstract class Layer {

    protected tree: Tree;
    public layerID: string;
    public color: string;
    public currency: Decimal;
    public unlocked: boolean;

    public subcomponents: GameComponent[] = [];

    constructor(tree: Tree, id: string, color?: string, unlocked?: boolean, initialCurrency?: Decimal) {
        this.tree = tree;
        this.layerID = id;
        this.color = color ?? "#FFFFFF";
        this.unlocked = unlocked ?? false;
        this.currency = initialCurrency ?? new Decimal(0);
        this.registerSubcomponents();
    }
    public abstract registerSubcomponents(): void;
    
    public abstract canBuyCurrency(): boolean;
    public abstract buyCurrency(): void;
    public abstract currencyPerSecond(): Decimal;
    public abstract reset(): void;
    
    public getActiveSubcomponents(): GameComponent[] {
        return this.subcomponents.filter(c => c.unlocked);
    }

    //TODO: returns any for now to avoid type issues
    public getSubcomponentByID(id: string): any | undefined {
        return this.subcomponents.find(c => c.componentId === id);
    }

    public getCurrency(): Decimal {
        return this.currency;
    }

    public update(diff: number): void {
        if (this.currencyPerSecond().gt(0)) {
            this.currency = this.currency.plus(this.currencyPerSecond().times(diff / 1000));
        }
        for (const component of this.getActiveSubcomponents()) {
            component.update(diff);
        }
    }
}