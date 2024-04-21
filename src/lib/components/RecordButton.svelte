<script lang="ts">
	// @ts-ignore
	import Microphone from 'svelte-icons/fa/FaMicrophone.svelte';
	// @ts-ignore
	import Stop from 'svelte-icons/fa/FaStop.svelte';
	import Button from './Button.svelte';
	import Flyout from './Flyout.svelte';
	import RecordFlyout from './RecordFlyout.svelte';

	export let recording = false;
	export let stream: MediaStream | null;

	let modalOpen = false;
	let buttonDomRect: DOMRect;

	function handleRecordStart() {
		modalOpen = false;
		recording = true;
	}

	function handleRecordStop() {
		recording = false;
		if (stream) {
			const tracks = stream.getTracks();
			tracks.forEach((track) => {
				track.stop();
			});
		}
	}

	function handleMicrophoneButtonClick() {
		if (recording) {
			handleRecordStop();
		} else {
			modalOpen = !modalOpen;
		}
	}
</script>

<Button on:click={handleMicrophoneButtonClick} bind:domRect={buttonDomRect}>
	<span slot="icon" class="mic-icon" class:recording>
		{#if recording}
			<Stop />
		{:else}
			<Microphone />
		{/if}
	</span>
</Button>

<Flyout open={modalOpen} targetRect={buttonDomRect}>
	<RecordFlyout on:recordstart={handleRecordStart} bind:stream />
</Flyout>

<style>
	.mic-icon.recording {
		color: var(--red-700);
		animation: pulse alternate infinite 700ms ease-in-out;
	}
</style>
