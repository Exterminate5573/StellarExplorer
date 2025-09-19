import type { GameComponent } from "./game_component";

export class ComponentContainer {

    public components: GameComponent[] = [];

    constructor(components?: GameComponent[]) {
        if (components) {
            this.components = components;
        }
    }

    public getActiveComponents(): GameComponent[] {
        return this.components.filter(c => c.unlocked());
    }

}