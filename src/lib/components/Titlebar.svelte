<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window';
</script>

<div on:mousedown={appWindow.startDragging} class="titlebar" />

<style>
	.titlebar {
		height: 30px;
		width: 100%;
		user-select: none;
		position: fixed;
		z-index: 2;
	}
</style>
