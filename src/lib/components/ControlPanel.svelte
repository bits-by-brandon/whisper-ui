<script lang="ts">
	import { active } from '$lib/stores/transcripts';
	import Text from 'svelte-icons/fa/FaAlignLeft.svelte';
	import VTT from 'svelte-icons/fa/FaClosedCaptioning.svelte';
	import Button from './Button.svelte';
</script>

<div class="control-panel">
	{#if $active && $active.status === 'transcribed'}
		<audio src={$active.file.blobUrl || ''} controls />
		<Button>
			<Text slot="icon" />
			Download plain text
		</Button>
		<Button>
			<VTT slot="icon" />
			Download ftt
		</Button>
	{/if}
</div>

<style>
	.control-panel {
		grid-area: foot;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
		padding: 12px;
		background-color: var(--neutral-200);
		border-top: 1px solid var(--neutral-400);
		backdrop-filter: blur(7px);
		-webkit-backdrop-filter: blur(7px);
	}

	audio {
		margin-right: auto;
		max-width: 600px;
		flex-grow: 1;
	}

	h2 {
		font-size: 18px;
		margin: 0;
	}
</style>
