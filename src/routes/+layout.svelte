<script>
	import '../styles/app.css';
	import '../styles/colors.css';
	import Titlebar from '$lib/components/Titlebar.svelte';
	import { onMount } from 'svelte';
	import { load } from '$lib/util/persistance';
	import { transcripts } from '$lib/stores/transcripts';

	onMount(() => {
		load();
	});
</script>

<Titlebar />
<slot />
