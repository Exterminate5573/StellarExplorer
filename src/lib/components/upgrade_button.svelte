<script lang="ts">
    import { gameStore, game } from "$lib/scripts/game";
    import type { Upgrade } from "$lib/scripts/interfaces/upgrade";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { t } from "svelte-i18n";
    import { derived } from "svelte/store";

    let { id } = $props();

    let upgrade = derived(gameStore, ($game) => {
        let layer = $game.getCurrentLayer();
        let upgrade = layer.getSubcomponentByID(id) as Upgrade;
        return upgrade;
    });

    let canAfford = derived(upgrade, ($upgrade) => {
        return $upgrade.canAfford();
    });
    let color = derived(upgrade, ($upgrade) => {
        return $upgrade.getColor();
    });
    let borderColor = derived(upgrade, ($upgrade) => {
        return $upgrade.getBorderColor();
    });
    let cost = derived(upgrade, ($upgrade) => {
        return formatNumber($upgrade.cost);
    });

    function buyUpgrade() {
        let layer = game.getCurrentLayer();
        let upgrade = layer.getSubcomponentByID(id) as Upgrade;
        upgrade.buy();
    }
</script>

<button class="btn rounded-lg h-20" onclick={buyUpgrade} disabled={!$canAfford} 
    style="background-color: {$color}; border-color: {$borderColor}; border-width: 2px;">

    <div class="flex flex-col items-center">
        <span class="font-bold">{$t($upgrade.layer.layerID + "." + id + ".name")}</span>
        <span class="text-sm">{$t($upgrade.layer.layerID + "." + id + ".description")}</span>
        <span class="text-sm">{$t($upgrade.layer.layerID + "." + id + ".cost", { values: { cost: $cost}})}</span>
    </div>
</button>