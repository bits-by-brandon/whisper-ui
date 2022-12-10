<script lang="ts">
	import type { Transcript } from '$lib/models/transcript';
	import { transcripts, active } from '$lib/stores/transcripts';
	import { secondsToTimecode } from '$lib/util/timecode';
	import { onMount } from 'svelte';
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
	{transcript.file.fileName}
	<span class="duration">
		{#if transcript.duration}
			{secondsToTimecode(Math.ceil(transcript.duration))}
		{:else}
			Determining length...
		{/if}
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

	.duration {
		font-size: 10px;
		color: var(--neutral-800);
	}

	.isActive {
		background: var(--neutral-400);
	}
</style>
