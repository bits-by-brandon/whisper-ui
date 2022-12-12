<script lang="ts">
	import { transcripts } from '$lib/stores/transcripts';
	import { openMediaFile } from '$lib/util/fs';
	import Plus from 'svelte-icons/fa/FaPlus.svelte';
	import Microphone from 'svelte-icons/fa/FaMicrophone.svelte';
	import Button from './Button.svelte';
	import TranscriptCard from './TranscriptCard.svelte';

	async function handleOpenFile() {
		const mediaFile = await openMediaFile();
		await transcripts.createFromFile(mediaFile);
		transcripts.setActive(mediaFile);
	}
</script>

<div class="sidebar">
	<div class="menu">
		<Button on:click={handleOpenFile}>
			<Plus slot="icon" />
			Open file
		</Button>
		<Button>
			<Microphone slot="icon" />
		</Button>
	</div>
	<ul class="transcripts">
		{#each Array.from($transcripts.list) as [_, transcript]}
			<li><TranscriptCard {transcript} /></li>
		{/each}
	</ul>
</div>

<style>
	.sidebar {
		grid-area: side;
		padding: 48px 12px;
		background: var(--neutral-300);
		border-right: 1px solid var(--neutral-400);
	}

	.menu {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid var(--neutral-400);
		padding-bottom: 24px;
		gap: 4px;
	}

	.menu:first-child {
		flex-grow: 1;
	}

	.transcripts {
		padding: 12px 0;
		margin: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
</style>
