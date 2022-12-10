<script lang="ts">
	export let disabled: boolean = false;
</script>

<button on:click {disabled}>
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
		background: var(--neutral-400);
		color: var(--neutral-900);
		font-size: 14px;
		border-radius: 5px;
		padding: 6px 8px;
		cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: left;
    gap: 6px;
	}

	button:hover {
		background-color: var(--neutral-300);
	}

	.icon {
		height: 12px;
		width: 12px;
		transform: translateY(1px);
	}
</style>
