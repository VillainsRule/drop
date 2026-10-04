<script lang="ts">
    import { onMount } from "svelte";

    import { Button } from "$lib/components/ui/button";
    import { Toaster } from "$lib/components/ui/sonner";
    import { Textarea } from "$lib/components/ui/textarea";

    import { toast } from "svelte-sonner";

    const { data } = $props();

    onMount(() => {
        if (data.loggedIn) {
            window.ondragover = (e) => e.preventDefault();
            window.ondrop = async (e) => {
                e.preventDefault();
                if (e.dataTransfer?.files) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith("text/") || file.type === "application/json" || file.type === "") {
                        const readText = await file.text();
                        if (typeof readText === "string") inputText = readText;
                        else toast.error("failed to read file content");
                    } else toast.error("only text files can be uploaded :<");
                }
            };
        } else {
            window.ondragover = null;
            window.ondrop = null;
        }
    });

    let inputText = $state<string>("");
    let successURL = $state<string>("");
    let errorText = $state<string>("");
    let apiKey = $state<string>("");

    const curlCommand = $derived(`curl -X POST ${typeof location === "undefined" ? "" : location.origin} \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  --data-binary @file.txt`);
</script>

<Toaster />

{#if data.loggedIn}
    <div class="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16">
        <div class="w-full max-w-xl flex flex-col gap-3">
            <div class="mb-2">
                <h1 class="text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm">drop</h1>
                <p class="text-sm text-muted-foreground mt-1">drag a file or type below to upload</p>
            </div>

            <Textarea bind:value={inputText} placeholder="throw sum text here" class="min-h-32 resize-y" />

            <Button
                variant="outline"
                onclick={() => {
                    fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: inputText
                    })
                        .then(async (res) => {
                            if (res.ok) {
                                const { path } = await res.json();
                                successURL = path;
                                errorText = "";
                            } else {
                                const errorData = await res.json();
                                errorText = `upload failed: ${errorData.message}`;
                                successURL = "";
                            }
                        })
                        .catch((err) => {
                            errorText = `upload failed: ${err.message}`;
                            successURL = "";
                        });
                }}>upload</Button
            >

            {#if successURL}
                <span class="text-sm text-green-700">uploaded! view at <a href={`${location.origin}/${successURL}`} class="underline">{location.origin}/{successURL}</a></span>
            {:else if errorText}
                <span class="text-sm text-red-500">{errorText}</span>
            {/if}

            <div class="pt-6 border-t mt-2">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-muted-foreground">api access</span>
                    <Button
                        size="sm"
                        variant="ghost"
                        onclick={() => {
                            fetch("/api/key", { method: "POST" })
                                .then(async (res) => {
                                    if (res.ok) apiKey = (await res.json()).key;
                                    else toast.error("failed to generate api key");
                                })
                                .catch((err) => toast.error(`failed to generate api key: ${err.message}`));
                        }}>generate key</Button
                    >
                </div>

                {#if apiKey}
                    <div class="rounded-md bg-muted/50 border p-3 flex flex-col gap-3 text-xs">
                        <div class="flex flex-col gap-1">
                            <span class="text-muted-foreground">key (store it somewhere safe)</span>
                            <code class="select-all break-all font-mono">{apiKey}</code>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="text-muted-foreground">usage</span>
                            <pre class="select-all whitespace-pre-wrap break-all font-mono">{curlCommand}</pre>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-muted-foreground">parameters</span>
                            <ul class="list-inside ml-1 list-['-_']">
                                <li>path: a custom path (i.e. "custom")</li>
                                <li>override: whether to override existing files with that name</li>
                            </ul>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{:else}
    <div class="min-h-screen w-full flex flex-col items-center justify-center gap-3">
        <h1 class="text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm">drop</h1>
        <Button size="sm" onclick={() => (location.href = "/oauth/redirect")}>
            login with
            <img src="https://voauth.villainsrule.xyz/favicon.ico" class="w-6" alt="voauth" />
        </Button>
    </div>
{/if}
