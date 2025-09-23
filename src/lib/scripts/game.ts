import { settings } from "./utils/settings.svelte";
import type { Tree } from "./interfaces/tree";
import { ExampleTree } from "./example_tree";
import { writable } from "svelte/store";
import type { Layer } from "./interfaces/layer";

class Game {
    public version: string;
    public lastUpdate: number;
    public tree: Tree;
    public stateUpdated: () => void = () => {};
    
    // Set up your game here
    constructor() {
        this.version = "0.0.1";
        this.lastUpdate = Date.now();
        this.tree = new ExampleTree();
    }

    public start(): void {

        // Load settings when component mounts
        settings.loadSettings();

        // Load game save
        settings.loadGame();

        // Start the game loop
        setInterval(() => {
            const now = Date.now();
            const diff = now - this.lastUpdate;

            // Set a maximum offline time
            if (diff > 3600000) {
                this.lastUpdate = 3600000; // Cap the offline time to 1 hour
            }

            this.update(diff);
            this.lastUpdate = now;

            this.stateUpdated();
        }, 50);

        // Save game when the window is closed or refreshed
        window.addEventListener("beforeunload", settings.saveGame);

        // Save and game every minute
        setInterval(() => {
            settings.saveGame();
        }, 60000);
    }

    // This function is called every game tick (default is 50ms)
    public update(diff: number): void {
        this.tree.update(diff);
    }

    public hardReset(): void {
        this.tree = new ExampleTree();
    }

    public getCurrentLayer(): Layer {
        return this.tree.getLayer(settings.currentPageName) ?? this.tree.tree[0];
    }

    public getSave(): JSON {
        return {
            version: this.version,
            lastUpdate: this.lastUpdate,
            tree: this.tree.getSave()
        } as unknown as JSON;
    }

    public loadSave(save: any): void {
        if (save.version) {
            if (save.version !== this.version) {
                //Handle version differences here
            }
        }
        if (save.lastUpdate) {
            this.lastUpdate = save.lastUpdate;
        }
        if (save.tree) {
            this.tree.loadSave(save.tree);
        }
    }

}

export const game = new Game();
export const gameStore = writable(game);
game.stateUpdated = () => {
    gameStore.set(game);
}
