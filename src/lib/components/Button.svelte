<script lang="ts">
	export let disabled: boolean = false;
	export let domRect: DOMRect | undefined = undefined;
	let el: HTMLButtonElement;
	$: domRect = el?.getBoundingClientRect();
</script>

<button on:click {disabled} bind:this={el}>
	{#if $$slots.icon}
		<span class="icon">
			<slot name="icon" />
		</span>
	{/if}
	<slot />
</button>

<style>
	button {
		appearance: none;
		border: 1px solid var(--neutral-500);
		margin: 0;
		background: var(--neutral-400);
		color: var(--neutral-900);
		font-size: 14px;
		border-radius: 5px;
		padding: 5px 8px;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: flex-start;
		min-height: 30px;
		min-width: 32px;
		white-space: nowrap;
		gap: 6px;
	}

	button:hover {
		background-color: var(--neutral-500);
	}

	.icon {
		height: 12px;
		width: 12px;
		transform: translateY(1px);
	}
</style>
