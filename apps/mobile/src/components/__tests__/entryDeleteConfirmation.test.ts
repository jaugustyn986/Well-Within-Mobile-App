import { applyEntryDeleteChoice } from '../entryDeleteConfirmation';

describe('entry delete confirmation', () => {
  test('cancel leaves the entry untouched', async () => {
    const onDelete = jest.fn();

    await expect(applyEntryDeleteChoice('cancel', onDelete)).resolves.toBe(false);
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('confirm invokes the existing delete path exactly once', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);

    await expect(applyEntryDeleteChoice('confirm', onDelete)).resolves.toBe(true);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
