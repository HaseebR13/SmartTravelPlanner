// ============================================================================
//  IntroAnimation.jsx — Cinematic splash shown on the home page.
//
//  A full-screen, theme-aware intro. Upgraded for more depth & polish:
//    • Two parallax starfields (far + near) that drift at different speeds
//    • A couple of shooting stars
//    • Dual counter-rotating orbits — a plane on the outer ring, a sparkle
//      satellite on the inner ring — around a softly bobbing globe with two
//      pulsing rings
//    • A "drawing" flight arc behind the globe
//    • Brand reveal with a sweeping sheen of light across the wordmark
//    • A warm horizon glow + drifting colour washes
//    • An elegant SPLIT-CURTAIN reveal: the backdrop parts top/bottom to
//      uncover the page beneath
//
//  • Plays on every home load (the parent decides when to mount it).
//  • Calls onFinish() once the exit transition completes.
//  • Click / "Skip intro" / Esc finishes early.
//  • Respects prefers-reduced-motion (resolves almost immediately).
//
//  Pure CSS + a couple of timers — no extra dependencies.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'

// How long the main show runs before the curtain lifts, and how long the
// lift itself takes. Kept here so they stay in sync with the CSS.
const SHOW_MS = 3400
const EXIT_MS = 900

export default function IntroAnimation({ onFinish }) {
  const [exiting, setExiting] = useState(false)
  const finishedRef = useRef(false)
  const timers = useRef([])

  // Stable, randomised star positions (computed once) for two depth layers.
  const farStars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 0.6,
        delay: Math.random() * 3,
        dur: Math.random() * 2.4 + 2.2,
      })),
    []
  )
  const nearStars = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.6 + 1.6,
        delay: Math.random() * 2.4,
        dur: Math.random() * 1.8 + 1.4,
      })),
    []
  )

  // Begin the exit (curtain split) then notify the parent once it's done.
  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    setExiting(true)
    timers.current.push(setTimeout(() => onFinish?.(), EXIT_MS))
  }

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Lock background scroll while the intro is on screen.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Auto-advance: short for reduced-motion users, full show otherwise.
    timers.current.push(setTimeout(finish, reduce ? 350 : SHOW_MS))

    const onKey = (e) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      timers.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`intro-overlay ${exiting ? 'intro-exit' : ''}`}
      onClick={finish}
      role="presentation"
      aria-hidden="true"
    >
      {/* Split-curtain backdrop — these two halves form the deep-warm sky
          and then part to reveal the page underneath on exit. */}
      <div className="intro-curtain intro-curtain-top" />
      <div className="intro-curtain intro-curtain-bottom" />

      {/* Everything below sits above the curtains and fades on exit. */}
      <div className="intro-layer">
        {/* Soft drifting colour washes + warm horizon */}
        <div className="intro-glow intro-glow-1" />
        <div className="intro-glow intro-glow-2" />
        <div className="intro-horizon" />

        {/* Parallax starfields */}
        <div className="intro-stars intro-stars-far">
          {farStars.map((s, i) => (
            <span
              key={i}
              className="intro-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
              }}
            />
          ))}
        </div>
        <div className="intro-stars intro-stars-near">
          {nearStars.map((s, i) => (
            <span
              key={i}
              className="intro-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
              }}
            />
          ))}
        </div>

        {/* Shooting stars */}
        <span className="intro-shoot intro-shoot-1" />
        <span className="intro-shoot intro-shoot-2" />

        {/* Centre stage */}
        <div className="intro-stage">
          <div className="intro-scene">
            {/* Drawn flight arc behind the globe */}
            <svg className="intro-arc" viewBox="0 0 320 320" aria-hidden="true">
              <defs>
                <linearGradient id="introArcGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>
              <circle
                className="intro-arc-path"
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="url(#introArcGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 10"
              />
            </svg>

            {/* Outer orbit — plane */}
            <div className="intro-orbit intro-orbit-outer">
              <div className="intro-orbit-spin">
                <span className="intro-plane">✈</span>
              </div>
            </div>

            {/* Inner orbit — counter-rotating sparkle satellite */}
            <div className="intro-orbit intro-orbit-inner">
              <div className="intro-orbit-spin intro-orbit-spin-rev">
                <span className="intro-sat">✦</span>
              </div>
            </div>

            {/* The globe with two pulsing rings */}
            <div className="intro-globe-wrap">
              <div className="intro-globe">🌍</div>
              <div className="intro-globe-ring" />
              <div className="intro-globe-ring intro-globe-ring-2" />
            </div>
          </div>

          <div className="intro-brand">
            <span className="intro-brand-icon">✈</span> SmartTravel
            <span className="intro-brand-sheen" />
          </div>
          <div className="intro-tagline">Plan extraordinary journeys</div>

          <div className="intro-progress">
            <div className="intro-progress-bar" />
          </div>
        </div>

        <button
          type="button"
          className="intro-skip"
          onClick={(e) => {
            e.stopPropagation()
            finish()
          }}
        >
          Skip intro →
        </button>
      </div>
    </div>
  )
}
