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
		padding: 8px 16px;
		cursor: pointer;
		width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
	}

	button:hover {
		background-color: var(--neutral-300);
	}
</style>
