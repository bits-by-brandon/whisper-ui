<script lang="ts">
        // @ts-ignore
        import Cogs from 'svelte-icons/fa/FaCogs.svelte';
        import Button from './Button.svelte';
        import Flyout from './Flyout.svelte';
        import ModelManagerFlyout from './ModelManagerFlyout.svelte';

        let modalOpen = false;
        let buttonDomRect: DOMRect;

        function toggleFlyout() {
                modalOpen = !modalOpen;
        }
</script>

<Button on:click={toggleFlyout} bind:domRect={buttonDomRect}>
        <Cogs slot="icon" />
        Models
</Button>

<Flyout open={modalOpen} targetRect={buttonDomRect}>
        <ModelManagerFlyout />
</Flyout>
