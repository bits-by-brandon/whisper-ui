<script lang="ts">
	import { devices } from '$lib/stores/devices';
	import Check from 'svelte-icons/fa/FaCheck.svelte';
	import { fade, fly } from 'svelte/transition';
	import Button from './Button.svelte';
	import Select from './Select.svelte';

	$: audioDevices = $devices.availableDevices.filter((d) => d.kind === 'audioinput');
</script>

{#if $devices.modalOpen}
	<div class="device-selection-modal" transition:fly={{ duration: 200 }}>
		<h3 class="title">Select a recording device</h3>

		<div class="fieldset">
			<Select bind:value={$devices.selectedDevice}>
				{#each audioDevices as device}
					<option value={device}>
						{device.label}
					</option>
				{/each}
			</Select>

			<Button on:click={() => ($devices.modalOpen = false)}>
				<Check slot="icon" />
				Done
			</Button>
		</div>
	</div>
	<div class="backdrop" transition:fade />
{/if}

<style>
	.device-selection-modal {
		padding: 12px;
		background: var(--neutral-400);
		border: 1px solid var(--neutral-500);
		border-radius: 8px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.title {
		margin: 0 0 12px;
	}

	.fieldset {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.backdrop {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0.95;
		background-color: var(--neutral-200);
	}
</style>
