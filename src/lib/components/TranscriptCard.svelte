<script lang="ts">
	import type { Transcript } from '$lib/models/transcript';
	import { transcripts, active } from '$lib/stores/transcripts';
	import { secondsToTimecode } from '$lib/util/timecode';
	import { onMount } from 'svelte';
	import Circle from 'svelte-icons/fa/FaRegCircle.svelte';
	import Dot from 'svelte-icons/fa/FaRegDotCircle.svelte';
	import Check from 'svelte-icons/fa/FaRegCheckCircle.svelte';
	export let transcript: Transcript;

	$: path = transcript.file.path;
	$: isActive = $active?.file.path === path;

	onMount(async () => {
		if (transcript.duration === null) {
			transcripts.calculateDuration(transcript.file);
		}
	});
</script>

<button class="transcript-card" class:isActive on:click={() => ($transcripts.active = path)}>
	<span class="name">
		{transcript.file.fileName}
	</span>
	<span class="bottom">
		<div class="icon">
			{#if transcript.status === 'empty'}<Circle />{/if}
			{#if transcript.status === 'transcribing'}<Dot />{/if}
			{#if transcript.status === 'transcribed'}<Check />{/if}
		</div>

		<div class="extension">
			{transcript.file.extension}
		</div>

		<div class="duration">
			{#if transcript.duration}
				{secondsToTimecode(Math.ceil(transcript.duration))}
			{:else}
				Determining length...
			{/if}
		</div>
	</span>
</button>

<style>
	.transcript-card {
		text-align: left;
		appearance: none;
		display: grid;
		width: 100%;
		border: none;
		background: none;
		border-radius: 5px;
		color: var(--neutral-900);
		font-size: 12px;
		padding: 4px 8px;
		gap: 4px;
		cursor: pointer;
	}

	.icon {
		width: 12px;
		height: 12px;
	}

	.bottom {
		display: flex;
		flex-direction: row;
		gap: 8px;

		font-size: 10px;
		color: var(--neutral-800);
	}

	.extension {
		text-transform: uppercase;
	}

	.isActive {
		background: var(--neutral-400);
	}
</style>
