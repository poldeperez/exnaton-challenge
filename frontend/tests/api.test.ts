import { fetchInstallations, fetchMeterData } from '@/lib/api/meter';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchInstallations', () => {
    it('should fetch installations successfully', async () => {
      const mockData = [
        {
          id: 'installation-1',
          name: 'Installation 1',
          meterCount: 2,
          meters: [
            {
              meterId: 'meter-001',
              obisCode: '0100011D00FF',
            },
            {
              meterId: 'meter-002',
              obisCode: '0100012D00FF',
            },
          ],
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchInstallations('tenant-a');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/meterdata/installations',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-tenant-id': 'tenant-a', // Changed from 'X-Tenant-ID' to 'x-tenant-id'
          }),
        })
      );
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchInstallations('tenant-a')).rejects.toThrow();
    });
  });

  describe('fetchMeterData', () => {
    it('should fetch measurements successfully', async () => {
      const params = {
        tenantId: 'test-tenant',
        installationId: 'test-installation',
        solarMeterId: 'solar-meter-123',
        solarObisCode: '0100021D00FF',
        consumptionMeterId: 'consumption-meter-456',
        consumptionObisCode: '0100010800FF',
        start: '2024-01-01T00:00:00.000Z',
        stop: '2024-01-31T23:59:59.999Z',
        interval: 'd' as const,
      };

      // The API returns { data: [...] }
      const mockApiResponse = {
        data: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            solar_value: 50,
            consumption_value: 30,
            self_consumption: 30,
          },
        ],
      };

      // But fetchMeterData extracts and returns just the data array
      const expectedResult = mockApiResponse.data;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchMeterData(params);

      expect(result).toEqual(expectedResult);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/meterdata/measurement'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-tenant-id': 'test-tenant', 
          }),
        })
      );
    });

    it('should include all query parameters', async () => {
      const params = {
        tenantId: 'test-tenant',
        solarMeterId: 'solar-001',
        solarObisCode: '0100021D00FF',
        consumptionMeterId: 'cons-001',
        consumptionObisCode: '0100010800FF',
        installationId: 'inst-001',
        start: '2024-01-01',
        stop: '2024-01-31',
        interval: 'd' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await fetchMeterData(params);

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('solarMeterId=solar-001');
      expect(callUrl).toContain('interval=d');
    });
  });
});