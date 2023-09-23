<script lang="ts">
	import { fly } from 'svelte/transition';

	export let targetRect: DOMRect;
	export let open = false;
	let x = 0;
	let y = 0;
	const offset = 12;

	$: if (targetRect) {
		x = targetRect.x + targetRect.width / 2;
		y = targetRect.y + targetRect.height + offset;
	}
	$: style = `top: ${y}px; left: ${x}px`;
</script>

{#if open}
	<div class="flyout" {style} transition:fly={{ duration: 200, y: -5 }}>
		<slot />
	</div>
{/if}

<style>
	.flyout {
		--background-color: var(--neutral-400);
		--border-color: var(--neutral-500);

		position: fixed;
		background: var(--background-color);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 12px;
		z-index: 1;
		transform: translateX(-50%);
	}
	.flyout::after {
		--size: 12px;
		content: '';
		display: block;
		position: absolute;
		bottom: calc(100% - (var(--size) / 2));
		left: 50%;
		width: var(--size);
		height: var(--size);
		background: var(--background-color);
		border-top: 1px solid var(--border-color);
		border-left: 1px solid var(--border-color);
		transform-origin: center;
		transform: translateX(-50%) rotate(45deg);
		z-index: 1;
	}
</style>
