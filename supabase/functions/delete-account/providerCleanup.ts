import type { User } from 'jsr:@supabase/supabase-js@2';

const LOCAL_IDENTITY_PROVIDERS = new Set(['email', 'phone']);

export class ProviderCleanupRequiredError extends Error {
  constructor(providers: string[]) {
    super(`Account deletion cleanup is not configured for: ${providers.join(', ')}`);
    this.name = 'ProviderCleanupRequiredError';
  }
}

function identityProviders(user: User): string[] {
  const configured = user.app_metadata?.providers;
  const providers = Array.isArray(configured)
    ? configured.filter((value): value is string => typeof value === 'string')
    : [];
  const primary = user.app_metadata?.provider;
  if (typeof primary === 'string') providers.push(primary);
  return [...new Set(providers)];
}

/**
 * Extension point for identity-provider cleanup. Email magic links and email
 * passwords both use the local `email` identity and require no external token
 * revocation. Add an explicit adapter here before enabling an OAuth provider.
 */
export async function cleanUpIdentityProviders(user: User): Promise<void> {
  const externalProviders = identityProviders(user).filter(
    (provider) => !LOCAL_IDENTITY_PROVIDERS.has(provider),
  );
  if (externalProviders.length > 0) {
    throw new ProviderCleanupRequiredError(externalProviders);
  }
}
