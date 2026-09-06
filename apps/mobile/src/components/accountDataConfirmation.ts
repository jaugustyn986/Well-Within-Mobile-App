export type AccountDataAction = 'local' | 'cloud' | 'account';

export type AccountDataConfirmation = {
  title: string;
  body: string;
  confirmLabel: string;
  successTitle: string;
  successBody: string;
};

export function getAccountDataConfirmation(
  action: AccountDataAction,
  signedIn: boolean,
): AccountDataConfirmation {
  if (action === 'cloud') {
    return {
      title: 'Delete Backed-Up Chart Data?',
      body: 'This permanently removes your backed-up observations and cycle history from your account and clears them from this device. Other signed-in devices will clear older chart data before their next sync. Your account will remain active.',
      confirmLabel: 'Delete Chart Data',
      successTitle: 'Chart Data Deleted',
      successBody: 'Backed-up observations and cycle history were permanently removed. Your account remains active.',
    };
  }

  if (action === 'account') {
    return {
      title: 'Permanently Delete Account?',
      body: 'This permanently deletes your account, backed-up chart data, associated feedback, and the chart data on this device. This action cannot be undone.',
      confirmLabel: 'Delete Account',
      successTitle: 'Account Deleted',
      successBody: 'Your account and associated data were permanently deleted.',
    };
  }

  return signedIn
    ? {
        title: 'Clear Data From This Device?',
        body: 'This removes observations and cycle history from this device only. Backed-up data remains in your account and may return after the next sync.',
        confirmLabel: 'Clear This Device',
        successTitle: 'Device Data Cleared',
        successBody: 'Observations and cycle history were removed from this device only.',
      }
    : {
        title: 'Clear All Data?',
        body: 'This permanently removes all observations and cycle history stored on this device. This action cannot be undone.',
        confirmLabel: 'Clear All Data',
        successTitle: 'Data Cleared',
        successBody: 'All observations and cycle history were removed from this device.',
      };
}
