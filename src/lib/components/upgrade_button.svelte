<script lang="ts">
    import type { Upgrade } from "$lib/scripts/interfaces/upgrade";
    import { t } from "svelte-i18n";

    let { component } = $props();
    const upgrade = component as Upgrade;

    const canAfford: boolean = $derived(upgrade.canAfford());
    const color: string = $derived(upgrade.getColor());
    const borderColor: string = $derived(upgrade.getBorderColor());
</script>

<button class="btn" onclick={() => upgrade.buy()} disabled={!canAfford} 
    style="background-color: {color}; border-color: {borderColor}; border-width: 2px;">

    <div class="flex flex-col items-start">
        <span class="font-bold">{$t(upgrade.layer.layerID + "." + upgrade.componentId + ".name")}</span>
        <span class="text-sm">{$t(upgrade.layer.layerID + "." + upgrade.componentId + ".description")}</span>
        <span class="text-sm">{upgrade.cost}</span>
    </div>

</button>