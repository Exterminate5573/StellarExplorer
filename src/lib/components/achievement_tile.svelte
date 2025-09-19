<script lang="ts">
    import { gameStore } from "$lib/scripts/game";
    import { t } from "svelte-i18n";
    import { derived } from "svelte/store";


    let { id } = $props();
    
    let achievement = derived(gameStore, ($game) => {
        return $game.tree.getAchievement(id);
    });

    let unlocked = derived(achievement, ($achievement) => {
        return $achievement?.unlocked();
    });

    let achieved = derived(achievement, ($achievement) => {
        return $achievement?.isCompleted();
    });

    let hovered = $state(false);

</script>

{#if $achievement}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="achievement-tile border-2 p-2 m-1 w-24 h-24 flex flex-col items-center justify-center"
    onmouseenter={() => hovered = true} onmouseleave={() => hovered = false}
    style="border-color: {$unlocked ? ($achieved ? 'orange' : 'lightgray') : 'darkgray'};">
     {#if $unlocked}
        <!-- TODO: icons -->
     {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"  fill="currentColor">
            <path d="M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22" />
        </svg>
     {/if}
</div>

{#if hovered}
<div class="absolute bg-neutral-700 text-white border-2 border-white p-2 rounded shadow-lg z-10"
    style="min-width: 200px; max-width: 300px; top: 100%; left: 50%; transform: translateX(-50%);">
    {#if $unlocked}
        <h3 class="text-lg font-bold mb-1">{$t(`achievements.${id}.name`)}</h3>
        <p class="mb-1">{$t(`achievements.${id}.description`)}</p>
        <!-- TODO: could put an optional effect text here -->
    {:else}
        <h3 class="text-lg font-bold mb-1 text-gray-500">{$t("achievements.locked")}</h3>
        <p class="mb-1 text-gray-500">{$t("achievements.locked_desc")}</p>
    {/if}
</div>
{/if}
{/if}