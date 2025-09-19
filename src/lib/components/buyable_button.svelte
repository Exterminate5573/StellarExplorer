<script lang="ts">
    import { gameStore, game } from "$lib/scripts/game";
    import type { Buyable } from "$lib/scripts/interfaces/buyable";
    import type { Layer } from "$lib/scripts/interfaces/layer";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { t } from "svelte-i18n";
    import { derived } from "svelte/store";

    let { id } = $props();

    let buyable = derived(gameStore, ($game) => {
        let layer = $game.getCurrentLayer() as Layer;
        let buyable = layer.getSubcomponentByID(id) as Buyable | undefined;
        return buyable;
    });

    let canAfford = derived(buyable, ($buyable) => {
        return $buyable?.canAfford();
    });

    let amount = derived(buyable, ($buyable) => {
        return $buyable ? formatNumber($buyable.amount) : "N/A";
    });

    let cost = derived(buyable, ($buyable) => {
        return $buyable ? formatNumber($buyable.cost()) : "N/A";
    });

    let isHovered = $state(false);

    let color = derived(buyable, ($buyable) => {
        return $buyable?.getColor();
    });

    let borderColor = derived(buyable, ($buyable) => {
        return $buyable?.getBorderColor();
    });

    let hoverColor = derived(buyable, ($buyable) => {
        return $buyable?.getHoverColor();
    });

    function buy() {
        let layer = game.getCurrentLayer();
        let buyable = layer.getSubcomponentByID(id) as Buyable | undefined;
        buyable?.buy();
    }
</script>

{#if $buyable}
<button class="btn rounded-lg p-1" onclick={buy} disabled={!$canAfford} 
    onmouseenter={() => isHovered = true} onmouseleave={() => isHovered = false}
    style="background-color: {isHovered ? $hoverColor : $color}; border-color: {$borderColor}; border-width: 2px;">

    <div class="flex flex-col items-center">
        <span class="font-bold">{$t(`${$buyable.layer.layerID}.${id}.name`)}</span>
        <span class="text-sm">{$t(`${$buyable.layer.layerID}.${id}.description`)}</span>
        <span class="text-sm">{$t(`${$buyable.layer.layerID}.${id}.amount`, { values: { amount: $amount}})}</span>
        <span class="text-sm">{$t(`${$buyable.layer.layerID}.${id}.cost`, { values: { cost: $cost}})}</span>
    </div>
</button>
{/if}