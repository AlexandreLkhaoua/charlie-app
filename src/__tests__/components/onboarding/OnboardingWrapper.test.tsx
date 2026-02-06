import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingWrapper } from '@/components/onboarding/OnboardingWrapper';
import * as supabaseActions from '@/lib/supabase/actions';
import * as supabaseClient from '@/lib/supabase/client';

// Mock modules
vi.mock('@/lib/supabase/actions', () => ({
  incrementLoginCount: vi.fn(),
  getProfileOnboardingState: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/components/onboarding/OnboardingModal', () => ({
  OnboardingModal: ({ userId }: { userId: string }) => (
    <div data-testid="onboarding-modal">Modal for {userId}</div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('OnboardingWrapper', () => {
  const mockUser = { id: 'test-user-123' };
  const mockSupabaseClient = {
    auth: {
      getUser: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(supabaseClient.createClient).mockReturnValue(mockSupabaseClient as any);
    vi.mocked(supabaseActions.incrementLoginCount).mockResolvedValue({ success: true });
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });
  });

  it('should not render on /demo pages', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/demo/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });

  it('should not render on /login page', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/login');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });

  it('should not render on /signup page', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/signup');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });

  it('should not render on landing page (/)', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });

  it('should render on app pages when user is authenticated', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
      expect(screen.getByText(`Modal for ${mockUser.id}`)).toBeInTheDocument();
    });
  });

  it('should increment login count once per session', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(supabaseActions.incrementLoginCount).toHaveBeenCalledWith(mockUser.id);
      expect(supabaseActions.incrementLoginCount).toHaveBeenCalledTimes(1);
    });

    // Verify session storage was set
    expect(sessionStorage.getItem('charlie_login_tracked')).toBe('true');
  });

  it('should not increment login count if already tracked in session', async () => {
    sessionStorage.setItem('charlie_login_tracked', 'true');
    
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    expect(supabaseActions.incrementLoginCount).not.toHaveBeenCalled();
  });

  it('should not render if user is not authenticated', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });

    expect(supabaseActions.incrementLoginCount).not.toHaveBeenCalled();
  });

  it('should handle authentication error gracefully', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth error'),
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });

    expect(supabaseActions.incrementLoginCount).not.toHaveBeenCalled();
  });

  it('should handle increment login count failure gracefully', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    vi.mocked(supabaseActions.incrementLoginCount).mockResolvedValue({
      success: false,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(supabaseActions.incrementLoginCount).toHaveBeenCalled();
    });

    // Should still render modal even if increment fails
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });
  });

  it('should work on nested app routes', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/app/portfolio/positions');
    
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    render(<OnboardingWrapper />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });
  });
});
