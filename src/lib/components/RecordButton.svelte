<script lang="ts">
	import Microphone from 'svelte-icons/fa/FaMicrophone.svelte';
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

	function handleMicrophoneButtonClick() {
		if (recording) {
			recording = false;
		} else {
			modalOpen = !modalOpen;
		}
	}
</script>

<Button on:click={handleMicrophoneButtonClick} bind:domRect={buttonDomRect}>
	<span slot="icon" class="mic-icon" class:recording>
		<Microphone />
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
