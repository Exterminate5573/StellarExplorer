import SettingsPage from "$lib/pages/SettingsPage.svelte";
import { settings } from "./interfaces/settings.svelte";
import type { Tree } from "./interfaces/tree";
import { ExampleTree } from "./layers/example_tree";

class Game {
    public version: string;
    public lastUpdate: number;
    public tree: Tree;
    
    // Set up your game here
    constructor() {
        this.version = "0.0.1";
        this.lastUpdate = Date.now();
        this.tree = new ExampleTree();
    }

    public start(): void {
        console.log("Game started");

        // Load settings when component mounts
        settings.loadSettings();

        // Load game state

        // Start the game loop
        setInterval(() => {
            const now = Date.now();
            const diff = now - this.lastUpdate;
            this.update(diff);
            this.lastUpdate = now;
        }, 50);
    }

    // This function is called every game tick (default is 50ms)
    public update(diff: number): void {
        this.tree.update(diff);
    }

    public hardReset(): void {
        this.tree = new ExampleTree();
    }

    public getCurrentLayer() {
        if (settings.currentPageName === "settings") return null;
        return this.tree.getLayer(settings.currentPageName);
    }

}

export const game = new Game();