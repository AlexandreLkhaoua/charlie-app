'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

// Default options for all queries
const defaultQueryClientOptions = {
  queries: {
    // Data is fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep unused data in cache for 30 minutes
    gcTime: 30 * 60 * 1000,
    // Retry failed requests 3 times
    retry: 3,
    // Don't refetch on window focus in development
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
  },
};

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient for each session to avoid sharing state
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: defaultQueryClientOptions })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Export QueryClient for use in server components or utilities
export { QueryClient, QueryClientProvider };
