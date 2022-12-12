<script lang="ts">
	import { transcripts, active } from '$lib/stores/transcripts';
	import { secondsToTimecode } from '$lib/util/timecode';
	import Circle from 'svelte-icons/fa/FaRegCircle.svelte';
	import Dot from 'svelte-icons/fa/FaRegDotCircle.svelte';
	import Check from 'svelte-icons/fa/FaRegCheckCircle.svelte';
	import Error from 'svelte-icons/fa/FaExclamationCircle.svelte';
	import { sep } from '@tauri-apps/api/path';

	export let transcript: Transcript;
	let name = transcript.name;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target) {
			name = target.value.replaceAll(sep, '');
			transcripts.setName(transcript.file, name);
		}
	}

	$: path = transcript.file.path;
	$: isActive = $active?.file.path === path;
</script>

<button class="transcript-card" class:isActive on:click={() => ($transcripts.active = path)}>
	<div class="name">
		<span class="icon {transcript.status}">
			{#if transcript.status === 'empty'}<Circle />
			{:else if transcript.status === 'transcribing'}<Dot />
			{:else if transcript.status === 'transcribed'}<Check />
			{:else if transcript.status === 'error'}<Error />
			{/if}
		</span>
		<input
			autocomplete="”off”"
			class="input-name"
			type="text"
			bind:value={name}
			on:input={handleInput}
		/>
	</div>
	<div class="bottom">
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
	</div>
</button>

<style>
	.transcript-card {
		margin: 0;
		text-align: left;
		appearance: none;
		display: grid;
		width: 100%;
		border: none;
		background: none;
		border-radius: 5px;
		padding: 8px 12px;
		gap: 2px;
		cursor: pointer;
	}

	.name {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.input-name {
		appearance: none;
		border: 0;
		background: transparent;
		color: var(--neutral-900);
		display: inline-block;
		font-size: 14px;
		padding-left: 4px;
		border-radius: 4px;
	}

	.input-name:focus {
		outline: none;
		background-color: var(--neutral-500);
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
