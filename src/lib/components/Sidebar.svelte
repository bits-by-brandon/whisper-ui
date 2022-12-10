<script lang="ts">
	import { transcripts } from '$lib/stores/transcripts';
	import { openMediaFile } from '$lib/util/fs';
	import Plus from 'svelte-icons/fa/FaPlus.svelte'
	import Button from './Button.svelte';
	import TranscriptCard from './TranscriptCard.svelte';

	async function handleOpenFile() {
		const mediaFile = await openMediaFile();
		await transcripts.createFromFile(mediaFile);
		transcripts.setActive(mediaFile);
	}
</script>

<div class="sidebar">
	<Button on:click={handleOpenFile}>
		<Plus slot="icon" />
		Open audio file</Button
	>
	<ul class="transcripts">
		{#each Array.from($transcripts.list) as [_, transcript]}
			<li><TranscriptCard {transcript} /></li>
		{/each}
	</ul>
</div>

<style>
	.sidebar {
		grid-area: side;
		padding: 12px;
		background: var(--neutral-300);
		border-right: 1px solid var(--neutral-400);
	}

	.transcripts {
		padding: 24px 0;
		margin: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
