import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { AssetService } from '../Services/assets-service';
import type { AssetType, ApiResponse } from '@/Types';
import type { MockedFunction } from 'vitest';

// Mock axios
vi.mock('axios', () => ({
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
vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_BACKEND_API_URL: 'http://localhost:3000/api'
  }
}));

describe('AssetService', () => {
  let assetService: AssetService;
  const mockToken = 'test-token-123';
  const baseUrl = 'http://localhost:3000/api/asset';

  beforeEach(() => {
    assetService = new AssetService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Helper function to create mock asset
  const createMockAsset = (id: string = 'asset-123'): AssetType => ({
    _id: id,
    orgId: 'org-123',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-123',
    modifiedAt: new Date('2024-01-02T00:00:00Z'),
    modifiedBy: 'user-456',
    assetName: 'Test Asset',
    make: 'TestMake',
    model: 'TestModel',
    range: 'TestRange',
    assetType: 'TestType',
    isReference: false,
    serialNo: 'SN123456',
    tagNo: 'TAG001',
    assetImages: ['image1.jpg', 'image2.jpg'],
    assetRemarks: 'Test remarks',
    calibrationFrequency: 'Annual',
    lastCalibratedDate: '2024-01-01',
    calibrationDueDate: '2025-01-01',
    customerInstrumentDetails: {
      customer: 'Test Customer',
      assetStatus: 'Active',
      lastReceivedDate: '2024-01-01',
      lastDeliveredDate: '2024-01-15'
    },
    referenceInstrumentDetails: {
      verificationDueDate: new Date('2025-01-01'),
      certificateUrl: 'https://example.com/cert.pdf',
      isActive: true,
      certificateNo: 'CERT123',
      traceability: 'NIST',
      certificateAgency: 'Test Agency'
    }
  });

  describe('createNewAsset', () => {
    it('should create new assets successfully', async () => {
      const mockAssetData = [
        {
          orgId: 'org-123',
          createdAt: '2024-01-01T00:00:00Z',
          createdBy: 'user-123',
          assetName: 'New Asset',
          make: 'TestMake',
          model: 'TestModel',
          range: 'TestRange',
          assetType: 'TestType',
          isReference: false,
          serialNo: 'SN789',
          assetImages: [],
          assetRemarks: 'New asset remarks',
          calibrationFrequency: 'Monthly'
        }
      ];

      const mockResponse: ApiResponse<AssetType> = {
        data: createMockAsset(),
        message: 'Asset created successfully',
        status: 201
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await assetService.createNewAsset(mockAssetData, mockToken);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl,
        mockAssetData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle creation errors', async () => {
      const mockAssetData = [createMockAsset()];
      const errorMessage = 'Failed to create asset';

      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.createNewAsset(mockAssetData, mockToken))
        .rejects.toThrow(errorMessage);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl,
        mockAssetData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
    });
  });

  describe('getAllAssets', () => {
    it('should fetch all assets successfully', async () => {
      const mockAssets = [createMockAsset('1'), createMockAsset('2')];
      const mockResponse = {
        data: {
          data: {
            assets: mockAssets,
            count: 2
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await assetService.getAllAssets(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        baseUrl,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual({
        assets: mockAssets,
        count: 2
      });
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.getAllAssets(mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAllAssetsOfOrg', () => {
    it('should fetch organization assets successfully', async () => {
      const orgId = 'org-123';
      const mockAssets = [createMockAsset()];
      const mockResponse = {
        data: {
          data: {
            assets: mockAssets,
            count: 1
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await assetService.getAllAssetsOfOrg(orgId, mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual({
        assets: mockAssets,
        count: 1
      });
    });

    it('should handle organization fetch errors', async () => {
      const orgId = 'org-123';
      const errorMessage = 'Organization not found';
      
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.getAllAssetsOfOrg(orgId, mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getAllAssetsOfOrgWithFilter', () => {
    it('should fetch filtered organization assets successfully', async () => {
      const orgId = 'org-123';
      const assetMode = 'reference';
      const filter = 'active';
      const mockAssets = [createMockAsset()];
      const mockResponse = {
        data: {
          data: {
            assets: mockAssets,
            count: 1
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await assetService.getAllAssetsOfOrgWithFilter(
        orgId, 
        assetMode, 
        filter, 
        mockToken
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/organization/${orgId}/assetMode/${assetMode}/filter/${filter}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual({
        assets: mockAssets,
        count: 1
      });
    });

    it('should handle filtered fetch errors', async () => {
      const orgId = 'org-123';
      const assetMode = 'reference';
      const filter = 'active';
      const errorMessage = 'Filter not supported';
      
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.getAllAssetsOfOrgWithFilter(
        orgId, 
        assetMode, 
        filter, 
        mockToken
      )).rejects.toThrow(errorMessage);
    });
  });

  describe('findAssetById', () => {
    it('should find asset by ID successfully', async () => {
      const assetId = 'asset-123';
      const mockAsset = createMockAsset(assetId);
      const mockResponse = {
        data: {
          data: mockAsset
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await assetService.findAssetById(assetId, mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/${assetId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockAsset);
    });

    it('should handle asset not found errors', async () => {
      const assetId = 'nonexistent-asset';
      const errorMessage = 'Asset not found';
      
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.findAssetById(assetId, mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('editAsset', () => {
    it('should edit asset successfully', async () => {
      const mockAsset = createMockAsset();
      const mockResponse: ApiResponse<AssetType> = {
        data: mockAsset,
        message: 'Asset updated successfully',
        status: 200
      };

      mockedAxios.patch.mockResolvedValue({ data: mockResponse });

      const result = await assetService.editAsset(mockAsset, mockToken);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${baseUrl}/${mockAsset._id}`,
        mockAsset,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle edit errors', async () => {
      const mockAsset = createMockAsset();
      const errorMessage = 'Failed to update asset';
      
      mockedAxios.patch.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.editAsset(mockAsset, mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('deleteAsset', () => {
    it('should delete asset successfully', async () => {
      const assetId = 'asset-123';
      const mockResponse: ApiResponse<void> = {
        data: undefined,
        message: 'Asset deleted successfully',
        status: 200
      };

      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      const result = await assetService.deleteAsset(assetId, mockToken);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${baseUrl}/${assetId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle delete errors', async () => {
      const assetId = 'asset-123';
      const errorMessage = 'Failed to delete asset';
      
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.deleteAsset(assetId, mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('deleteAssetsOfAnOrg', () => {
    it('should delete all organization assets successfully', async () => {
      const orgId = 'org-123';
      const mockResponse: ApiResponse<void> = {
        data: undefined,
        message: 'All organization assets deleted successfully',
        status: 200
      };

      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      const result = await assetService.deleteAssetsOfAnOrg(orgId, mockToken);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${baseUrl}/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle organization delete errors', async () => {
      const orgId = 'org-123';
      const errorMessage = 'Failed to delete organization assets';
      
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(assetService.deleteAssetsOfAnOrg(orgId, mockToken))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('Authorization Headers', () => {
    it('should include correct authorization header in all requests', async () => {
      const customToken = 'custom-token-456';
      
      // Test different methods to ensure they all use the token correctly
      mockedAxios.get.mockResolvedValue({ data: { data: { assets: [], count: 0 } } });
      mockedAxios.post.mockResolvedValue({ data: { data: createMockAsset() } });
      mockedAxios.patch.mockResolvedValue({ data: { data: createMockAsset() } });
      mockedAxios.delete.mockResolvedValue({ data: { data: undefined } });

      await assetService.getAllAssets(customToken);
      await assetService.createNewAsset([createMockAsset()], customToken);
      await assetService.editAsset(createMockAsset(), customToken);
      await assetService.deleteAsset('asset-123', customToken);

      // Check that all calls used the correct authorization header
      const expectedHeaders = {
        headers: {
          Authorization: `Bearer ${customToken}`
        }
      };

      expect(mockedAxios.get).toHaveBeenCalledWith(baseUrl, expectedHeaders);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        baseUrl, 
        expect.any(Array), 
        expectedHeaders
      );
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining(baseUrl), 
        expect.any(Object), 
        expectedHeaders
      );
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining(baseUrl), 
        expectedHeaders
      );
    });
  });

  describe('URL Construction', () => {
    it('should construct correct URLs for different endpoints', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: { assets: [], count: 0 } } });

      await assetService.getAllAssets(mockToken);
      await assetService.getAllAssetsOfOrg('org-123', mockToken);
      await assetService.getAllAssetsOfOrgWithFilter('org-123', 'customer', 'active', mockToken);
      await assetService.findAssetById('asset-123', mockToken);

      expect(mockedAxios.get).toHaveBeenNthCalledWith(1, baseUrl, expect.any(Object));
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, `${baseUrl}/organization/org-123`, expect.any(Object));
      expect(mockedAxios.get).toHaveBeenNthCalledWith(3, `${baseUrl}/organization/org-123/assetMode/customer/filter/active`, expect.any(Object));
      expect(mockedAxios.get).toHaveBeenNthCalledWith(4, `${baseUrl}/asset-123`, expect.any(Object));
    });
  });
});