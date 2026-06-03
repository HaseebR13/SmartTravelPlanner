// ============================================================================
//  useScrollReveal.js
//  Adds the "revealed" class to any element with class reveal-up | reveal-left
//  | reveal-right | reveal-scale once it scrolls into the viewport.
//  Pairs with the CSS rules in index.css (Phase 2 enhancements).
//
//  Call once at the App level — it observes the whole document and handles
//  route changes via MutationObserver so no per-page wiring is needed.
// ============================================================================

import { useEffect } from 'react'

const SELECTOR =
  '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'

export function useScrollReveal(threshold = 0.1) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }),
      { threshold, rootMargin: '0px 0px -28px 0px' }
    )

    const observe = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('revealed')) io.observe(el)
      })

    // Observe elements already in DOM
    observe()

    // Pick up elements that arrive after route changes
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [threshold])
}
