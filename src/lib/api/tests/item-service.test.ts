import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { ItemService } from "../Services/item-service";
import type { ApiResponse, ItemType } from "@/Types";
import type { MockedFunction } from "vitest";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedAxios = {
  get: axios.get as MockedFunction<typeof axios.get>,
  post: axios.post as MockedFunction<typeof axios.post>,
  patch: axios.patch as MockedFunction<typeof axios.patch>,
  delete: axios.delete as MockedFunction<typeof axios.delete>,
};

// Mock environment variables
vi.mock("$env/dynamic/public", () => ({
  env: {
    PUBLIC_BACKEND_API_URL: "http://localhost:3000/api",
  },
}));

describe('ItemService', () => {
  let itemService: ItemService;
  const mockToken = "test-token-123";
  const baseUrl = "http://localhost:3000/api/item";

  beforeEach(() => {
    itemService = new ItemService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Helper function to create mock item
  const createMockItem = (id: string = "item-123"): ItemType => ({
    _id: id,
    orgId: "org-456",
    createdAt: new Date("2024-06-01T10:00:00Z"),
    createdBy: "user-admin-01",
    modifiedAt: new Date("2024-07-26T09:30:00Z"),
    modifiedBy: "user-editor-02",
    createdWorkspace: "ws1",

    itemNo: "PROD-001",
    itemName: "High-Performance Sensor",
    itemType: "Product",
    isItemActive: "Active",
    remarks: "Standard model for industrial use.",
    class: "Sensors",
    isItemSoldToCustomer: true,
    itemSellDetails: {
      description: "A durable, high-precision sensor for monitoring temperature and humidity.",
      salesPricePerRate: 150.0,
      isTaxable: true,
      markupPercentage: 40,
      roundingPrecision: 2,
      incomeAccount: "4000 - Sales Revenue",
    },
    isItemBoughtFromVendor: true,
    itemBuyDetails: {
      description: "HPS-1 Sensor Unit",
      cost: 90.0,
      expenseAccount: "5000 - Cost of Goods Sold",
      preferredVendor: "Global Components Ltd.",
    },

    isItemTrackedOnInventory: true,
    inventoryDetails: {
      inventoryAssetAccount: "1400 - Inventory Asset",
      initialQty: 500,
      qtyOnHand: 350,
      availableQty: 320,
      onOrder: 100,
      commited: 30,
    },
  });

  describe('createNewItem', () => {
    it("should create a new item successfully", async () => {
      const mockItem: Omit<ItemType, "_id"> = {
        orgId: "org-456",
        createdAt: new Date("2024-06-01T10:00:00Z"),
        createdBy: "admin",
        createdWorkspace: "ws1",
        itemNo: "PROD-001",
        itemName: "High-Performance Sensor",
        itemType: "Service",
        isItemActive: "Active",
        isItemSoldToCustomer: false,
        isItemBoughtFromVendor: false,
        isItemTrackedOnInventory: false,
      };

      const mockApiResponse = { 
        data: mockItem,
        message: "Item created successfully",
        status: 201,
      }

      mockedAxios.post.mockResolvedValue(mockApiResponse);

      const result = await itemService.createNewItem(mockItem, mockToken);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl,
        mockItem,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );

      expect(result).toEqual(mockApiResponse.data);
    });

    it('should handle creation errors', async () => {
      const mockItem = createMockItem();

      const errorMessage = "Failed to create item";

      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(itemService.createNewItem(mockItem, mockToken)).rejects.toThrow(
        errorMessage
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl,
        mockItem,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
    })
  });

  describe('getAllItems', () => {
     it('should fetch all items successfully', async () => {
       const mockItems = [createMockItem('1'),createMockItem('2')];
       const mockResponse = {
         data: {
           data: {
             items: mockItems,
             productsCount: 2,
             servicesCount: 0,
             totalCount: 2,
           },
           message: 'Items found successfully',
           status: 200
         }
       };

       mockedAxios.get.mockResolvedValue(mockResponse);

       const result = await itemService.getAllItems(mockToken);

       expect(mockedAxios.get).toHaveBeenCalledWith(
         baseUrl,
         {
           headers: {
             Authorization: `Bearer ${mockToken}`,
           },
         },
       );
       expect(result).toEqual(mockResponse.data.data);
     })

     it('should handle fetch errors', async () => {
       const errorMessage = 'Network error';
       mockedAxios.get.mockRejectedValue(new Error(errorMessage));
       await expect(itemService.getAllItems(mockToken)).rejects.toThrow(errorMessage);
       expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl, {
         headers: {
           Authorization: `Bearer ${mockToken}`,
         },
       });
     })
  })

  describe('getAllItemsOfOrg', () => {
    it('should fetch all items of an organization successfully', async () => {
      const mockOrgId = 'org-123';
      const mockItems = [createMockItem('1'),createMockItem('2')];
      const mockResponse = {
        data: {
          data: {
            items: mockItems,
            productsCount: 2,
            servicesCount: 0,
            totalCount: 2,
          },
          message: 'Items found successfully',
          status: 200
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await itemService.getAllItemsOfOrg(mockOrgId, mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/organization/${mockOrgId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    })

    it('should handle fetch errors', async () => {
      const mockOrgId = 'org-123';
      const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
      const errorMessage = 'Network error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.getAllItemsOfOrg(mockOrgId, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })

  describe('getAllItemsOfOrgWithFilter', () => {
    it('should fetch all items of an organization with filter successfully', async () => {
      const mockOrgId = 'org-123';
      const mockItemType = 'Product';
      const mockFilter = 'Active';
      const mockItems = [createMockItem('1'),createMockItem('2')];
      const expectedURL = `${baseUrl}/organization/${mockOrgId}/itemType/${mockItemType}/filter/${mockFilter}`;
      const mockResponse = {
        data: {
          data: {
            items: mockItems,
            productsCount: 2,
            servicesCount: 0,
            totalCount: 2,
          },
          message: 'Items found successfully',
          status: 200
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await itemService.getAllItemsOfOrgWithFilter(mockOrgId, mockItemType, mockFilter, mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expectedURL,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data.data);
    })
    it('should handle fetch errors', async () => {
      const mockOrgId = 'org-123';
      const mockItemType = 'Product';
      const mockFilter = 'Active';
      const expectedURL = `${baseUrl}/organization/${mockOrgId}/itemType/${mockItemType}/filter/${mockFilter}`;
      const errorMessage = 'Network error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.getAllItemsOfOrgWithFilter(mockOrgId, mockItemType, mockFilter, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })

  describe('findItemById', () => {
    it('should find item by ID successfully', async () => {
      const mockItemId = 'item-123';
      const mockItem = createMockItem(mockItemId);
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const mockResponse = {
        data: {
          data: mockItem,
          message: 'Item found successfully',
          status: 200
        }
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await itemService.findItemById(mockItemId, mockToken);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data.data);
    })
    it('should handle fetch errors', async () => {
      const mockItemId = 'item-123';
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const errorMessage = 'Network error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.findItemById(mockItemId, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })

  describe('editItem', () => {
    it('should edit item successfully', async () => {
      const mockItemId = 'item-123';
      const mockItem = createMockItem(mockItemId);
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const mockResponse =  {
          data: mockItem,
          message: 'Item updated successfully',
          status: 200
      };
      mockedAxios.patch.mockResolvedValue(mockResponse);
      const result = await itemService.editItem(mockItem, mockToken);
      expect(mockedAxios.patch).toHaveBeenCalledWith(expectedURL, mockItem, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data);
    })
    it('should handle patch errors', async () => {
      const mockItemId = 'item-123';
      const mockItem = createMockItem(mockItemId);
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const errorMessage = 'Network error';
      mockedAxios.patch.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.editItem(mockItem, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.patch).toHaveBeenCalledWith(expectedURL, mockItem, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })

  describe('deleteItem', () => {
    it('should delete item successfully', async () => {
      const mockItemId = 'item-123';
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const mockResponse = {
        data: {},
        message: 'Item deleted successfully',
        status: 200
      };
      mockedAxios.delete.mockResolvedValue(mockResponse);
      const result = await itemService.deleteItem(mockItemId, mockToken);
      expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data);
    })
    it('should handle delete errors', async () => {
      const mockItemId = 'item-123';
      const expectedURL = `${baseUrl}/${mockItemId}`;
      const errorMessage = 'Network error';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.deleteItem(mockItemId, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })

  describe('deleteItemsOfAnOrg', () => {
    it('should delete items of an organization successfully', async () => {
      const mockOrgId = 'org-123';
      const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
      const mockResponse = {
        data: {},
        message: 'Items deleted successfully',
        status: 200
      };
      mockedAxios.delete.mockResolvedValue(mockResponse);
      const result = await itemService.deleteItemsOfAnOrg(mockOrgId, mockToken);
      expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data);
    })
    it('should handle delete errors', async () => {
      const mockOrgId = 'org-123';
      const expectedURL = `${baseUrl}/organization/${mockOrgId}`;
      const errorMessage = 'Network error';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
      await expect(itemService.deleteItemsOfAnOrg(mockOrgId, mockToken)).rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(expectedURL, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    })
  })
});
