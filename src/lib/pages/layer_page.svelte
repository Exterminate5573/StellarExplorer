<script lang="ts">
    import { gameStore } from "$lib/scripts/game";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { t } from 'svelte-i18n';
    import { derived } from "svelte/store";

    let layer = derived(gameStore, ($game) => {
        return $game.getCurrentLayer();
    });

    let currencyAmount = derived(layer, ($layer) => {
        return formatNumber($layer.currency);
    });

    let currencyGain = derived(layer, ($layer) => {
        return formatNumber($layer.currencyPerSecond());
    });

    let subcomponents = derived(layer, ($layer) => {
        return $layer.getActiveSubcomponents();
    });
</script>

<div class="layer-page">
    <h1>{$t($layer.layerID + ".header", { values: { count: $currencyAmount } })}</h1>
    <p>{$t($layer.layerID + ".gaining", { values: { rate: $currencyGain } })}</p>

    <div class="layer-components flex flex-col gap-4">
        {#each $subcomponents as component}
            <component.svelteComponent id={component.componentId} />
        {/each}
    </div>
</div>