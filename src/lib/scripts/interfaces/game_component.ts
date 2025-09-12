import { mount, type Component } from "svelte";
import type { Layer } from "./layer";

export abstract class GameComponent {

    public componentId: string;
    public unlocked: boolean;
    public layer: Layer;
    public svelteComponent: Component;

    constructor(componentId: string, layer: Layer, svelteComponent: Component<any>, unlocked?: boolean) {
        this.componentId = componentId;
        this.layer = layer;
        this.svelteComponent = svelteComponent;
        this.unlocked = unlocked ?? true;
    }

    public abstract reset(): void;

    public update(diff: number): void {
        //Default does nothing
    }

    public getColor(): string {
        return this.layer.color;
    }
}