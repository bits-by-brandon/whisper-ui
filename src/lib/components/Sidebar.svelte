<script lang="ts">
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { appWindow } from '@tauri-apps/api/window';
	import { transcripts } from '$lib/stores/transcripts';
	import { createMediaFile, openMediaFile } from '$lib/util/fs';
	import Plus from 'svelte-icons/fa/FaPlus.svelte';
	import Microphone from 'svelte-icons/fa/FaMicrophone.svelte';
	import Button from './Button.svelte';
	import TranscriptCard from './TranscriptCard.svelte';

	let dragCount = 0;
	$: dragging = dragCount > 0;

	async function handleOpenFile() {
		const mediaFile = await openMediaFile();
		await transcripts.createFromFile(mediaFile);
		transcripts.setActive(mediaFile);
	}

	onMount(async () => {
		return await appWindow.onFileDropEvent(async (event) => {
			if (event.payload.type === 'drop' && dragging) {
				dragging = false;
				event.payload.paths.forEach((path) => {
					createMediaFile(path).then((media) => transcripts.createFromFile(media));
				});
			} else if (event.payload.type === 'cancel') {
				dragging = false;
			}
		});
	});
</script>

<div class="sidebar" on:dragenter={() => (dragCount += 1)} on:dragleave={() => (dragCount -= 1)}>
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
		{#each Array.from($transcripts.list) as [filename, transcript] (filename)}
			<li animate:flip={{ duration: 300, delay: 300 }}><TranscriptCard {transcript} /></li>
		{/each}
	</ul>

	<div class="drag-modal" class:dragging>Drop file to import</div>
</div>

<style>
	.sidebar {
		grid-area: side;
		padding: 48px 12px;
		background: var(--neutral-300);
		border-right: 1px solid var(--neutral-400);
		position: relative;
	}

	.menu {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid var(--neutral-400);
		padding-bottom: 24px;
		gap: 8px;
	}

	:global(.menu > *:first-child) {
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

	.drag-modal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(255, 255, 255, 0.1);
		-webkit-backdrop-filter: blur(3px);
		backdrop-filter: blur(3px);
		outline: 1px dashed var(--neutral-500);
		outline-offset: -8px;
		z-index: 1;
		transition: opacity 300ms ease-in-out;
		opacity: 0;
		pointer-events: none;
	}

	.drag-modal.dragging {
		opacity: 1;
	}
</style>
