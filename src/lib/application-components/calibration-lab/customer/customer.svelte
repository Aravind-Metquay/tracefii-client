<script lang="ts">
	import {
	useCreateCustomerAttachments,
		useCreateNewCustomer,
		useDeleteCustomer,
		useDeleteCustomersOfAnOrg,
		useEditCustomer,
		useFindCustomerById,
		useGetAllCustomers,
		useGetAllCustomersOfAWorkspace,
		useGetAllCustomersOfOrg
	} from '@/api/queries/customer-query';
	import { type CustomerType } from '@/Types';
    import type { FileWithContent } from '@/Types';

	let authToken = ' ';
	let orgId = $state('67876a9d0c3956030771411a');
	let customerName = $state('Kevin Roy');
	let customerEmail = $state('kevin@gmail.com');
	let website = $state('');
	let createdAt = $state('sampleee');
	let createdBy = $state('Adithyatest@gmail.com');
	let availableWorkspaces = $state(['testWorkspace']);
	let createdWorkspace = $state('testWorkspace');
	let modifiedAt = $state('');
	let modifiedBy = $state('Don');
	let workspaceId = $state('testWorkspace');
	let id = $state('68a40143bb4603e695545c15');
	const attachment: FileWithContent = $state({
  file: {
    name: "document.txt",
    size: 1280, // bytes
    type: "text/plain",
    lastModified: 1724025600000, // example epoch ms
    key: "attachments/2025/08/document-001.txt"
  },
  content: "This is a sample plain text file content."
});


	const getCustomers = useGetAllCustomers(authToken);

	let customers: any[] = [];

	const handleGetAllCustomers = async () => {
		try {
			const { data } = await $getCustomers.refetch();
			customers = data?.customers || [];
			console.log('All customers', customers);
		} catch (error) {
			console.error('Error Fetching Customers', error);
		}
	};

	const createCustomer = useCreateNewCustomer();
	const handleCreatingCustomer = async () => {
		const newCustomerData: Omit<CustomerType, '_id'> = {
			orgId,
			customerName,
			customerEmail,
			website,
			createdAt,
			createdBy,
			availableWorkspaces,
			createdWorkspace,
			modifiedAt,
			modifiedBy
		};
		try {
			const result = await $createCustomer.mutateAsync({
				customerData: newCustomerData,
				token: authToken
			});
			console.log('created New Customer Successfully', result);
		} catch (error) {
			console.log('Error Creating new Customer', error);
		}
	};

	const getAllCustomersOfOrg = useGetAllCustomersOfOrg(orgId, authToken);
	const handleGetAllCustomersOfAnOrg = async () => {
		try {
			const { data } = await $getAllCustomersOfOrg.refetch();
			customers = data?.customers || [];
			console.log('Customers of An Org', customers);
		} catch (error) {
			console.log('Error Fetching Customers', error);
		}
	};

	const getAllCustomersOfWorkSpace = useGetAllCustomersOfAWorkspace(orgId, workspaceId, authToken);
	const handleGetAllCustomersOfWorkspace = async () => {
		const { data } = await $getAllCustomersOfWorkSpace.refetch();
		customers = data?.customers || [];
		console.log('customers from workspace', customers);
	};

	const findCustomerById = useFindCustomerById(id, authToken);

	const handleFindCustomerById = async () => {
		try {
			const { data } = await $findCustomerById.refetch();

			if (data) {
				console.log('customer', data);
			} else {
				console.log('No customer found');
			}
		} catch (error) {
			console.error('Error fetching customer by ID', error);
		}
	};

	const editCustomer = useEditCustomer();
	const handleEditCustomer = async () => {
		const newCustomerData: CustomerType = {
			_id: id,
			orgId,
			customerName,
			customerEmail,
			website,
			createdAt,
			createdBy,
			availableWorkspaces,
			createdWorkspace,
			modifiedAt,
			modifiedBy
		};
		try {
			const result = await $editCustomer.mutateAsync({
				token: authToken,
				customer: newCustomerData
			});
			console.log('edited customer data', newCustomerData);
			console.log('Customer edited Successfully', result);
		} catch (error) {
			console.log('Error editing Customer', error);
		}
	};

	const deleteCustomer = useDeleteCustomer();
	const handleDeleteCustomer = async () => {
		try {
			let result = await $deleteCustomer.mutateAsync({
				id: id,
				token: authToken
			});
			console.log('Deleted Customer', result);
		} catch (error) {
			console.log('Error Deleting Customer', error);
		}
	};

	const deleteCustomersOfAnOrg = useDeleteCustomersOfAnOrg();
	const handleDeleteCustomersOfAnOrg = async () => {
		try {
			let result = await $deleteCustomersOfAnOrg.mutateAsync({
				orgId: orgId,
				token: authToken
			});
			console.log('Deleted Customers of an Org', result);
		} catch (error) {
			console.log('Error deleting Customers of an Org', error);
		}
	};
    const createCustomerAttachment=useCreateCustomerAttachments();
    const handleCreateCustomerAttachments=async()=>{
       try{
        let result=await $createCustomerAttachment.mutateAsync({
            key:attachment.file.key,
            customerId:id,
            attachment:attachment
        })
        console.log("Created Customer Attachment",result);
       }
       catch(error)
       {
        console.log("Error creating Customer attachment",error);
       } 
    }
</script>

<div class="space-y-6 p-6">
	<div class="flex gap-4">
		<button
			onclick={handleCreatingCustomer}
			class="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
		>
			Create a Customer
		</button>

		<button
			onclick={handleGetAllCustomersOfAnOrg}
			class="rounded-lg bg-green-600 px-4 py-2 text-white shadow transition hover:bg-green-700"
		>
			Get All Customers of Org
		</button>

        <button
			onclick={handleCreateCustomerAttachments}
			class="rounded-lg bg-green-600 px-4 py-2 text-white shadow transition hover:bg-green-700"
		>
			Create Customer attachments
		</button>

		<button
			onclick={handleGetAllCustomersOfWorkspace}
			class="rounded-lg bg-purple-600 px-4 py-2 text-white shadow transition hover:bg-purple-700"
		>
			Get All Customers of Workspace
		</button>

		<button
			onclick={handleFindCustomerById}
			class="rounded-lg bg-purple-600 px-4 py-2 text-white shadow transition hover:bg-purple-700"
		>
			Get Customer by ID
		</button>

		<button
			onclick={handleEditCustomer}
			class="rounded-lg bg-purple-600 px-4 py-2 text-white shadow transition hover:bg-purple-700"
		>
			Edit Customer
		</button>

		<button
			onclick={handleDeleteCustomer}
			class="rounded-lg bg-red-600 px-4 py-2 text-white shadow transition hover:bg-purple-700"
		>
			Delete Customer
		</button>

		<button
			onclick={handleDeleteCustomersOfAnOrg}
			class="rounded-lg bg-red-600 px-4 py-2 text-white shadow transition hover:bg-purple-700"
		>
			Delete Customers of an org
		</button>
	</div>

	{#if customers.length > 0}
		<div class="overflow-x-auto rounded-lg shadow">
			<table class="min-w-full border border-gray-200 bg-white">
				<thead class="bg-gray-100 text-gray-700">
					<tr>
						{#each Object.keys(customers[0]) as key}
							<th class="border-b px-4 py-2 text-left text-sm font-medium">{key}</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each customers as customer}
						<tr class="hover:bg-gray-50">
							{#each Object.values(customer) as value}
								<td class="px-4 py-2 text-sm text-gray-800">{value}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="text-gray-500 italic">No customers found. Click a button to fetch.</p>
	{/if}
</div>
