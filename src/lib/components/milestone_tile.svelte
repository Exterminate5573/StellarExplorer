<script lang="ts">
    import { gameStore, game } from "$lib/scripts/game";
    import type { Layer } from "$lib/scripts/interfaces/layer";
    import type { Milestone } from "$lib/scripts/interfaces/milestone";
    import { t } from "svelte-i18n";
    import { derived } from "svelte/store";

    let { id } = $props();

    let milestone = derived(gameStore, ($game) => {
        let layer = $game.getCurrentLayer() as Layer;
        let milestone = layer.getSubcomponentByID(id) as Milestone | undefined;
        return milestone;
    });

    let achieved = derived(milestone, ($milestone) => {
        return $milestone?.isAchieved();
    });

    let color = derived(milestone, ($milestone) => {
        return $milestone?.getColor();
    });
    let borderColor = derived(milestone, ($milestone) => {
        return $milestone?.getBorderColor();
    });
</script>

{#if $milestone}
<div class="milestone-tile rounded-lg p-1" >
    <div class="flex flex-col items-center" 
        style="background-color: {$achieved ? $color : 'gray'}; border-color: {$borderColor}; border-width: 2px;">
        <span class="font-bold">{$t(`${$milestone.layer.layerID}.${id}.name`)}</span>
        <span class="text-sm">{$t(`${$milestone.layer.layerID}.${id}.description`)}</span>
        <span class="text-xs italic">{$t(`${$milestone.layer.layerID}.${id}.requirement`)}</span>
        {#if $achieved}
            <span class="text-sm text-green-500">{$t("milestone.achieved")}</span>
        {:else}
            <span class="text-sm text-red-500">{$t("milestone.unachieved")}</span>
        {/if}
    </div>
</div>
{/if}