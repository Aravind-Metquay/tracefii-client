<script>
	import { Button, SplitButton } from '@/components';
</script>

<div class="flex h-full w-full items-center justify-center">
	<SplitButton.Root>
		<SplitButton.Button type="primary" size="small">Click here</SplitButton.Button>
        <SplitButton.Content>
            <Button size="tiny" variant="primary">Save</Button>
            <Button size="tiny" variant="warning">Edit</Button>
        </SplitButton.Content>
	</SplitButton.Root>
</div>
