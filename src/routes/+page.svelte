<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentPane from '$lib/components/ContentPane.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
</script>

<main>
	<Sidebar />
	<ContentPane />
	<ControlPanel />
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 1fr min-content;
		grid-template-columns: 240px 1fr 1fr 1fr;
		grid-template-areas:
			'side main main main'
			'side foot foot foot';
		height: 100%;
	}
</style>
