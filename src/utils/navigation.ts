/**
 * Global Navigation & Scroll Controller
 * - Eliminates the 3-second scroll buffering/lock when navigating back from posts
 * - Automatically preserves category position across page refreshes (F5) for all sections:
 *   #about, #process, #philippines, #casino, #promotion, #community
 */

let activeScrollTimer: any = null;
let currentNavigationTarget: string | null = null;

export const KNOWN_SECTIONS = ['philippines', 'casino', 'promotion', 'community', 'process', 'about'];

/**
 * Cancel any ongoing scroll loops immediately
 */
export function cancelActiveScroll() {
  if (activeScrollTimer) {
    clearTimeout(activeScrollTimer);
    activeScrollTimer = null;
  }
  currentNavigationTarget = null;
}

/**
 * Navigate to a section smoothly and instantly without scroll locking
 */
export function navigateToSection(
  targetId: string,
  options: {
    updateHistory?: boolean;
    replace?: boolean;
    headerOffset?: number;
    behavior?: ScrollBehavior;
  } = {}
) {
  const {
    updateHistory = true,
    replace = false,
    headerOffset = 80,
    behavior = 'instant',
  } = options;

  // Immediately cancel any previous ongoing scroll loops!
  cancelActiveScroll();
  currentNavigationTarget = targetId;

  if (targetId === 'home') {
    if (updateHistory && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('oasis_active_section');
        window.history[replace ? 'replaceState' : 'pushState'](
          { section: 'home' },
          '',
          window.location.pathname
        );
      } catch {}
    }
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const targetHash = `#${targetId}`;

  if (updateHistory && typeof window !== 'undefined') {
    try {
      if (targetId === 'community' || targetId === 'promotion') {
        sessionStorage.setItem('oasis_current_board', targetId);
      }
      sessionStorage.setItem('oasis_active_section', targetId);
      window.history[replace ? 'replaceState' : 'pushState'](
        { section: targetId, originSection: targetId },
        '',
        `${window.location.pathname}${targetHash}`
      );
    } catch {}
  }

  const performScroll = (): boolean => {
    // If user clicked another category in the meantime, abort immediately!
    if (currentNavigationTarget !== targetId) return true;

    const el = document.getElementById(targetId) || document.querySelector(targetHash);
    if (el) {
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
      window.scrollTo({ top: offsetPosition, behavior });
      return true;
    }
    return false;
  };

  // Immediate attempt: if element exists in DOM, scroll instantly
  if (performScroll()) {
    // Perform one microtask settle check in case fonts/images adjust
    requestAnimationFrame(() => {
      if (currentNavigationTarget === targetId) {
        performScroll();
        currentNavigationTarget = null;
      }
    });
    return;
  }

  // If element is not yet in DOM (e.g. React.lazy chunk downloading on refresh or page transition):
  // Poll with short intervals (max 600ms total, NOT 3 seconds!)
  let attempts = 0;
  const poll = () => {
    if (currentNavigationTarget !== targetId) return;
    attempts++;
    const found = performScroll();
    if (found || attempts >= 10) {
      currentNavigationTarget = null;
      return;
    }
    activeScrollTimer = setTimeout(poll, 60);
  };

  activeScrollTimer = setTimeout(poll, 30);
}
