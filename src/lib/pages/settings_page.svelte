<script lang="ts">
    import { t } from 'svelte-i18n'
    import { settings } from '$lib/scripts/utils/settings.svelte';

    $effect(() => {
        // Save settings whenever they change
        settings.saveSettings();
    })
</script>

<div>
    <h2 class="text-3xl font-bold mb-4">{$t("settings.title")}</h2>
    <p class="mb-4">{$t("settings.description")}</p>

    <div class="space-y-4">
        <div class="flex items-center">
            <label for="language" class="mr-4">{$t("settings.language")}:</label>
            <select id="language" bind:value={settings.language} class="form-select bg-neutral-700 text-white border border-neutral-600 rounded p-2">
                <option value="en">English</option>
                <!-- Add more languages as needed -->
            </select>
        </div>
    </div>

    <div class="space-y-4">
        <div class="flex items-center">
            <label for="notation" class="mr-4">{$t("settings.notation.title")}:</label>
            <select id="notation" bind:value={settings.notation} class="form-select bg-neutral-700 text-white border border-neutral-600 rounded p-2">
                <option value="standard">{$t("settings.notation.standard")}</option>
                <option value="scientific">{$t("settings.notation.scientific")}</option>
                <option value="engineering">{$t("settings.notation.engineering")}</option>
            </select>
        </div>  
    </div>
</div>