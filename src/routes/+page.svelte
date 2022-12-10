<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentPane from '$lib/components/ContentPane.svelte';
	import { onMount } from 'svelte';

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
</main>

<style>
	main {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: 240px 1fr 1fr 1fr;
		grid-template-areas: 'side main main main';
		height: 100%;
	}
</style>
