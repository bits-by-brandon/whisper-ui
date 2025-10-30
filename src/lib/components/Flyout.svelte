<script lang="ts">
	import { fly } from 'svelte/transition';

	export let targetRect: DOMRect;
	export let open = false;
        let y = 0;
        const offset = 12;
        const viewportPadding = 12;
        let flyoutEl: HTMLDivElement | null = null;
        let style = '';

        function getViewportWidth(): number {
                if (typeof window === 'undefined') return 0;
                return window.innerWidth || 0;
        }

        $: if (open && targetRect) {
                y = targetRect.y + targetRect.height + offset;

                const centerX = targetRect.x + targetRect.width / 2;
                const width = flyoutEl?.offsetWidth ?? 0;
                if (!width) {
                        // Fallback: anchor the flyout near the trigger until we can measure.
                        style = `top: ${y}px; left: ${Math.max(
                                targetRect.x - viewportPadding,
                                viewportPadding
                        )}px;`;
                } else {
                        const viewportWidth = getViewportWidth();
                        const minLeft = viewportPadding;
                        const maxLeft = Math.max(minLeft, viewportWidth - viewportPadding - width);
                        const centeredLeft = centerX - width / 2;
                        const left = Math.min(Math.max(centeredLeft, minLeft), maxLeft);

                        // Ensure the caret lines up with the trigger without exceeding the edges.
                        const caretMin = viewportPadding;
                        const caretMax = width - viewportPadding;
                        const caretLeft = Math.min(
                                Math.max(centerX - left, caretMin),
                                caretMax
                        );

                        style = `top: ${y}px; left: ${left}px; --arrow-left: ${caretLeft}px;`;
                }
        }
</script>

{#if open}
        <div
                class="flyout"
                bind:this={flyoutEl}
                {style}
                transition:fly={{ duration: 200, y: -5 }}
        >
                <slot />
        </div>
{/if}

<style>
	.flyout {
		--background-color: var(--neutral-400);
		--border-color: var(--neutral-500);

		position: fixed;
		background: var(--background-color);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 12px;
                z-index: 1;
        }
        .flyout::after {
                --size: 12px;
                content: '';
                display: block;
                position: absolute;
                bottom: calc(100% - (var(--size) / 2));
                left: var(--arrow-left, 50%);
                width: var(--size);
                height: var(--size);
                background: var(--background-color);
                border-top: 1px solid var(--border-color);
                border-left: 1px solid var(--border-color);
		transform-origin: center;
		transform: translateX(-50%) rotate(45deg);
		z-index: 1;
	}
</style>
