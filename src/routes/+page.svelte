<script lang="ts">
    import AchievementTile from "$lib/components/achievement_tile.svelte";
    import LayerPage from "$lib/pages/layer_page.svelte";
    import SettingsPage from "$lib/pages/settings_page.svelte";
    import { game, gameStore } from "$lib/scripts/game";
    import { settings } from "$lib/scripts/utils/settings.svelte";
    import { formatNumber } from "$lib/scripts/utils/utils";
    import { onMount } from "svelte";
    import { t } from 'svelte-i18n';

    let hoveredLayer: string | null = $state(null);

    onMount(() => {
        game.start();
    });

    //This cant go in the settings file because it needs to be in a component
    $effect(() => {
        // Save settings whenever they change
        settings.saveSettings();
    });
</script>

<div class="flex h-screen bg-neutral-800 text-white overflow-hidden">
    <!-- Sidebar -->
    <div class={`bg-neutral-700 h-full shadow-md ${settings.sidebarExtended ? 'w-64' : 'w-16'} duration-300 relative`}>
        
        <!-- Title -->
        <div class="absolute top-0 w-full flex">
            {#if settings.sidebarExtended}
                <h1 class="text-2xl font-bold p-4 whitespace-nowrap">{$t("game.name")}</h1>
            {/if}
            <button class="ml-auto p-4 hover:bg-neutral-600" aria-label="Toggle Sidebar" onclick={() => settings.sidebarExtended = !settings.sidebarExtended}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    {#if settings.sidebarExtended}
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                    {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                    {/if}
                </svg>
            </button>
        </div>

        <!-- List of each layer -->
        <div class="mt-16 mb-16 overflow-y-auto">
            <!-- TODO: Only show unlocked tree layers -->
            {#each $gameStore.tree.tree as layer}
                <button class="align-left p-4 w-full" aria-label={layer.layerID} onclick={() => settings.currentPageName = layer.layerID}
                    onmouseenter={() => hoveredLayer = layer.layerID} onmouseleave={() => hoveredLayer = null}
                    style="background-color: {layer.getColor(hoveredLayer === layer.layerID)}; {settings.currentPageName === layer.layerID ? 'box-shadow: inset 4px 0 0 0 white;' : ''}">
                    <div class="flex">
                        {#if settings.sidebarExtended}
                            <span class="ml-2">{$t(layer.layerID + ".name")}</span>
                        {:else}
                            <span class="sr-only">{$t(layer.layerID + ".name")}</span>
                        {/if}
                    </div>
                </button>
            {/each}
        </div>  

        <!-- Static buttons -->
        <div class="absolute bottom-0 w-full">
            <button class="align-left p-4 hover:bg-neutral-600 w-full" aria-label="Settings" onclick={() => settings.currentPageName = "settings"}
                style="{settings.currentPageName === 'settings' ? 'box-shadow: inset 4px 0 0 0 white;' : ''}">
                <div class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {#if settings.sidebarExtended}
                        <span class="ml-2">{$t("sidebar.settings")}</span>
                    {/if}
                </div>
            </button>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-10">
        {#if settings.currentPageName === "settings"}
            <SettingsPage />
        {:else}
            <LayerPage />
        {/if}
    </div>

    <!-- Statistics bar -->
    <div class="flex bg-neutral-700 h-full w-64 relative items-center flex-col">
        {#if settings.statsPageName === "statistics"}
            <!-- TODO: Make this minimizable -->
            <h1 class="text-2xl font-bold p-4 whitespace-nowrap">{$t("statistics.name")}</h1>
            <div class="flex-1 overflow-y-auto w-full p-4">
                <div class="mb-4 p-4 bg-neutral-600 rounded-lg">
                    <h2 class="text-xl font-semibold mb-2">{$t("game.base_currency.name")}</h2>
                    <p class="mt-2">{$t("statistics.currentAmount", { values: { amount: formatNumber($gameStore.tree.baseCurrency) } })}</p>
                    <p>{$t("statistics.gainAmount", { values: { gain: formatNumber($gameStore.tree.currencyPerSecond()) } })}</p>
                </div>
                {#each $gameStore.tree.tree as layer (layer.layerID)}
                    {#if layer.unlocked}
                        <div class="mb-4 p-4 bg-neutral-600 rounded-lg">
                            <h2 class="text-xl font-semibold mb-2">{$t(layer.layerID + ".name")}</h2>
                            <p class="mt-2">{$t("statistics.currentAmount", { values: { amount: formatNumber(layer.getCurrency()) } })}</p>
                            <p>{$t("statistics.gainAmount", { values: { gain: formatNumber(layer.currencyPerSecond()) } })}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        {:else if settings.statsPageName === "achievements"}
            <h1 class="text-2xl font-bold p-4 whitespace-nowrap">{$t("achievements.name")}</h1>
            <p class="whitespace-nowrap text-center">
                {$t("achievements.amount_ln1")} 
                <br/>
                { $gameStore.tree.comletedAchievementsCount() } / { $gameStore.tree.achievements.length } 
                <br/>
                {$t("achievements.amount_ln2")}
            </p>
            <div class="flex-1 overflow-y-auto w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each $gameStore.tree.achievements as achievement}
                    <AchievementTile id={achievement.id} />
                {/each}
            </div>
        {/if}
        
        <!-- Pages -->
        <div class="absolute bottom-0 w-full flex flex-row items-center">
            <button class="align-left p-4 hover:bg-neutral-600 flex-1" aria-label="Statistics" onclick={() => settings.statsPageName = "statistics"}
                style="{settings.statsPageName === 'statistics' ? 'box-shadow: inset 0 -4px 0 0 white;' : ''}">
                <div class="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512a9.025 9.025 0 015.488 5.488z" />
                    </svg>
                </div>
            </button>
            <button class="align-left p-4 hover:bg-neutral-600 flex-1" aria-label="Achievements" onclick={() => settings.statsPageName = "achievements"}
                style="{settings.statsPageName === 'achievements' ? 'box-shadow: inset 0 -4px 0 0 white;' : ''}">
                <div class="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 19v-3.1q-1.225-.275-2.187-1.037T7.4 12.95q-1.875-.225-3.137-1.637T3 8V7q0-.825.588-1.412T5 5h2q0-.825.588-1.412T9 3h6q.825 0 1.413.588T17 5h2q.825 0 1.413.588T21 7v1q0 1.9-1.263 3.313T16.6 12.95q-.45 1.15-1.412 1.913T13 15.9V19h3q.425 0 .713.288T17 20t-.288.713T16 21H8q-.425 0-.712-.288T7 20t.288-.712T8 19zm-4-8.2V7H5v1q0 .95.55 1.713T7 10.8m5 3.2q1.25 0 2.125-.875T15 11V5H9v6q0 1.25.875 2.125T12 14m5-3.2q.9-.325 1.45-1.088T19 8V7h-2zm-5-1.3" />
                    </svg>
                </div>
            </button>
        </div>
    </div>
</div>