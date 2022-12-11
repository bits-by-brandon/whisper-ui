<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentPane from '$lib/components/ContentPane.svelte';
	import { onMount } from 'svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';

	onMount(() => {
		document.addEventListener('copy', function (event) {
			const selection = window.getSelection();
			if (selection) {
				const timestampRegex = /\d\d:\d\d:\d\d → \d\d:\d\d:\d\d/g;
				const cleanText = selection.toString().replace(timestampRegex, '').replace(/\n\n/g, '\n');
				event.clipboardData?.setData('text/plain', cleanText);
				event.preventDefault();
			}
		});
	});
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
