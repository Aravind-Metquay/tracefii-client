<script lang="ts">
	import Input from "@/components/ui/input/input.svelte";
</script>

<div class="flex flex-col items-center justify-center gap-4 h-screen">
    <Input type="text" placeholder="Input without Label" />
    <Input label="Email" type="text" placeholder="Labelled Input" disabled />
    <Input label="Email" type="text" placeholder="Labelled Input with Hint" hint="Please enter your email" />
    <Input label="Email" type="text" placeholder="Destructive Input with Label" hint="Please enter your email" aria-invalid={true} />
    <Input  type="text" placeholder="Destructive Input without Label" hint="Please enter your email" aria-invalid={true} />
</div>
