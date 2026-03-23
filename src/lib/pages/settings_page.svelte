<script lang="ts">
    import { t } from 'svelte-i18n'
    import { settings } from '$lib/scripts/utils/settings.svelte';
    import { game } from '$lib/scripts/game';
</script>

<div>
    <h2 class="text-3xl font-bold mb-4">{$t("settings.title")}</h2>
    <p class="mb-4">{$t("settings.description")}</p>

    <div class="space-y-2">
        <div class="flex items-center">
            <label for="language" class="mr-4">{$t("settings.language")}:</label>
            <select id="language" bind:value={settings.language} class="form-select bg-neutral-700 text-white border border-neutral-600 rounded p-2">
                <option value="en">English</option>
                <!-- Add more languages as needed -->
            </select>
        </div>
        <div class="flex items-center">
            <label for="notation" class="mr-4">{$t("settings.notation.title")}:</label>
            <select id="notation" bind:value={settings.notation} class="form-select bg-neutral-700 text-white border border-neutral-600 rounded p-2">
                <option value="standard">{$t("settings.notation.standard")}</option>
                <option value="scientific">{$t("settings.notation.scientific")}</option>
                <option value="engineering">{$t("settings.notation.engineering")}</option>
            </select>
        </div>
        <div class="flex items-center">
            <button id="hard_reset" on:click={() => {
                // TODO: Fancy confirmation dialog
                if (confirm($t("settings.hard_reset_desc"))) {
                    localStorage.clear();
                    game.hardReset();
                    //location.reload();
                }
            }} class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                {$t("settings.hard_reset")}  
            </button>
        </div>
    </div>
</div>