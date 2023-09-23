<script>
	import '../styles/app.css';
	import '../styles/colors.css';
	import Titlebar from '$lib/components/Titlebar.svelte';
	import { onMount } from 'svelte';
	import { loadFromCache } from '$lib/util/persistance';
	import { ensureRecordingDir, ensureWaveDir } from '$lib/util/fs';

	onMount(async () => {
		// Create any required directories
		await Promise.all([ensureWaveDir(), ensureRecordingDir()]);

		// Load the state
		await loadFromCache();
	});
</script>

<Titlebar />
<slot />
