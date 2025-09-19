<script lang="ts">
    import { gameStore, game } from "$lib/scripts/game";
    import type { Layer } from "$lib/scripts/interfaces/layer";
    import type { Upgrade } from "$lib/scripts/interfaces/upgrade";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { t } from "svelte-i18n";
    import { derived } from "svelte/store";

    let { id } = $props();

    let upgrade = derived(gameStore, ($game) => {
        let layer = $game.getCurrentLayer() as Layer;
        let upgrade = layer.getSubcomponentByID(id) as Upgrade | undefined; //TODO: This is undefined when swapping layers, fix it
        return upgrade;
    });

    let canAfford = derived(upgrade, ($upgrade) => {
        return $upgrade?.canAfford();
    });
    
    let cost = derived(upgrade, ($upgrade) => {
        return $upgrade ? formatNumber($upgrade.cost) : "N/A";
    });

    let isHovered = $state(false);

    let color = derived(upgrade, ($upgrade) => {
        return $upgrade?.getColor();
    });
    let borderColor = derived(upgrade, ($upgrade) => {
        return $upgrade?.getBorderColor();
    });
    let hoverColor = derived(upgrade, ($upgrade) => {
        return $upgrade?.getHoverColor();
    });

    function buyUpgrade() {
        let layer = game.getCurrentLayer();
        let upgrade = layer.getSubcomponentByID(id) as Upgrade | undefined;
        upgrade?.buy();
    }
</script>

{#if $upgrade}
<button class="upg-btn rounded-lg p-1" onclick={buyUpgrade} disabled={!$canAfford} 
    onmouseenter={() => isHovered = true} onmouseleave={() => isHovered = false}
    style="background-color: {isHovered ? $hoverColor : $color}; border-color: {$borderColor}; border-width: 2px;">

    <div class="flex flex-col items-center">
        <span class="font-bold">{$t(`${$upgrade.layer.layerID}.${id}.name`)}</span>
        <span class="text-sm">{$t(`${$upgrade.layer.layerID}.${id}.description`)}</span>
        <span class="text-sm">{$t(`${$upgrade.layer.layerID}.${id}.cost`, { values: { cost: $cost}})}</span>
    </div>
</button>
{/if}