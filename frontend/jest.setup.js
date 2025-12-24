import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'localhost'
process.env.NEXT_PUBLIC_API_PORT = '3001'
process.env.NEXT_PUBLIC_TENANT_ID = 'tenant-a'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))