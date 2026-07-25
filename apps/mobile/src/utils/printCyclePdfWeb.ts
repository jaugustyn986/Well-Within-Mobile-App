/**
 * Expo Print prints the current page on web, ignoring the supplied HTML. Render
 * the report into an off-screen frame so desktop users print the cycle chart.
 */
export async function printCyclePdfHtmlOnWeb(html: string): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error('Cycle PDF printing is unavailable in this environment.');
  }

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  Object.assign(frame.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
    opacity: '0',
  });
  frame.srcdoc = html;
  const frameLoaded = new Promise<void>((resolve) => {
    frame.addEventListener('load', () => resolve(), { once: true });
    setTimeout(resolve, 1_000);
  });
  document.body.appendChild(frame);

  await frameLoaded;

  const frameDocument = frame.contentDocument;
  const frameWindow = frame.contentWindow;
  if (!frameDocument || !frameWindow) {
    frame.remove();
    throw new Error('Could not prepare the cycle PDF print view.');
  }

  let removed = false;
  const cleanup = () => {
    if (removed) return;
    removed = true;
    frame.remove();
  };
  frameWindow.addEventListener('afterprint', cleanup, { once: true });

  if (frameDocument.fonts?.ready) {
    await frameDocument.fonts.ready;
  }
  await new Promise<void>((resolve) => setTimeout(resolve, 50));

  frameWindow.focus();
  frameWindow.print();
  setTimeout(cleanup, 300_000);
}
