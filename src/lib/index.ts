// Export the active data provider
// Swap this import to switch between mock and API providers

import { hybridProvider } from './mock/hybridProvider';

// Active provider - using hybrid (mock data + real AI)
// Switch to mockProvider for fully mocked experience
// Switch to apiProvider when backend is ready
export const dataProvider = hybridProvider;

// Re-export types and utilities
export * from './dataProvider';
