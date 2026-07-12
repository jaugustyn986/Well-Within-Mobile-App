import { getAccountDataConfirmation } from '../accountDataConfirmation';

describe('account data confirmation copy', () => {
  test('local clear distinguishes signed-in device data from cloud data', () => {
    const confirmation = getAccountDataConfirmation('local', true);
    expect(confirmation.title).toBe('Clear Data From This Device?');
    expect(confirmation.body).toContain('device only');
    expect(confirmation.body).toContain('Backed-up data remains');
  });

  test('cloud deletion keeps the account and covers stale signed-in devices', () => {
    const confirmation = getAccountDataConfirmation('cloud', true);
    expect(confirmation.body).toContain('Other signed-in devices');
    expect(confirmation.body).toContain('account will remain active');
    expect(confirmation.confirmLabel).toBe('Delete Chart Data');
  });

  test('account deletion names all associated data and is irreversible', () => {
    const confirmation = getAccountDataConfirmation('account', true);
    expect(confirmation.body).toContain('associated feedback');
    expect(confirmation.body).toContain('cannot be undone');
    expect(confirmation.confirmLabel).toBe('Delete Account');
  });
});
