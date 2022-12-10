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
		padding: 12px 0;
		overflow-y: scroll;
	}

	.transcribe-ready {
		text-align: center;
		width: 300px;
		margin: auto;
	}
</style>
