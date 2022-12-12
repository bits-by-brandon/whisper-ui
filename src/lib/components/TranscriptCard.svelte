<script lang="ts">
	import { sep } from '@tauri-apps/api/path';
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import Circle from 'svelte-icons/fa/FaRegCircle.svelte';
	import Dot from 'svelte-icons/fa/FaRegDotCircle.svelte';
	import Check from 'svelte-icons/fa/FaRegCheckCircle.svelte';
	import Error from 'svelte-icons/fa/FaExclamationCircle.svelte';
	import Close from 'svelte-icons/md/MdClose.svelte';
	import { transcripts, active } from '$lib/stores/transcripts';
	import { secondsToTimecode } from '$lib/util/timecode';

	export let transcript: Transcript;
	let name = transcript.name;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target) {
			name = target.value.replaceAll(sep, '');
			transcripts.setName(transcript.file, name);
		}
	}

	function handleClose(e: Event) {
		e.stopPropagation();
		transcripts.close(transcript.file);
	}

	$: path = transcript.file.path;
	$: isActive = $active?.file.path === path;
</script>

<button
	class="transcript-card"
	class:isActive
	on:click={() => ($transcripts.active = path)}
	in:fly={{ duration: 300, x: 10, y: 0, easing: quadOut }}
	out:fly={{ duration: 300, x: 10, y: 0, easing: quadOut }}
>
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
		<button class="close" on:click={handleClose}>
			<Close />
		</button>
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
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		border: none;
		background: none;
		border-radius: 5px;
		padding: 5px 8px;
		gap: 4px;
	}

	.name {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		gap: 4px;
	}

	.input-name {
		appearance: none;
		border: 0;
		margin: 0;
		padding: 0 0 0 4px;
		background: transparent;
		color: var(--neutral-900);
		display: inline-block;
		font-size: 14px;
		border-radius: 4px;
		text-overflow: ellipsis;
		width: 160px;
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

	.close {
		width: 16px;
		height: 16px;
		padding: 0;
		color: var(--neutral-600);
		background: transparent;
		border: none;
		border-radius: 5px;
		opacity: 0;
	}

	.transcript-card:hover .close {
		opacity: 1;
	}

	.close:hover {
		background: var(--neutral-500);
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
