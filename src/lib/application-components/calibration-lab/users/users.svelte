<script lang="ts">
	import { getAllOrganizations } from "@/api/queries/organization-query";
	import { useCreateNewUser, useDeleteUser, useDeleteUsersOfOrg, useEditUser, useGetAllUsers, useGetAllUsersOfAnOrg, useGetUser, useUserWithOrg } from "@/api/queries/user-query";
	import type { UserType } from "@/Types";

    const createAUser = useCreateNewUser()
    const editUser = useEditUser()
    const deleteUser = useDeleteUser()
    const deleteUserOfOrg = useDeleteUsersOfOrg()
    const userWithOrg = useUserWithOrg("sudhi@test.com","")
        let filter = $state("");
    const allorgs = getAllOrganizations("", "All", "");

    const allUsersofOrg = $derived.by(()=>{
        return useGetAllUsersOfAnOrg("689c61c2a22cc7dca9d65af5","",filter)
    })
    const user = $derived.by(()=>{
        return useGetUser("","")
    })
    const allUsers = $derived.by(()=>{
        return useGetAllUsers("",filter)
    })

    const refetch = $allUsers.refetch;
    const orgUsersRefetch = $allUsersofOrg.refetch;

    const createUser = async (orgId:string) => {
    const user : Omit<UserType,"_id"> = {
            orgId,
            firstName : "Sudhi1" ,
            emailId : "sudhi@test.com" ,
            system_role : "Service Provider" ,
            createdAt : new Date(),
            createdBy : "NEON" ,
            modifiedBy : "Sudhi" ,
            }
            try {
                  const response = await $createAUser.mutateAsync({userData : user,token :""})
                  console.log("UIRESPONSE",response)

            } catch (error) {
                
            }
        }

    const handleEditUser = async (user:UserType) => {
    const updatedUser : UserType = {
        ...user,
		firstName: "Sudhi",
		emailId: "Sudhi@test.com",
		system_role: "Service Provider",
		createdBy: "sudhi1",
		modifiedBy: "Sudhi",
		_id: user._id,
		orgId: user.orgId
	}
            try {
                  const response = await $editUser.mutateAsync({user : updatedUser,token :""})
                  console.log(response,"UPADTED")
                  refetch()
            } catch (error) {
                console.log(error)
            }
        }

    const handleDeleteUsersOfOrg = async (orgId :string) => {
            
        try {
          const res =  await $deleteUserOfOrg.mutateAsync({orgId,token:""})
          console.log(res , "DELETED ORG RESPONSE")
        } catch (error) {
            
        }
        }
  
    const handleDeleteUser = async (userId :string) => {
            
        try {
          const res =  await $deleteUser.mutateAsync({id:userId,token:""})
        //   console.log(res , "DELETED RESPONSE")
        } catch (error) {
            
        }
        }
        // console.log($user)
</script>

<div>
    Orgs
    {#if $allorgs?.data?.organizations}
	{#each $allorgs.data.organizations as item}
		<div>
			<button onclick={() => createUser(item._id)}>{item._id} create</button>
			<button onclick={() => handleDeleteUsersOfOrg(item._id)}>{item._id} Delete Users</button>
		</div>
	{/each}
{/if}
<p>USERS</p>
  {#if $allUsers?.data?.users}
	{#each $allUsers.data.users as item:UserType}
		<div>
			<button onclick={() => handleEditUser(item)}>{item.emailId} edit</button>
			<button onclick={() => handleDeleteUser(item._id)}>{item._id} delete</button>
		</div>
	{/each}
{/if}
<p>Org Users</p>
  {#if $allUsersofOrg?.data?.users}
	{#each $allUsersofOrg.data.users as item:UserType}
		<div>
			<button onclick={() => handleEditUser(item)}>{item.emailId} edit</button>
			<button onclick={() => handleDeleteUser(item._id)}>{item._id} delete</button>
		</div>
	{/each}
{/if}
<h1>{$user.data?.firstName || "EMPTY USER"}</h1>
<h1>{$userWithOrg.data?.organization.organizationName || "EMPTY ORG"}</h1>

<input type="text" bind:value={filter} />

</div>