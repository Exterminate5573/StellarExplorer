<script lang="ts">
    import { gameStore } from "$lib/scripts/game";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { t } from 'svelte-i18n';
    import { derived } from "svelte/store";

    let layer = derived(gameStore, ($game) => {
        return $game.getCurrentLayer();
    });

    let canBuyCurrency = derived(layer, ($layer) => {
        return $layer.canBuyCurrency();
    });

    let currencyAmount = derived(layer, ($layer) => {
        return formatNumber($layer.currency);
    });

    let currencyGain = derived(layer, ($layer) => {
        return formatNumber($layer.currencyPerSecond());
    });

    let resetGain = derived(layer, ($layer) => {
        return formatNumber($layer.buyCurrencyGain());
    });

    let bgColor = derived(layer, ($layer) => {
        return $layer.getColor(false, !$layer.canBuyCurrency());
    });

    let borderColor = derived(layer, ($layer) => {
        return $layer.getColor($layer.canBuyCurrency(), false);
    });

    let hoverColor = derived(layer, ($layer) => {
        return $layer.getColor($layer.canBuyCurrency());
    });

    let subcomponentContainers = derived(layer, ($layer) => {
        return $layer.getComponentContainers();
    });

    let isHovered = $state(false);
</script>

<div class="layer-page text-center align-center flex flex-col">
    <h1 class="">{$t($layer.layerID + ".name")}</h1>
    <h2>{$t($layer.layerID + ".header", { values: { count: $currencyAmount } })}</h2>
    <p>{$t($layer.layerID + ".gaining", { values: { rate: $currencyGain } })}</p>

    <div class="reset-button my-8 flex justify-center">
        <button class="btn btn-primary w-1/3 py-6 rounded-lg" onclick={() => $layer.buyCurrency()} disabled={!$canBuyCurrency}
            onmouseenter={() => isHovered = true} onmouseleave={() => isHovered = false}
            style="background-color: {(isHovered && $canBuyCurrency) ? $hoverColor : $bgColor}; border-color: {$borderColor}; border-width: 2px;">
            {$t($layer.layerID + ".reset", { values: { gain: $resetGain } })}
            <br/>
            {$t($layer.layerID + ".cost", { values: { cost: formatNumber($layer.currencyCost()) } })}
        </button>
    </div>

    <div class="layer-components flex flex-col gap-4 justify-center">
        {#each $subcomponentContainers as container}
            <div class="component-container grid grid-cols-5 gap-4">
                {#each container.getActiveComponents() as component}
                    <component.svelteComponent id={component.componentId} />
                {/each}
            </div>
        {/each}
    </div>
</div>