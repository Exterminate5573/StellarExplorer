<script lang="ts">
    import LayerPage from "$lib/pages/layer_page.svelte";
    import SettingsPage from "$lib/pages/settings_page.svelte";
    import { game, gameStore } from "$lib/scripts/game";
    import { settings } from "$lib/scripts/interfaces/settings.svelte";
    import { onDestroy, onMount } from "svelte";
    import { t } from 'svelte-i18n';

    let hoveredLayer: string | null = $state(null);

    onMount(() => {
        game.start();
    });

    onDestroy(() => {
        //TODO: Add any cleanup logic if necessary
    });
</script>

<div class="flex h-screen bg-neutral-800 text-white">
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
</div>