<script lang="ts">
	import { playback } from '$lib/stores/playback';
	import { parseRawOutput } from '$lib/util/timecode';
	export let line: string;

	$: ({ start, end, text, startSeconds, endSeconds } = parseRawOutput(line));
	$: active = $playback.currentTime > startSeconds && $playback.currentTime < endSeconds;
</script>

<div class="line" class:active>
	<span class="timestamp">
		{start.hoursStr}:{start.minutesStr}:{start.secondsStr} → {end.hoursStr}:{end.minutesStr}:{end.secondsStr}
	</span>
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
