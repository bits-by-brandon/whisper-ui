<script lang="ts">
	import { MediaFile } from '$lib/models/mediaFile';
	import { devices } from '$lib/stores/devices';
	import { transcripts } from '$lib/stores/transcripts';
	import { getRecordingsDir } from '$lib/util/fs';
	import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs';
	import { createEventDispatcher, onMount } from 'svelte';
	// @ts-ignore
	import Check from 'svelte-icons/fa/FaCheck.svelte';
	import Button from './Button.svelte';
	import Select from './Select.svelte';

	export let stream: MediaStream | null;

	const dispatch = createEventDispatcher();

	$: audioDevices = $devices.availableDevices.filter((d) => d.kind === 'audioinput');
	let recorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];

	onMount(async () => {
		if ($devices.availableDevices.length === 0) {
			await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
			$devices.availableDevices = await navigator.mediaDevices.enumerateDevices();
		}
	});

	async function handleRecord() {
		if (!$devices.selectedDevice) {
			return;
		}

		if (!stream) {
			// Select which audio source to record from
			stream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: $devices.selectedDevice.deviceId }
			});
		}

		if (!recorder) {
			recorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
			recorder.addEventListener('dataavailable', handleDataAvailable);
			recorder.addEventListener('stop', saveRecording);
			setInterval(() => {
				if (recorder?.state === 'recording') {
					recorder.requestData();
				}
			}, 500);
		}

		if (recorder.state === 'recording') {
			recorder.stop();
		} else {
			recorder.start();
			dispatch('recordstart');
		}

		// Reassign to force a re-render
		recorder = recorder;
	}

	function handleDataAvailable(event: BlobEvent) {
		if (event.data.size > 0) {
			recordedChunks.push(event.data);
		}
	}

	async function saveRecording() {
		if (recordedChunks.length === 0) throw Error('No data chunks to write');
		const blob = new Blob(recordedChunks, { type: 'audio/mp4' });
		recordedChunks = [];
		const arrayBuffer = await blob.arrayBuffer();
		const recordingDir = await getRecordingsDir();
		const path = `${recordingDir}new-recording-${Date.now()}.mp3`;
		await writeBinaryFile(path, arrayBuffer, { dir: BaseDirectory.AppCache });
		const mediaFile = await MediaFile.create(path);
		transcripts.createFromFile(mediaFile);
		transcripts.setActive(mediaFile);
	}
</script>

<div class="device-selection">
	<h3 class="title">Select a recording device</h3>

	<div class="fieldset">
		<Select bind:value={$devices.selectedDevice}>
			<option value={null}>
				None
			</option>
			{#each audioDevices as device}
				<option value={device}>
					{device.label}
				</option>
			{/each}
		</Select>

		<Button on:click={handleRecord}>
			<Check slot="icon" />
			Record
		</Button>
	</div>
</div>

<style>
	.title {
		margin: 0 0 12px;
	}

	.fieldset {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.fieldset > *:first-child {
		flex-grow: 1;
	}
</style>
