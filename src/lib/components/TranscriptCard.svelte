<script lang="ts">
	import type { Transcript } from '$lib/models/transcript';
	import { transcripts, active } from '$lib/stores/transcripts';
	import { secondsToTimecode } from '$lib/util/timecode';
	import { onMount } from 'svelte';
	import Circle from 'svelte-icons/fa/FaRegCircle.svelte';
	import Dot from 'svelte-icons/fa/FaRegDotCircle.svelte';
	import Check from 'svelte-icons/fa/FaRegCheckCircle.svelte';
	import Error from 'svelte-icons/fa/FaExclamationCircle.svelte';
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
		<span class="icon {transcript.status}">
			{#if transcript.status === 'empty'}<Circle />{/if}
			{#if transcript.status === 'transcribing'}<Dot />{/if}
			{#if transcript.status === 'transcribed'}<Check />{/if}
			{#if transcript.status === 'error'}<Error />{/if}
		</span>
		{transcript.file.fileName}
	</span>
	<span class="bottom">
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
		font-size: 14px;
		padding: 4px 8px;
		gap: 6px;
		cursor: pointer;
	}

	.transcript-card:hover {
		background: var(--neutral-400);
	}

	.isActive {
		background: var(--neutral-400);
	}

	.icon {
		display: inline-block;
		transform: translateY(1px);
		margin-right: 2px;
		width: 12px;
		height: 12px;
	}

	.icon.empty {
		color: var(--neutral-500);
	}

	.icon.transcribing {
		color: var(--neutral-600);
		animation: glow alternate infinite 700ms ease-in-out;
	}

	.icon.transcribed {
		color: var(--green-700);
	}

	.icon.error {
		color: var(--yellow-700);
	}

	.bottom {
		display: flex;
		flex-direction: row;
		gap: 6px;

		font-size: 9px;
		color: var(--neutral-800);
	}

	.extension {
		text-transform: uppercase;
	}

	@keyframes glow {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}
</style>
