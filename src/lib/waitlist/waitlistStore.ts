/**
 * Waitlist Store
 * Handles email collection for waitlist
 * Currently uses localStorage, designed to be replaceable with backend later
 */

export interface WaitlistEntry {
  email: string;
  subscribedAt: string;
  source: string;
}

const STORAGE_KEY = 'charlie_waitlist';
const USER_EMAIL_KEY = 'charlie_user_email';

/**
 * Simple email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Add email to waitlist
 * TODO: Replace with API call to backend
 */
export function addToWaitlist(email: string, source: string = 'landing'): { success: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available server-side' };
  }
  
  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address' };
  }
  
  try {
    // Get existing waitlist
    const existing = getWaitlist();
    
    // Check if already subscribed
    if (existing.some(entry => entry.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, message: 'You are already on the list' };
    }
    
    // Add new entry
    const entry: WaitlistEntry = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      source,
    };
    
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    // Also store as user's email for convenience
    localStorage.setItem(USER_EMAIL_KEY, email.toLowerCase());
    
    return { success: true, message: 'You are on the list' };
  } catch (error) {
    console.error('Failed to add to waitlist:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

/**
 * Get all waitlist entries (for admin/debug)
 */
export function getWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load waitlist:', error);
  }
  
  return [];
}

/**
 * Check if user is already on waitlist
 */
export function isOnWaitlist(email: string): boolean {
  const waitlist = getWaitlist();
  return waitlist.some(entry => entry.email.toLowerCase() === email.toLowerCase());
}

/**
 * Get stored user email (if they joined waitlist)
 */
export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(USER_EMAIL_KEY);
}

/**
 * Clear waitlist (for testing)
 */
export function clearWaitlist(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}
