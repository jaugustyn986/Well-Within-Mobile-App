jest.mock('expo-constants', () => ({
  expoConfig: { scheme: 'wellwithin-dev' },
}));

const mockGetQueryParams = jest.fn();
jest.mock('expo-auth-session/build/QueryParams', () => ({
  getQueryParams: (...args: unknown[]) => mockGetQueryParams(...args),
}));

const mockSetSession = jest.fn();
const mockExchangeCodeForSession = jest.fn();
const mockVerifyOtp = jest.fn();
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      setSession: (...args: unknown[]) => mockSetSession(...args),
      exchangeCodeForSession: (...args: unknown[]) => mockExchangeCodeForSession(...args),
      verifyOtp: (...args: unknown[]) => mockVerifyOtp(...args),
      signInWithOtp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

jest.mock('../../config/env', () => ({
  hasSupabaseEnv: () => true,
}));

import { createSessionFromUrl, getRedirectUrl } from '../auth';

describe('auth callback parsing', () => {
  beforeEach(() => {
    mockGetQueryParams.mockReset();
    mockSetSession.mockReset();
    mockExchangeCodeForSession.mockReset();
    mockVerifyOtp.mockReset();
  });

  it('builds redirect URL from runtime scheme', () => {
    expect(getRedirectUrl()).toBe('wellwithin-dev://auth/callback');
  });

  it('creates a session from query access and refresh tokens', async () => {
    mockGetQueryParams.mockReturnValue({
      params: {
        access_token: 'access-from-query',
        refresh_token: 'refresh-from-query',
      },
      errorCode: null,
    });
    mockSetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } }, error: null });

    const session = await createSessionFromUrl(
      'wellwithin://auth/callback?access_token=access-from-query&refresh_token=refresh-from-query',
    );

    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: 'access-from-query',
      refresh_token: 'refresh-from-query',
    });
    expect(session).toEqual({ user: { id: 'u1' } });
  });

  it('creates a session from fragment tokens when query has none', async () => {
    mockGetQueryParams.mockReturnValue({ params: {}, errorCode: null });
    mockSetSession.mockResolvedValue({ data: { session: { user: { id: 'u2' } } }, error: null });

    const session = await createSessionFromUrl(
      'wellwithin://auth/callback#access_token=access-from-fragment&refresh_token=refresh-from-fragment',
    );

    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: 'access-from-fragment',
      refresh_token: 'refresh-from-fragment',
    });
    expect(session).toEqual({ user: { id: 'u2' } });
  });

  it('exchanges code-based callback when access token is absent', async () => {
    mockGetQueryParams.mockReturnValue({
      params: { code: 'pkce-code-123' },
      errorCode: null,
    });
    mockExchangeCodeForSession.mockResolvedValue({
      data: { session: { user: { id: 'u3' } } },
      error: null,
    });

    const session = await createSessionFromUrl('wellwithin://auth/callback?code=pkce-code-123');

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('pkce-code-123');
    expect(session).toEqual({ user: { id: 'u3' } });
  });

  it('verifies token_hash callbacks when present', async () => {
    mockGetQueryParams.mockReturnValue({
      params: { token_hash: 'hash-123', type: 'magiclink' },
      errorCode: null,
    });
    mockVerifyOtp.mockResolvedValue({
      data: { session: { user: { id: 'u4' } } },
      error: null,
    });

    const session = await createSessionFromUrl(
      'wellwithin://auth/callback?token_hash=hash-123&type=magiclink',
    );

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      token_hash: 'hash-123',
      type: 'magiclink',
    });
    expect(session).toEqual({ user: { id: 'u4' } });
  });
});
