<script lang="ts">
	import type { Transcript } from '$lib/models/transcript';
	import { transcripts, active } from '$lib/stores/transcripts';
	export let transcript: Transcript;
	$: path = transcript.file.path;
	$: isActive = $active?.file.path === path;
</script>

<button class="transcript-card" class:isActive on:click={() => ($transcripts.active = path)}>
	{transcript.file.fileName}
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
    cursor: pointer;
	}

	.isActive {
		background: var(--neutral-400);
	}
</style>
