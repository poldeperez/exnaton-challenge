import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/app/page';

// Mock the API functions with proper jest.fn()
jest.mock('@/lib/api/meter', () => ({
  fetchInstallations: jest.fn(),
  fetchMeterData: jest.fn(),
}));

import { fetchInstallations } from '@/lib/api/meter';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (fetchInstallations as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<Home />, { wrapper });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render installations after loading', async () => {
    const mockInstallations = [
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
            obisCode: '0100021D00FF',
          },
        ],
      },
    ];

    (fetchInstallations as jest.Mock).mockResolvedValue(mockInstallations);

    render(<Home />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Installation 1')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    (fetchInstallations as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<Home />, { wrapper });

    await waitFor(() => {
      const errorElement = screen.getByText('Failed to fetch');
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should render empty state when no installations', async () => {
    (fetchInstallations as jest.Mock).mockResolvedValue([]);

    render(<Home />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/no installations found/i)
      ).toBeInTheDocument();
    });
  });
});