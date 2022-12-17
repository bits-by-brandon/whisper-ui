<script lang="ts">
	import { devices } from '$lib/stores/devices';
	import Check from 'svelte-icons/fa/FaCheck.svelte';
	import Button from './Button.svelte';
	import Select from './Select.svelte';

	$: audioDevices = $devices.availableDevices.filter((d) => d.kind === 'audioinput');
</script>

{#if $devices.modalOpen}
	<div class="device-selection-modal">
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
{/if}

<style>
	.device-selection-modal {
		width: 320px;
		padding: 12px;
		background: var(--neutral-400);
		border: 1px solid var(--neutral-500);
		border-radius: 8px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.title {
		margin: 0 0 12px;
	}

	.fieldset {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}
</style>
