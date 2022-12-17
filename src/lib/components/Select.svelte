<script lang="ts">
	export let value: any;
</script>

<div class="select">
	<select bind:value>
		<slot />
	</select>
</div>

<style>
	select {
		display: inline-block;
		background-color: var(--neutral-400);
		border: 1px solid var(--neutral-500);
		color: var(--neutral-900);
		flex-grow: 1;
		font-size: 14px;
		height: 100%;
		padding: 6px 24px 6px 8px;
		appearance: none;
	}

	.select {
		position: relative;
	}

	.select::after {
		--arrow-color: var(--neutral-900);
		content: '';
		position: absolute;
		top: 10px;
		right: 10px;
		width: 6px;
		height: 6px;
		border-bottom: 1px solid var(--arrow-color);
		border-right: 1px solid var(--arrow-color);
		transform: rotate(45deg);
		z-index: 1;
	}
</style>
