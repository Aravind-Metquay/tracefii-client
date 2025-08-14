import { createMutation, createQuery } from "@tanstack/svelte-query";
import type { CustomerType, FileWithContent } from "@/Types";
import { customerService } from "../Services/customer-service";

interface QueryCustomer {
  sort: string;
  search: string;
  page: number;
  limit: number;
  [key: string]: { value: string; operator: string } | string | number | boolean;
}
// Create a new customer
export const useCreateNewCustomer = () => {
  return createMutation({
    mutationFn: ({
      customerData,
      token,
    }: {
      customerData: Omit<CustomerType, "_id">;
      token: string;
    }) => customerService.createNewCustomer(customerData, token),
  });
};

// Create an attachment for a customer
export const useCreateCustomerAttachments = () => {
  return createMutation({
    mutationFn: ({
      attachment,
      customerId,
      key,
    }: {
      attachment: FileWithContent;
      customerId: string;
      key: string;
    }) => customerService.createCustomerAttachments(attachment, customerId, key),
  });
};

// Fetch all customers (for current org/user)
export const useGetAllCustomers = (token: string | undefined, queryObject: QueryCustomer) => {
  console.log(queryObject)
  return createQuery({
    queryKey: [queryObject],
    queryFn: async () => customerService.getAllCustomers(token!, queryObject),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch attachments for a customer by key
export const useGetCustomerAttachments = (key: string | undefined, customerId: string | undefined) => {
  return createQuery({
    queryKey: ["customer", key, customerId],
    queryFn: async () => customerService.getCustomerAttachments(key!, customerId!),
    enabled: !!key && !!customerId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch all customers belonging to an organization
export const useGetAllCustomersOfOrg = (orgId: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["org", orgId],
    queryFn: async () => customerService.getAllCustomersOfOrg(orgId!, token!),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch all customers in a workspace within an organization
export const useGetAllCustomersOfAWorkspace = (
  orgId: string | undefined,
  workspaceId: string | undefined,
  token: string | undefined
) => {
  return createQuery({
    queryKey: ["Workspace", workspaceId, orgId],
    queryFn: async () => customerService.getAllCustomersOfAWorkspace(orgId!, workspaceId!, token!),
    enabled: !!orgId && !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch a customer by their ID
export const useFindCustomerById = (id: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["Customer", id],
    queryFn: async () => customerService.findCustomerById(id!, token!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Edit/update a customer
export const useEditCustomer = () => {
  return createMutation({
    mutationFn: ({
      customer,
      token,
    }: {
      customer: CustomerType;
      token: string;
    }) => customerService.editCustomer(customer, token),
  });
};

// Delete a customer by ID
export const useDeleteCustomer = () => {
  return createMutation({
    mutationFn: ({
      id,
      token,
    }: {
      id: string;
      token: string;
    }) => customerService.deleteCustomer(id, token),
  });
};

// Delete an attachment for a customer
export const useDeleteCustomerAttachment = () => {
  return createMutation({
    mutationFn: ({
      key,
      customerId,
    }: {
      key: string;
      customerId: string;
    }) => customerService.deleteCustomerAttachment(key, customerId),
  });
};

// Delete all customers of an organization
export const useDeleteCustomersOfAnOrg = () => {
  return createMutation({
    mutationFn: ({
      orgId,
      token,
    }: {
      orgId: string;
      token: string;
    }) => customerService.deleteCustomersOfAnOrg(orgId, token),
  });
};
