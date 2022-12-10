<script lang="ts">
	import Line from '$lib/components/Line.svelte';
	import type { MediaFile } from '$lib/models/mediaFile';
	import { active, transcripts } from '$lib/stores/transcripts';
	import Button from './Button.svelte';

	function handleTranscribe(file: MediaFile) {
		transcripts.startTranscription(file);
	}
</script>

<div class="content-pane">
	{#if $active}
		{@const a = $active}
		{#if a.status !== 'transcribed'}
			<div class="transcribe-ready">
				File ready to be transcribed
				<Button on:click={() => handleTranscribe(a.file)} disabled={a.status === 'transcribing'}>
					{#if a.status === 'transcribing'}
						Transcribing...
					{:else}
						Start Transcribing
					{/if}
				</Button>
			</div>
		{:else}
			<h2>{$active.file.fileName}</h2>
		{/if}
		{#each $active.rawOutput as line}
			<Line data={line} />
		{/each}
	{:else}
		<div class="transcribe-ready">Select a transcript</div>
	{/if}
</div>

<style>
	.content-pane {
		background: var(--neutral-200);
		grid-area: main;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 0;
		overflow-y: scroll;
	}

	.transcribe-ready {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 12px;
		width: 300px;
		margin: auto;
	}

	h2 {
		margin: 0;
		padding: 12px;
		font-size: 18px;
		position: sticky;
		top: 0;
		background-color: rgba(31, 31, 31, 0.1);
		backdrop-filter: blur(7px);
		-webkit-backdrop-filter: blur(7px);
	}
</style>
