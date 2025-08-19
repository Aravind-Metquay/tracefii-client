<script lang="ts">
	import { getAllOrganizations } from "@/api/queries/organization-query";
	import { useCreateNewUser, useDeleteUser, useDeleteUsersOfOrg, useEditUser, useGetAllUsers, useGetAllUsersOfAnOrg, useGetUser, useUserWithOrg } from "@/api/queries/user-query";
	import type { UserType } from "@/Types";


    const createAUser = useCreateNewUser()
    const deleteUser = useDeleteUser()
    const deleteUserOfOrg = useDeleteUsersOfOrg()
    const userWithOrg = useUserWithOrg("sudhi@test.com","")
   const filter = {};
   const searchQuery=""
    const allorgs = getAllOrganizations("", "All", "");
    const authToken=""
    const emailId="superman@dc.com"
    const id="68a45196a3fd7162e5d89ea7"

const userSample: UserType = {
  attachments: [],
  _id: "68a41983a86a3ab70da06653",
  orgId: "507f1f77bcf86cd799439011",
  firstName: "Sudhi1",
  emailId: "sudhi@test.com",
  system_role: "Service Provider",
  createdAt: new Date("2025-08-19T06:28:19.272Z"),
  createdBy:"Adithya"
};

    

    let orgId=$state("68a461e8d46298c3bd193fb4")

    const createUser = async (orgId:string) => {
    const user : Omit<UserType,"_id"> = {
            orgId,
            firstName : "sampleeee" ,
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
               console.log("Error Creating User",error); 
            }
        }

   

    const handleDeleteUsersOfOrg = async (orgId :string) => {
            
        try {
          const res =  await $deleteUserOfOrg.mutateAsync({orgId,token:""})
          console.log(res , "DELETED ORG RESPONSE")
        } catch (error) {
            console.log("Error Deleting Users of an org")
        }
        }
  
    const handleDeleteUser = async (userId :string) => {
            
        try {
          const res =  await $deleteUser.mutateAsync({id:userId,token:""})
        console.log(res);
        } catch (error) {
            console.log("Error deleting user by id")
        }
        }
    const getAllUsers=useGetAllUsers(authToken,filter,searchQuery)
    const handleGetAllUsers=async()=>{
        try{
            const result=await $getAllUsers.refetch();
            if(result){
                console.log("Got all Users",result.data);
            }

        }
        catch(error)
        {
            console.log("Error getting all Users",error);
        }
    }
    const getUserWithOrg=useUserWithOrg(emailId,authToken);
    const handleGetUserWithOrg=async()=>{
        try{
          let result=await $getUserWithOrg.refetch();
        if(result)
    {
        console.log("Got user with Org",result);
    }
        }
        catch(error)
        {
            console.log("Error getting user with org",error);
        }
       
    }

    const getAllUsersOfAnOrg=useGetAllUsersOfAnOrg(orgId,authToken,filter,searchQuery);
    const handleGetAllUsersOfAnOrg=async()=>{
        try{
            let result=await $getAllUsersOfAnOrg.refetch();
            if(result){
                console.log("Got all users in a Org",result);
            }
        }
        catch(error){
            console.log("Error fetching Users of an Org",error);
        }
    }
    
    const getUserById=useGetUser(id,authToken);
    const handleGetUserById=async()=>{
       try{
            let result=await $getUserById.refetch();
            if(result){
                console.log("Got User by id",result);
            }
        }
        catch(error){
            console.log("Error fetching Users By id",error);
        }
    }

    const editUser=useEditUser();
    const handleEditUser=async()=>{
        try{
        let result=$editUser.mutateAsync({
            user:userSample,
            token:authToken
        })
        
            console.log("error Editing user",result);
        
    }
    catch(error){
        console.log("error editing user",error);
    }
    }


</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
  <div class="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">👤 User Management</h1>

    <!-- Action buttons grouped -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button 
        class="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        onclick={() => createUser(orgId)}
      >
        ➕ Create User
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        onclick={handleGetAllUsers}
      >
        📋 Get All Users
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition"
        onclick={handleGetUserWithOrg}
      >
        🏢 Get User in org with emailId
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition"
        onclick={handleGetAllUsersOfAnOrg}
      >
        🧑‍🤝‍🧑 Get Users in Org
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
        onclick={handleGetUserById}
      >
        🔍 Get User by ID
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
        onclick={handleEditUser}
      >
        ✏️ Edit User
      </button>

      <button 
        class="px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
        onclick={()=>handleDeleteUser(id)}
      >
        Delete User
      </button>
     
            <button 
        class="px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
        onclick={()=>handleDeleteUsersOfOrg(orgId)}
      >
        Delete Users of an org
      </button>
    </div>
  </div>
</div>  