//------------------------------------------------

import Decimal from "break_eternity.js";
import { settings } from "./settings.svelte";

const scales = [
            { value: 1e30, suffix: "No" },
            { value: 1e27, suffix: "Oc" },
            { value: 1e24, suffix: "Sx" },
            { value: 1e21, suffix: "Qi" },
            { value: 1e18, suffix: "Qa" },
            { value: 1e15, suffix: "T" },
            { value: 1e12, suffix: "B" },
            { value: 1e9,  suffix: "M" },
            { value: 1e6,  suffix: "K" },
            { value: 1000, suffix: "" }
        ];

export function formatNumber(num: Decimal): string {
    switch (settings.notation) {
        case "standard":
            for (const scale of scales) {
                if (num.gte(scale.value)) {
                    return (num.div(scale.value)).toFixed(2) + scale.suffix;
                }
            }
        default:
        case "scientific":
            if (num.lte(1000)) {
                return num.toFixed(2);
            } else {
                return num.toExponential(2);
            }
        case "engineering":
            if (num.lte(1000)) {
                return num.toFixed(2);
            } else {
                let exponent = num.log10().floor().div(3).floor().mul(3).toNumber();
                let mantissa = num.div(new Decimal(10).pow(exponent));
                return mantissa.toFixed(2) + "e" + exponent;
            }
    }
}

// ------------------------------------------------

export function highlightColor(hex: string, amount: number = 0.5): string {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Desaturate and lighten
    s *= (1 - amount);
    l = Math.min(1, l + amount * 0.3);

    // Convert back to RGB
    const [r2, g2, b2] = hslToRgb(h, s, l);

    // Convert RGB back to hex
    return `#${((1 << 24) + (r2 << 16) + (g2 << 8) + b2).toString(16).slice(1)}`;
}


export function greyOutColor(hex: string, amount: number = 0.3): string {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Saturate and darken
    s = Math.min(1, s + amount);
    l = Math.max(0, l - amount * 0.3);

    // Convert back to RGB
    const [r2, g2, b2] = hslToRgb(h, s, l);

    // Convert RGB back to hex
    return `#${((1 << 24) + (r2 << 16) + (g2 << 8) + b2).toString(16).slice(1)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}