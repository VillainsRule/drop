<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.ico";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>drop</title>
</svelte:head>

{@render children()}
