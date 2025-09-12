<script lang="ts">
    import type { Layer } from "$lib/scripts/interfaces/layer";
    import { settings } from "$lib/scripts/interfaces/settings.svelte";
    import { t, number } from 'svelte-i18n';

    let props = $props()
    const layer: Layer = props.layer;

    let currencyAmount = $derived.by(() => {
        return settings.formatNumber(layer.currency);
    })

    let currencyGain = $derived.by(() => {
        return settings.formatNumber(layer.currencyPerSecond());
    })
</script>

<div class="layer-page">
    <h1>{$t(layer.layerID + ".header", { values: { count: currencyAmount } })}</h1>
    <p>{$t(layer.layerID + ".gaining", { values: { rate: currencyGain } })}</p>

    <div class="layer-components flex flex-col gap-4">
        {#each layer.getActiveSubcomponents() as component}
            {component}
        {/each}
    </div>
</div>