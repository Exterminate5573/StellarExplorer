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
}

export const settings = new Settings();