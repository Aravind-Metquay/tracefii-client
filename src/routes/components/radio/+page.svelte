<script lang="ts">
	import Radio from "@/components/ui/radio/radio.svelte";

	const myItems = [
		{ value: "one"},
		{ value: "two"},
		{ value: "three", disabled: true },
	];
</script>

<div class="flex items-center justify-center h-screen">
	<Radio items={myItems} name="favoriteFruit" />
</div>
