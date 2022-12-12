<script lang="ts">
	import { playback } from '$lib/stores/playback';
	export let line: string;

	type TimeData = {
		hours: number;
		minutes: number;
		seconds: number;
	};

	function timecodeToTimeData(matchArray: RegExpMatchArray): TimeData {
		return {
			hours: parseInt(matchArray[1]),
			minutes: parseInt(matchArray[2]),
			seconds: parseFloat(matchArray[3])
		};
	}

	function timeDataToSeconds(time: TimeData) {
		return time.hours * 3600 + time.minutes * 60 + time.seconds;
	}

	const timestampRegex = /(\d\d):(\d\d):(\d\d)/g;
	$: [timestamp, text] = line.split(']');
	$: match = [...timestamp.matchAll(timestampRegex)] || [];
	$: start = timecodeToTimeData(match[0]);
	$: end = timecodeToTimeData(match[1]);
	$: startSeconds = timeDataToSeconds(start);
	$: endSeconds = timeDataToSeconds(end);
	$: active = $playback.currentTime > startSeconds && $playback.currentTime < endSeconds;
</script>

<div class="line" class:active>
	{#if timestamp}
		<span class="timestamp">
			{start.hours}:{start.minutes}:{start.seconds} → {end.hours}:{end.minutes}:{end.seconds}
		</span>
	{/if}
	{#if text}
		<span class="text">
			{text}
		</span>
	{/if}
</div>

<style>
	.line {
		display: grid;
		grid-template-columns: 120px auto;
		padding: 0px 12px;
	}

	.line:hover {
		background-color: var(--neutral-300);
	}

	.line.active {
		background-color: var(--blue-500);
	}

	.timestamp {
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		pointer-events: none;
		text-align: center;
		justify-self: flex-start;
		align-self: flex-start;
		display: inline-block;
		padding: 4px;
		margin-top: 3px;
		border-radius: 5px;
		background-color: var(--neutral-300);
		color: var(--neutral-600);
		font-size: 10px;
		line-height: 1;
	}

	.text {
		color: var(--neutral-900);
	}
</style>
