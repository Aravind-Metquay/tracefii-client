import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { CustomerService } from '../Services/customer-service';
import type { ApiResponse, CustomerType } from '@/Types';
import type { MockedFunction } from 'vitest';
import { PUBLIC_BACKEND_API_URL, PUBLIC_CLOUD_FLARE_URL } from '$env/static/public';

//Mock axios
vi.mock('axios', () => ({
	default: {
		get: vi.fn(),
		put: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn()
	}
}));

const mockedAxios = {
	get: axios.get as MockedFunction<typeof axios.get>,
	put: axios.put as MockedFunction<typeof axios.put>,
	post: axios.post as MockedFunction<typeof axios.post>,
	patch: axios.patch as MockedFunction<typeof axios.patch>,
	delete: axios.delete as MockedFunction<typeof axios.delete>
};

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_BACKEND_API_URL: 'http://localhost:3000/api',
		PUBLIC_CLOUD_FLARE_URL: 'https://tracefii-upload.aravind-dfc.workers.dev'
	}
}));

describe('CustomerService', () => {
	let customerService: CustomerService;
	const mockToken = 'test-token-123';
	const baseUrl = 'http://localhost:3000/api/customer';
	const cloudflareurl = 'https://tracefii-upload.aravind-dfc.workers.dev';

	beforeEach(() => {
		customerService = new CustomerService();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const createMockCustomer = (id: string = 'customer-123'): CustomerType => ({
		_id: id,
		orgId: 'org-123',
		customerName: 'customer-123',
		customerEmail: 'contact@customer-123.com',
		displayName: 'test customer-123',
		contactPersonNumber: '1800-000-0081',
		additionalDetails: 'test additional requirement',
		customerSpecificRequirement: 'test customer specific requirement',
		primaryAddress: 'test primary customer address',
		parentCompany: 'test parent company',
		childCompanies: 'test child company',
		contactPersonName: 'test contactpersonname',
		customerCurrency: 'USD',
		website: 'https://www.example.com',
		attachments: [
			{
				name: 'testpdf.pdf',
				size: 256000,
				type: 'application/pdf',
				lastModified: 1672531200,
				key: 'attachments/customer-123/testpdf.pdf'
			}
		],
		addresses: [
			{
				streetAddress: 'teststreetaddress',
				city: 'testcity',
				state: 'teststate',
				zipCode: 'testzipcode',
				country: 'teststring',
				addressType: 'BILLING'
			}
		],
		createdAt: '2023-10-26T10:00:00Z',
		createdBy: 'admin',
		modifiedAt: '2024-07-25T11:30:00Z',
		modifiedBy: 'admin',
		availableWorkspaces: ['ws1', 'ws2'],
		createdWorkspace: 'ws1'
	});

	describe('createNewCustomer', () => {
		it('should create new customer successfully', async () => {
			const mockCustomerData = {
				orgId: 'org-123',
				customerName: 'customer-123',
				customerEmail: 'contact@customer-123.com',
				website: 'https://www.example.com',
				createdAt: '2023-10-26T10:00:00Z',
				createdBy: 'admin',
				availableWorkspaces: ['ws1', 'ws2'],
				createdWorkspace: 'ws1'
			};
			const apiResponseId = 'new-customer-id-123';
			const mockResponse = {
				insertedId: apiResponseId,
				message: 'Customer created successfully',
				status: 201
			};
			mockedAxios.post.mockResolvedValue({ data: mockResponse });

			const result = await customerService.createNewCustomer(mockCustomerData, mockToken);

			expect(mockedAxios.post).toHaveBeenCalledWith(baseUrl, mockCustomerData, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(apiResponseId);
		});

		it('should handle creation errors', async () => {
			const mockCustomerData = createMockCustomer();

			const errorMessage = 'Failed to create customer';

			mockedAxios.post.mockRejectedValue(new Error(errorMessage));

			await expect(customerService.createNewCustomer(mockCustomerData, mockToken)).rejects.toThrow(
				errorMessage
			);

			expect(mockedAxios.post).toHaveBeenCalledWith(baseUrl, mockCustomerData, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('createCustomerAttachments', () => {
		//tests fails because in the service file we are using import.meta.env.VITE_CLOUD_FLARE_URL
		//instead of env.PUBLIC_CLOUD_FLARE_URL
		it('should create new customer attachmments successfully', async () => {
			const mockCustomerAttachmentsData = {
				file: {
					name: 'Service-Agreement.pdf',
					size: 157286,
					type: 'application/pdf',
					lastModified: new Date('2025-07-25T10:00:00Z').getTime(),
					key: 'customer-attachments/Service-Agreement.pdf'
				},
				content: 'This is a string representing the mock file content.'
			};

			const mockId = 'customer-123';
			const mockKey = 'customer-123key';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockId}`;

			const mockResponse = {
				data: {},
				status: 200
			};

			mockedAxios.put.mockResolvedValue(mockResponse);
			await customerService.createCustomerAttachments(mockCustomerAttachmentsData, mockId, mockKey);
			expect(mockedAxios.put).toHaveBeenCalledWith(expectedURL, mockCustomerAttachmentsData
			);
		});
		it('should handle creation errors', async () => {
			const mockCustomerAttachmentsData = {
				file: {
					name: 'Service-Agreement.pdf',
					size: 157286,
					type: 'application/pdf',
					lastModified: new Date('2025-07-25T10:00:00Z').getTime(),
					key: 'customer-attachments/Service-Agreement.pdf'
				},
				content: 'This is a string representing the mock file content.'
			};

			const mockId = 'customer-123';
			const mockKey = 'customer-123key';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockId}`;
			const errorMessage = 'Failed to create customer attachment';

			mockedAxios.put.mockRejectedValue(new Error(errorMessage));
			await expect(
				customerService.createCustomerAttachments(mockCustomerAttachmentsData, mockId, mockKey)
			).rejects.toThrow(errorMessage);
			expect(mockedAxios.put).toHaveBeenCalledWith(expectedURL, mockCustomerAttachmentsData);
		});
	});

	describe('getAllCustomers', () => {
		it('should fetch all customers successfully', async () => {
			const mockCustomers = [createMockCustomer('1'), createMockCustomer('2')];
			const mockResponse = {
				data: {
					data: {
						customers: mockCustomers,
						count: 2
					}
				}
			};
			mockedAxios.get.mockResolvedValue(mockResponse);
			const result = await customerService.getAllCustomers(mockToken);
			expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual({
				customers: mockCustomers,
				count: 2
			});
		});

		it('should handle fetch errors', async () => {
			const errorMessage = 'Network error';
			mockedAxios.get.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.getAllCustomers(mockToken)).rejects.toThrow(errorMessage);
			expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('getCustomerAttachments', () => {
		//test fails because in the service file we are using import.meta.env.VITE_CLOUD_FLARE_URL
		//instead of env.PUBLIC_CLOUD_FLARE_URL
		it('should fetch customer attachments successfully', async () => {
			const mockId = 'customer-123';
			const mockKey = 'customer-123key';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockId}`;
			const mockResponse = {
				data: {
					file: {
						name: 'Service-Agreement.pdf',
						size: 157286,
						type: 'application/pdf',
						lastModified: new Date('2025-07-25T10:00:00Z').getTime(),
						key: 'customer-attachments/Service-Agreement.pdf'
					},
					content: 'This is a string representing the mock file content.'
				}
			};
			mockedAxios.get.mockResolvedValue(mockResponse);
			const result = await customerService.getCustomerAttachments(mockKey, mockId);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL);
			expect(result).toEqual(mockResponse.data);
		});

		it('should handle fetch errors', async () => {
			const mockId = 'customer-123';
			const mockKey = 'customer-123key';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockId}`;
			const errorMessage = 'Network error';
			mockedAxios.get.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.getCustomerAttachments(mockKey, mockId)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL);
		});
	});

	describe('getAllCustomersOfOrg', () => {
		it('should fetch all customers of an organization successfully', async () => {
			const mockOrgId = 'org-123';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
			const mockResponse = {
				data: {
					data: {
						customers: [createMockCustomer('1'), createMockCustomer('2')],
						count: 2
					},
					message: 'Customers fetched successfully',
					status: 200
				}
			};
			mockedAxios.get.mockResolvedValue(mockResponse);
			const result = await customerService.getAllCustomersOfOrg(mockOrgId, mockToken);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data.data);
		});

		it('should handle fetch errors', async () => {
			const mockOrgId = 'org-123';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
			const errorMessage = 'Network error';
			mockedAxios.get.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.getAllCustomersOfOrg(mockOrgId, mockToken)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('getAllCustomersOfAWorkspace', () => {
		it('should fetch all customers of a workspace successfully', async () => {
			const mockOrgId = 'org-123';
			const mockWorkspaceId = 'ws1';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}/workspace/${mockWorkspaceId}`;
			const mockResponse = {
				data: {
					data: {
						customers: [createMockCustomer('1'), createMockCustomer('2')],
						count: 2
					},
					message: 'Customers fetched successfully',
					status: 200
				}
			};
			mockedAxios.get.mockResolvedValue(mockResponse);
			const result = await customerService.getAllCustomersOfAWorkspace(
				mockOrgId,
				mockWorkspaceId,
				mockToken
			);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data.data);
		});

		it('should handle fetch errors', async () => {
			const mockOrgId = 'org-123';
			const mockWorkspaceId = 'ws1';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}/workspace/${mockWorkspaceId}`;
			const errorMessage = 'Network error';
			mockedAxios.get.mockRejectedValue(new Error(errorMessage));
			await expect(
				customerService.getAllCustomersOfAWorkspace(mockOrgId, mockWorkspaceId, mockToken)
			).rejects.toThrow(errorMessage);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('findCustomerById', () => {
		it('should fetch customer by id successfully', async () => {
			const mockId = 'customer-123';
			const expectedURL = `${baseUrl}/${mockId}`;
			const mockResponse = {
				data: {
					data: [createMockCustomer('1'), createMockCustomer('2')],
					count: 2
				},
				message: 'Customer fetched successfully',
				status: 200
			};
			mockedAxios.get.mockResolvedValue(mockResponse);
			const result = await customerService.findCustomerById(mockId, mockToken);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data.data);
		});

		it('should handle fetch errors', async () => {
			const mockId = 'customer-123';
			const expectedURL = `${baseUrl}/${mockId}`;
			const errorMessage = 'Network error';
			mockedAxios.get.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.findCustomerById(mockId, mockToken)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('editCustomer', () => {
		it('should edit customer successfully', async () => {
			const mockCustomer = createMockCustomer('1');
			const expectedURL = `${baseUrl}/${mockCustomer._id}`;
			const mockResponse = {
				data: mockCustomer,
				message: 'Customer edited successfully',
				status: 200
			};
			mockedAxios.patch.mockResolvedValue(mockResponse);
			const result = await customerService.editCustomer(mockCustomer, mockToken);
			expect(mockedAxios.patch).toHaveBeenCalledWith(expectedURL, mockCustomer, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data);
		});

		it('should handle edit errors', async () => {
			const mockCustomer = createMockCustomer('1');
			const expectedURL = `${baseUrl}/${mockCustomer._id}`;
			const errorMessage = 'Network error';
			mockedAxios.patch.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.editCustomer(mockCustomer, mockToken)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.patch).toHaveBeenCalledWith(expectedURL, mockCustomer, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	});

	describe('deleteCustomer', () => {
		it('should delete customer successfully', async () => {
			const mockId = 'customer-123';
			const expectedURL = `${baseUrl}/${mockId}`;
			const mockResponse = {
				data: {},
				message: 'Customer deleted successfully',
				status: 200
			};
			mockedAxios.delete.mockResolvedValue(mockResponse);
			const result = await customerService.deleteCustomer(mockId, mockToken);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data);
		});

		it('should handle delete errors', async () => {
			const mockId = 'customer-123';
			const expectedURL = `${baseUrl}/${mockId}`;
			const errorMessage = 'Network error';
			mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.deleteCustomer(mockId, mockToken)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	})

	describe('deleteCustomerAttachment', () => {
		//tests fails because in the service file we are using import.meta.env.VITE_CLOUD_FLARE_URL
		//instead of env.PUBLIC_CLOUD_FLARE_URL
		it('should delete customer attachment successfully', async () => {
			const mockKey = 'customer-123';
			const mockCustomerId = 'customer-123';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockCustomerId}`;
			
			await customerService.deleteCustomerAttachment(mockKey, mockCustomerId);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL);
		});

		it('should handle delete errors', async () => {
			const mockKey = 'customer-123';
			const mockCustomerId = 'customer-123';
			const expectedURL = `${cloudflareurl}/${mockKey}-${mockCustomerId}`;
			const errorMessage = 'Network error';
			mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.deleteCustomerAttachment(mockKey, mockCustomerId)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL);
		});
	})

	describe('deleteCustomersOfAnOrg', () => {
		it('should delete  customers of an organization successfully', async () => {
			const mockOrgId = 'org-123';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
			const mockResponse = {
				data: {},
				message: 'Customers deleted successfully',
				status: 200
			};
			mockedAxios.delete.mockResolvedValue(mockResponse);
			const result = await customerService.deleteCustomersOfAnOrg(mockOrgId, mockToken);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
			expect(result).toEqual(mockResponse.data);
		});

		it('should handle delete errors', async () => {
			const mockOrgId = 'org-123';
			const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
			const errorMessage = 'Network error';
			mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
			await expect(customerService.deleteCustomersOfAnOrg(mockOrgId, mockToken)).rejects.toThrow(
				errorMessage
			);
			expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
				headers: {
					Authorization: `Bearer ${mockToken}`
				}
			});
		});
	})
});
