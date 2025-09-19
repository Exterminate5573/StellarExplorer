import Decimal from "break_eternity.js";
import type { GameComponent } from "./game_component";
import type { Tree } from "./tree";
import { greyOutColor, highlightColor } from "../utils/utils";
import { ComponentContainer } from "./component_container";

export abstract class Layer {

    protected tree: Tree;
    public layerID: string;
    private color: string;
    public currency: Decimal;
    public unlocked: boolean;

    private subcomponents: ComponentContainer[] = [];

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
    public abstract buyCurrencyGain(): Decimal;
    public abstract buyCurrency(): void;
    public abstract currencyPerSecond(): Decimal;
    public abstract reset(): void;
    
    protected addComponentContainer(... components: GameComponent[]): void {
        this.subcomponents.push(new ComponentContainer(components));
    }

    //TODO: returns any for now to avoid type issues
    public getSubcomponentByID(id: string): any | undefined {
        return this.subcomponents.flatMap(c => c.components).find(c => c.componentId === id);
    }

    public getAllSubcomponents(): GameComponent[] {
        return this.subcomponents.flatMap(c => c.getActiveComponents());
    }

    public getComponentContainers(): ComponentContainer[] {
        return this.subcomponents;
    }

    public getCurrency(): Decimal {
        return this.currency;
    }

    public update(diff: number): void {
        if (this.currencyPerSecond().gt(0)) {
            this.currency = this.currency.plus(this.currencyPerSecond().times(diff / 1000));
        }
        for (const component of this.getAllSubcomponents()) {
            component.update(diff);
        }
    }

    public getColor(highlight: boolean = false, greyOut: boolean = false, amount?: number): string {
        return greyOut ? greyOutColor(this.color, amount) : (highlight ? highlightColor(this.color, amount) : this.color);
    }
}