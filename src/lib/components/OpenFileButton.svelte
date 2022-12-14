<script lang="ts">
	import { transcripts } from '$lib/stores/transcripts';
	import { openMediaFile } from '$lib/util/fs';
	import Plus from 'svelte-icons/fa/FaPlus.svelte';
	import Button from './Button.svelte';

	async function handleOpenFile() {
		const mediaFile = await openMediaFile();
		await transcripts.createFromFile(mediaFile);
		transcripts.setActive(mediaFile);
	}
</script>

<Button on:click={handleOpenFile}>
	<Plus slot="icon" />
	Open file
</Button>
