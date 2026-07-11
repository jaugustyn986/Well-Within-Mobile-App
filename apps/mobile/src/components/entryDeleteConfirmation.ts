export type EntryDeleteChoice = 'cancel' | 'confirm';

export async function applyEntryDeleteChoice(
  choice: EntryDeleteChoice,
  onDelete: () => void | Promise<void>,
): Promise<boolean> {
  if (choice === 'cancel') return false;
  await onDelete();
  return true;
}
