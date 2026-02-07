import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import * as supabaseActions from '@/lib/supabase/actions';

// Mock server actions
vi.mock('@/lib/supabase/actions', () => ({
  getProfileOnboardingState: vi.fn(),
  completeOnboarding: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  function TestQueryClientWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
  
  return TestQueryClientWrapper;
};

describe('OnboardingModal', () => {
  const mockUserId = 'test-user-123';
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, value: string) => { localStorageMock[key] = value; },
      removeItem: (key: string) => { delete localStorageMock[key]; },
      clear: () => { localStorageMock = {}; },
      length: 0,
      key: () => null,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not show modal immediately', () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    // Modal should not be visible immediately (before query resolves)
    expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
  });

  it('should render when state allows showing modal', async () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });
  });

  it('should not show modal if onboarding is complete and not reminder time', async () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'complete',
      completed_at: new Date().toISOString(),
      login_count: 3, // Not divisible by 2
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));

    // Modal should not appear
    expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
  });

  it('should show reminder every 2 logins', async () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'complete',
      completed_at: new Date().toISOString(),
      login_count: 4, // Divisible by 2 = reminder
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });
  });

  it('should show all 3 questions', async () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    // Check all questions are present
    expect(screen.getByText(/What is your primary goal/)).toBeInTheDocument();
    expect(screen.getByText(/What is your investment horizon/)).toBeInTheDocument();
    expect(screen.getByText(/If your portfolio drops -20%/)).toBeInTheDocument();
  });

  it('should disable submit button until all questions answered', async () => {
    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('onboarding-submit');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when all questions answered', async () => {
    const user = userEvent.setup();

    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    // Answer all questions
    await user.click(screen.getByRole('button', { name: /Growth/i }));
    await user.click(screen.getByRole('button', { name: /1–3 years/i }));
    await user.click(screen.getByRole('button', { name: /I wait/i }));

    // Submit button should now be enabled
    const submitButton = screen.getByTestId('onboarding-submit');
    expect(submitButton).toBeEnabled();
  });

  it('should submit answers and close modal on success', async () => {
    const user = userEvent.setup();

    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    vi.mocked(supabaseActions.completeOnboarding).mockResolvedValue({
      success: true,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    // Answer all questions
    await user.click(screen.getByRole('button', { name: /Growth/i }));
    await user.click(screen.getByRole('button', { name: /1–3 years/i }));
    await user.click(screen.getByRole('button', { name: /I wait/i }));

    // Submit
    const submitButton = screen.getByTestId('onboarding-submit');
    await user.click(submitButton);

    // Check mutation was called
    await waitFor(() => {
      expect(supabaseActions.completeOnboarding).toHaveBeenCalledWith(mockUserId, {
        goal: 'growth',
        horizon: '1-3years',
        drawdown_reaction: 'wait',
      });
    });

    // Should show success message
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-success')).toBeInTheDocument();
    });

    // Modal should close after timeout (2 seconds)
    await waitFor(
      () => {
        expect(screen.queryByTestId('onboarding-success')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should close modal when clicking "Later"', async () => {
    const user = userEvent.setup();

    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    // Click Later button
    const laterButton = screen.getByTestId('onboarding-snooze');
    await user.click(laterButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });

  it('should close modal when clicking X button', async () => {
    const user = userEvent.setup();

    vi.mocked(supabaseActions.getProfileOnboardingState).mockResolvedValue({
      status: 'incomplete',
      completed_at: null,
      login_count: 1,
    });

    render(<OnboardingModal userId={mockUserId} _testDelay={0} />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-modal')).toBeInTheDocument();
    });

    // Click X button
    const closeButton = screen.getByTestId('onboarding-close');
    await user.click(closeButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId('onboarding-modal')).not.toBeInTheDocument();
    });
  });
});
