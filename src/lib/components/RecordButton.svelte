<script lang="ts">
	import { BaseDirectory, writeBinaryFile } from '@tauri-apps/api/fs';
	import { MediaFile } from '$lib/models/mediaFile';
	import { transcripts } from '$lib/stores/transcripts';
	import { devices } from '$lib/stores/devices';
	import { getRecordingsDir } from '$lib/util/fs';
	import Microphone from 'svelte-icons/fa/FaMicrophone.svelte';
	import Button from './Button.svelte';

	export let recording = false;
	export let stream: MediaStream | null = null;

	let recorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];

	async function requestMediaDevice() {
		await navigator.mediaDevices.getUserMedia({ audio: true });
		$devices.availableDevices = await navigator.mediaDevices.enumerateDevices();
		$devices.modalOpen = true;
	}

	async function handleRecord() {
		if (!$devices.selectedDevice) {
			await requestMediaDevice();
			return;
		}

		if (!stream) {
			// Select which audio source to record from
			stream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: 'D0A12E908A371D259FC7CD80C07D28BBD2B9D425' }
			});
		}

		if (!recorder) {
			recorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
			recorder.addEventListener('dataavailable', handleDataAvailable);
			recorder.addEventListener('stop', saveRecording);
		}

		if (recorder.state === 'recording') {
			recorder.stop();
			recording = false;
		} else {
			recorder.start();
			recording = true;
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
		const blob = new Blob(recordedChunks, { type: 'video/webm' });
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

<Button on:click={handleRecord}>
	<span slot="icon" class="mic-icon" class:recording>
		<Microphone />
	</span>
</Button>

<style>
	.mic-icon.recording {
		color: var(--red-700);
		animation: pulse alternate infinite 700ms ease-in-out;
	}
</style>
