<script lang='ts'>
	import Button from "@/components/ui/button/button.svelte";


</script>
<div class="flex flex-col justify-center items-center h-screen gap-y-12">

  
  <div class="flex gap-x-4">
    <Button variant="primary" size="sm">Button CTA</Button>
    <Button variant="primary" size="default">Button CTA</Button>
    <Button variant="primary" size="lg">Button CTA</Button>
    <Button variant="primary" size="xl">Button CTA</Button>
    <Button variant="primary" size="default" disabled>Button CTA</Button>
  </div>

  
  <div class="flex gap-x-4">
    <Button variant="destructive" size="sm">Button CTA</Button>
    <Button variant="destructive" size="default">Button CTA</Button>
    <Button variant="destructive" size="lg">Button CTA</Button>
    <Button variant="destructive" size="xl">Button CTA</Button>
    <Button variant="destructive" size="default"disabled>Button CTA</Button>
  </div>

  <div class="flex gap-x-4">
	<Button variant="secondary" size="sm">Button CTA</Button>
	<Button variant="secondary" size="default">Button CTA</Button>
	<Button variant="secondary" size="lg">Button CTA</Button>
	<Button variant="secondary" size="xl">Button CTA</Button>
	<Button variant="secondary" size="default" disabled>Button CTA</Button>
  </div>

</div>

	