import { game } from "../game";

class Settings {

    sidebarExtended: boolean;
    currentPageName: string; //TODO

    language: string;
    notation: "standard" | "scientific" | "engineering" | undefined;

    constructor() {
        this.sidebarExtended = $state(true);
        this.currentPageName = $state('settings'); //TODO

        this.language = $state("en");
        this.notation = $state("standard");

    }

    public saveSettings() {
        let jsonify = JSON.stringify({
            sidebarExtended: this.sidebarExtended,
            currentPageName: this.currentPageName,
            language: this.language,
            notation: this.notation
        })
        let encoded = btoa(jsonify);
        localStorage.setItem("settings", encoded);   
    }

    public loadSettings() {
        let encoded = localStorage.getItem("settings");
        if (encoded) {
            let jsonify = atob(encoded);
            let obj = JSON.parse(jsonify);
            this.sidebarExtended = obj.sidebarExtended ?? this.sidebarExtended;
            this.currentPageName = obj.currentPageName ?? this.currentPageName;
            this.language = obj.language ?? this.language;
            this.notation = obj.notation ?? this.notation;
        }
    }

    public saveGame() {
        let jsonify = JSON.stringify(game.getSave());
        let encoded = btoa(jsonify);
        localStorage.setItem("save", encoded);   
    }

    public loadGame() {
        let encoded = localStorage.getItem("save");
        if (encoded) {
            if (!this.importSave(encoded)) {
                alert("Failed to load save!");
                //If the save fails to load, clear it out of local storage but keep a backup
                localStorage.setItem("save_backup", encoded);
                localStorage.removeItem("save");
            }
        }
    }

    public exportSave(): string {
        let jsonify = JSON.stringify(game.getSave());
        let encoded = btoa(jsonify);
        return encoded;
    }

    public importSave(encoded: string): boolean {
        try {
            let jsonify = atob(encoded);
            let obj = JSON.parse(jsonify);
            game.loadSave(obj);
            return true;
        } catch {
            return false;
        }
    }
}

export const settings = new Settings();