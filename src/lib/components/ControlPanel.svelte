<script lang="ts">
	import Text from 'svelte-icons/fa/FaAlignLeft.svelte';
	import VTT from 'svelte-icons/fa/FaClosedCaptioning.svelte';
	import { active, output } from '$lib/stores/transcripts';
	import { playback } from '$lib/stores/playback';
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { save } from '@tauri-apps/api/dialog';
	import { writeTextFile } from '@tauri-apps/api/fs';
	import { downloadDir } from '@tauri-apps/api/path';

	onMount(() => ($playback.currentTime = 0));

	async function handleSave(name: string, content: string, format: string) {
		const defaultPath = await downloadDir();
		const path = await save({
			title: 'Save transcription',
			defaultPath: `${defaultPath}${name}.${format}`,
			filters: [{ name, extensions: [format] }]
		});
		if (path) writeTextFile(path, content);
	}
</script>

{#if $active && $active.status === 'transcribed'}
	<div class="control-panel">
		<audio
			src={$active.file.blobUrl || ''}
			controls
			bind:currentTime={$playback.currentTime}
			bind:paused={$playback.paused}
		/>

		<Button
			on:click={() => {
				if ($active) handleSave($active.name, $output.text, 'txt');
			}}
		>
			<Text slot="icon" />
			Export plain text
		</Button>

		<Button
			on:click={() => {
				if ($active) handleSave($active.name, $output.vtt, 'vtt');
			}}
		>
			<VTT slot="icon" />
			Export vtt
		</Button>
	</div>
{/if}

<style>
	.control-panel {
		grid-area: foot;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background-color: var(--neutral-200);
		border-top: 1px solid var(--neutral-400);
		backdrop-filter: blur(7px);
		-webkit-backdrop-filter: blur(7px);
	}

	audio {
		margin-right: auto;
		max-width: 600px;
		flex-grow: 1;
	}
</style>
