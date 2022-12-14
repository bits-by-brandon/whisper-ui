<script lang="ts">
	import { onMount } from 'svelte';

	export let stream: MediaStream;

	const barCount = 24;
	const bars: HTMLSpanElement[] = Array(barCount);
	const barValues: number[] = Array(barCount).fill(0);
	const audioCtx = new AudioContext();
	const source = audioCtx.createMediaStreamSource(stream);
	const analyser = audioCtx.createAnalyser();
	analyser.fftSize = 32;

	const freqData = new Uint8Array(analyser.frequencyBinCount);
	source.connect(analyser);

	function tick() {
		//per frame
		analyser.getByteFrequencyData(freqData);
		const scale = Math.min(freqData[2] * 0.003, 1);
		barValues.push(scale);
		barValues.shift();

		for (let i = 0; i < barValues.length; i++) {
			bars[i].style.transform = `scaleY(${barValues[i]})`;
		}

		requestAnimationFrame(tick);
	}

	onMount(() => {
		requestAnimationFrame(tick);
	});
</script>

<div class="Waveform">
	<div class="inner">
		{#each bars as _, i}
			<span class="bar" bind:this={bars[i]} />
		{/each}
	</div>
</div>

<style>
	.Waveform {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 12px;
		width: 100%;
	}

	.inner {
		height: 120px;
		padding: 4px 8px;
		border: 1px solid var(--neutral-500);
		background: var(--neutral-400);
		border-radius: 5px;
		gap: 2px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
	}

	.bar {
		width: 2px;
		border-radius: 2px;
		height: 100%;
		background: var(--red-700);
		transform-origin: center;
	}
</style>
