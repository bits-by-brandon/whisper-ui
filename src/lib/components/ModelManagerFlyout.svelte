<script lang="ts">
        import { onMount } from 'svelte';
        // @ts-ignore
        import Check from 'svelte-icons/fa/FaCheck.svelte';
        // @ts-ignore
        import Download from 'svelte-icons/fa/FaDownload.svelte';
        // @ts-ignore
        import Trash from 'svelte-icons/fa/FaTrash.svelte';
        import { models } from '$lib/stores/models';
        import type { ModelsStoreState } from '$lib/stores/models';

        const { refresh, download, remove, select, clearError } = models;

        let state: ModelsStoreState;
        $: state = $models;

        onMount(() => {
                refresh();
        });

        function formatBytes(bytes: number): string {
                if (!Number.isFinite(bytes) || bytes <= 0) return 'Unknown size';
                const units = ['B', 'KB', 'MB', 'GB', 'TB'];
                const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
                const size = bytes / Math.pow(1024, exponent);
                return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[exponent]}`;
        }

        function formatInstalledAt(timestamp: string): string {
                const date = new Date(timestamp);
                if (Number.isNaN(date.getTime())) {
                        return 'Installed';
                }
                return `Installed ${date.toLocaleString()}`;
        }
</script>

<div class="model-manager">
        <header>
                <h3>Whisper models</h3>
                <p>Select and manage the models stored on this device.</p>
        </header>

        {#if state.error}
                <div class="banner" role="alert">
                        <span>{state.error}</span>
                        <button class="link" type="button" on:click={clearError}>Dismiss</button>
                </div>
        {/if}

        {#if state.loading && Object.keys(state.installed).length === 0}
                <div class="loading">Checking installed models…</div>
        {/if}

        <ul class="model-list">
                {#each state.available as model (model.id)}
                        <li class:active={state.selectedModelId === model.id}>
                                <div class="model-row">
                                        <label class="model-label">
                                                <input
                                                        type="radio"
                                                        name="selected-model"
                                                        value={model.id}
                                                        checked={state.selectedModelId === model.id}
                                                        disabled={!state.installed[model.id] || state.removing[model.id]}
                                                        on:change={() => select(model.id)}
                                                />
                                                <span class="name">{model.label}</span>
                                                {#if model.id === state.recommendedModelId}
                                                        <span class="badge">Recommended</span>
                                                {/if}
                                        </label>
                                        <div class="actions">
                                                {#if state.installed[model.id]}
                                                        <button
                                                                class="icon-button"
                                                                type="button"
                                                                aria-label={`Remove ${model.label}`}
                                                                on:click={() => remove(model.id)}
                                                                disabled={state.removing[model.id]}
                                                        >
                                                                {#if state.removing[model.id]}
                                                                        <span class="spinner" aria-hidden="true" />
                                                                {:else}
                                                                        <Trash />
                                                                {/if}
                                                        </button>
                                                {:else}
                                                        <button
                                                                class="icon-button"
                                                                type="button"
                                                                aria-label={`Download ${model.label}`}
                                                                on:click={() => download(model.id)}
                                                                disabled={state.downloading[model.id] || state.loading}
                                                        >
                                                                {#if state.downloading[model.id]}
                                                                        <span class="spinner" aria-hidden="true" />
                                                                {:else}
                                                                        <Download />
                                                                {/if}
                                                        </button>
                                                        {/if}
                                                </div>
                                        </div>
                                        <div class="model-meta">
                                                <span>{formatBytes(model.sizeBytes)}</span>
                                                <span>•</span>
                                                <span>{model.languages === 'english' ? 'English only' : 'Multilingual'}</span>
                                        </div>
                                        <p class="description">{model.description}</p>
                                        <div class="status">
                                                {#if state.installed[model.id]}
                                                        <span class="status-icon"><Check /></span>
                                                        <span>{formatInstalledAt(state.installed[model.id].downloadedAt)}</span>
                                                {:else if state.downloading[model.id]}
                                                        <span>Downloading…</span>
                                                {:else}
                                                        <span>Not installed</span>
                                                {/if}
                                        </div>
                                </li>
                {/each}
        </ul>
</div>

<style>
        .model-manager {
                min-width: 320px;
                max-width: 420px;
                display: flex;
                flex-direction: column;
                gap: 12px;
        }

        header h3 {
                margin: 0;
                font-size: 16px;
        }

        header p {
                margin: 4px 0 0;
                font-size: 13px;
                color: var(--neutral-700);
        }

        .banner {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                padding: 8px;
                border-radius: 6px;
                background: var(--red-100);
                color: var(--red-900);
        }

        .link {
                appearance: none;
                border: none;
                background: transparent;
                color: inherit;
                text-decoration: underline;
                cursor: pointer;
                font-size: 12px;
                padding: 0;
        }

        .model-list {
                display: flex;
                flex-direction: column;
                margin: 0;
                padding: 0;
                list-style: none;
                gap: 8px;
        }

        .loading {
                font-size: 12px;
                color: var(--neutral-700);
        }

        li {
                border: 1px solid var(--neutral-500);
                border-radius: 8px;
                padding: 10px;
                background: var(--neutral-300);
                display: flex;
                flex-direction: column;
                gap: 8px;
        }

        li.active {
                border-color: var(--blue-600);
                box-shadow: 0 0 0 1px var(--blue-500);
        }

        .model-row {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
        }

        .model-label {
                display: flex;
                align-items: center;
                gap: 8px;
        }

        .model-label input {
                accent-color: var(--blue-600);
        }

        .name {
                font-weight: 600;
        }

        .badge {
                background: var(--blue-200);
                color: var(--blue-900);
                border-radius: 999px;
                padding: 2px 8px;
                font-size: 11px;
        }

        .actions {
                display: flex;
                gap: 6px;
        }

        .icon-button {
                appearance: none;
                border: 1px solid var(--neutral-500);
                background: var(--neutral-400);
                color: var(--neutral-900);
                border-radius: 4px;
                height: 28px;
                width: 32px;
                display: grid;
                place-items: center;
                cursor: pointer;
        }

        .icon-button:disabled {
                opacity: 0.5;
                cursor: default;
        }

        .model-meta {
                display: flex;
                gap: 6px;
                font-size: 12px;
                color: var(--neutral-700);
        }

        .description {
                margin: 0;
                font-size: 12px;
                color: var(--neutral-800);
        }

        .status {
                display: flex;
                gap: 6px;
                align-items: center;
                font-size: 12px;
                color: var(--neutral-800);
        }

        .status-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--green-600);
        }

        .status-icon :global(svg) {
                height: 12px;
                width: 12px;
        }

        .spinner {
                width: 16px;
                height: 16px;
                border-radius: 999px;
                border: 2px solid rgba(0, 0, 0, 0.2);
                border-top-color: rgba(0, 0, 0, 0.6);
                animation: spin 700ms linear infinite;
        }

        @keyframes spin {
                from {
                        transform: rotate(0deg);
                }
                to {
                        transform: rotate(360deg);
                }
        }
</style>
