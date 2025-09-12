import Decimal from "break_eternity.js";

class Settings {

    sidebarExtended: boolean;
    currentPageName: string; //TODO

    language: string;
    notation: "standard" | "scientific" | "engineering" | undefined;

    constructor() {
        this.sidebarExtended = $state(true);
        this.currentPageName = $state('home');

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

    public formatNumber(num: Decimal): string {
        if (this.notation === "standard") {
            return num.toString();
        } else if (this.notation === "scientific") {
            return num.toExponential(2);
        } else if (this.notation === "engineering") {
            let exponent = num.log10().floor().div(3).floor().mul(3).toNumber();
            let mantissa = num.div(new Decimal(10).pow(exponent));
            return mantissa.toFixed(2) + "e" + exponent;
        } else {
            return num.toString();
        }
    }
}

export const settings = new Settings();