<script lang="ts">
	export let data: string;
	type Timestamp = {
		hours: string;
		minutes: string;
		seconds: string;
	};

	function toTimestamp(matchArray: RegExpMatchArray): Timestamp {
		return {
			hours: matchArray[1],
			minutes: matchArray[2],
			seconds: matchArray[3]
		};
	}

	const timestampRegex = /(\d\d):(\d\d):(\d\d)/g;
	$: [timestamp, text] = data.split(']');
	$: match = [...timestamp.matchAll(timestampRegex)] || [];
	$: start = toTimestamp(match[0]);
	$: end = toTimestamp(match[1]);
</script>

<div class="line">
	{#if timestamp}
		<span
			on:selectstart={() => false}
			on:mousedown={() => false}
			on:copy={() => false}
			on:cut={() => false}
			on:paste={() => false}
			class="timestamp"
		>
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
