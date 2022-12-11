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
		{@const { status, file, rawOutput } = $active}
		{#if status === 'transcribed'}
			<h2>{file.fileName}</h2>
			{#each rawOutput as line}
				<Line data={line} />
			{/each}
		{:else}
			<div class="transcribe-ready">
				{#if status === 'empty'}
					File ready to be transcribed
					<Button on:click={() => handleTranscribe(file)}>Start Transcribing</Button>
				{:else if status === 'error'}
					Something went wrong
				{:else if status === 'transcribing'}
					Transcribing...
				{/if}
			</div>
		{/if}
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
		flex-grow: 1;
		padding: 0;
		overflow-y: scroll;
		position: relative;
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
		margin: 24px 0 0;
		padding: 12px;
		position: sticky;
		top: 0;
		background-color: rgba(31, 31, 31, 0.6);
		backdrop-filter: blur(7px);
		-webkit-backdrop-filter: blur(7px);
	}
</style>
