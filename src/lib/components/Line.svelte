<script lang="ts">
	import { playback } from '$lib/stores/playback';
	import { parseRawOutput } from '$lib/util/timecode';
	import Play from 'svelte-icons/fa/FaPlay.svelte';
	export let line: string;

	$: ({ start, end, text, startSeconds, endSeconds } = parseRawOutput(line));
	$: active = $playback.currentTime > startSeconds && $playback.currentTime < endSeconds;

	function handleSeek() {
		$playback.currentTime = startSeconds;
		$playback.paused = false;
	}
</script>

<div class="line" class:active>
	<span class="timestamp">
		{start.hoursStr}:{start.minutesStr}:{start.secondsStr} → {end.hoursStr}:{end.minutesStr}:{end.secondsStr}
	</span>
	<span class="text">
		{text}
	</span>

	<div class="menu">
		<button class="line-button" on:click={handleSeek}>
			<Play />
		</button>
	</div>
</div>

<style>
	.line {
		display: flex;
		padding: 0px 12px;
		gap: 12px;
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

		flex-shrink: 0;
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
		flex-grow: 1;
	}

	.menu {
		opacity: 0;
		flex-shrink: 0;
	}

	.line:hover .menu {
		opacity: 1;
	}

	.line-button {
		appearance: none;
		display: inline-block;
		color: var(--neutral-900);
		border: 0;
		background-color: transparent;
		width: 18px;
		height: 18px;
		padding: 2px 4px;
		line-height: 1;
		border-radius: 3px;
		margin: 0;
		cursor: pointer;
	}

	.line-button:hover {
		background-color: var(--neutral-400);
	}
</style>
