// ============================================================================
//  ModuleTransition.jsx — Themed full-screen transition played when the user
//  switches Travel Modules in the planner.
//
//  Each of the six modules gets its own distinct, classy mini-scene built from
//  inline SVG + CSS (no extra dependencies):
//
//    • pakistan            → mountain range + crescent & star (deep green)
//    • international       → rotating wireframe globe + flight arcs (deep blue)
//    • within-city         → glowing city skyline + dropping pin (indigo/violet)
//    • country-to-country  → globe with two pins + great-circle arc (teal/cyan)
//    • multi-city          → winding route lighting up + compass (amber/orange)
//    • food                → steaming bowl + cutlery (warm red/orange)
//
//  Behaviour mirrors IntroAnimation: auto-advances after MOD_SHOW, lifts away
//  over MOD_EXIT, is skippable (click / Esc), respects prefers-reduced-motion,
//  and locks background scroll while visible. It is purely visual — it never
//  touches the form's data or the module logic; the parent simply mounts it.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'

const MOD_SHOW = 1800 // main show duration (ms)
const MOD_EXIT = 520  // curtain-lift duration (ms)

// ── Per-module copy + scene renderer ────────────────────────────────────────
const SCENES = {
  pakistan: {
    label: 'Pakistan',
    sub: 'Mountains, valleys & timeless trails',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        {/* crescent + star */}
        <g className="mod-crescent-wrap">
          <path className="mod-crescent" d="M232 44a30 30 0 1 0 14 39 24 24 0 1 1-14-39z" />
          <path className="mod-star" d="M270 52l3.2 7.4 8 .7-6 5.3 1.8 7.8-7-4.2-7 4.2 1.8-7.8-6-5.3 8-.7z" />
        </g>
        {/* layered mountains */}
        <path className="mod-mtn mod-mtn-back" d="M0 240 L70 120 L130 200 L200 96 L270 184 L320 130 L320 240 Z" />
        <path className="mod-mtn mod-mtn-mid"  d="M0 240 L60 168 L120 220 L190 150 L250 214 L320 176 L320 240 Z" />
        <path className="mod-mtn mod-mtn-snow" d="M190 96 L172 124 L182 122 L176 136 L204 136 L198 122 L208 124 Z" />
        <path className="mod-mtn mod-mtn-front" d="M0 240 L80 196 L150 234 L220 198 L300 236 L320 224 L320 240 Z" />
      </svg>
    ),
  },

  international: {
    label: 'International',
    sub: 'Cross borders, chase horizons',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        <g transform="translate(160 120)">
          <circle className="mod-globe-edge" r="74" />
          {/* spinning longitude / latitude wireframe */}
          <g className="mod-globe-spin">
            <ellipse className="mod-wire" rx="74" ry="74" />
            <ellipse className="mod-wire" rx="50" ry="74" />
            <ellipse className="mod-wire" rx="26" ry="74" />
            <line className="mod-wire" x1="-74" y1="0" x2="74" y2="0" />
            <line className="mod-wire" x1="-69" y1="-37" x2="69" y2="-37" />
            <line className="mod-wire" x1="-69" y1="37" x2="69" y2="37" />
          </g>
          {/* flight arc + plane flying across it */}
          <path className="mod-arc" d="M-94 36 A122 122 0 0 1 94 -36" />
          <text className="mod-plane-fly mod-plane-intl" textAnchor="middle" dominantBaseline="middle">✈</text>
        </g>
      </svg>
    ),
  },

  'within-city': {
    label: 'Within City',
    sub: 'Hidden gems, block by block',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        {/* skyline */}
        <g className="mod-city">
          <rect className="mod-bldg" x="24"  y="150" width="34" height="90" />
          <rect className="mod-bldg" x="66"  y="110" width="40" height="130" />
          <rect className="mod-bldg" x="114" y="138" width="34" height="102" />
          <rect className="mod-bldg" x="156" y="86"  width="44" height="154" />
          <rect className="mod-bldg" x="208" y="124" width="36" height="116" />
          <rect className="mod-bldg" x="252" y="158" width="40" height="82" />
          {/* lit windows */}
          <g className="mod-windows">
            <rect x="74"  y="124" width="6" height="8" /><rect x="88"  y="124" width="6" height="8" />
            <rect x="74"  y="142" width="6" height="8" /><rect x="88"  y="142" width="6" height="8" />
            <rect x="166" y="100" width="6" height="8" /><rect x="182" y="100" width="6" height="8" />
            <rect x="166" y="120" width="6" height="8" /><rect x="182" y="120" width="6" height="8" />
            <rect x="166" y="140" width="6" height="8" /><rect x="182" y="140" width="6" height="8" />
            <rect x="218" y="138" width="6" height="8" /><rect x="230" y="138" width="6" height="8" />
          </g>
        </g>
        {/* dropping location pin */}
        <g className="mod-pin-drop" transform="translate(178 0)">
          <path className="mod-pin" d="M0 40 C-16 40 -16 18 0 4 C16 18 16 40 0 40 Z" transform="translate(0 18) rotate(180)" />
          <circle className="mod-pin-dot" cx="0" cy="30" r="5" />
        </g>
        <ellipse className="mod-pin-shadow" cx="178" cy="196" rx="22" ry="6" />
      </svg>
    ),
  },

  'country-to-country': {
    label: 'Country to Country',
    sub: 'One journey, many flags',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        <g transform="translate(160 120)">
          <circle className="mod-globe-edge" r="72" />
          <g className="mod-globe-spin mod-globe-slow">
            <ellipse className="mod-wire" rx="72" ry="72" />
            <ellipse className="mod-wire" rx="46" ry="72" />
            <line className="mod-wire" x1="-72" y1="0" x2="72" y2="0" />
            <line className="mod-wire" x1="-66" y1="-36" x2="66" y2="-36" />
            <line className="mod-wire" x1="-66" y1="36" x2="66" y2="36" />
          </g>
          {/* great-circle arc between two pins */}
          <path className="mod-arc mod-arc-draw" d="M-58 22 Q0 -78 58 -16" />
          <g className="mod-pin-a" transform="translate(-58 22)">
            <circle r="6" /><circle className="mod-pin-ring" r="6" />
          </g>
          <g className="mod-pin-b" transform="translate(58 -16)">
            <circle r="6" /><circle className="mod-pin-ring" r="6" />
          </g>
          <text className="mod-plane-fly mod-plane-c2c" textAnchor="middle" dominantBaseline="middle">✈</text>
        </g>
      </svg>
    ),
  },

  'multi-city': {
    label: 'Multi-City Tour',
    sub: 'Stitch the perfect circuit',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        {/* winding route that draws itself */}
        <path id="modTourPath" className="mod-route mod-arc-draw"
              d="M40 196 C90 150 70 96 130 92 C190 88 176 150 232 150 C276 150 284 104 286 70" />
        {/* stops light up along the way */}
        <g className="mod-stops">
          <circle cx="40"  cy="196" r="7" style={{ animationDelay: '0.05s' }} />
          <circle cx="130" cy="92"  r="7" style={{ animationDelay: '0.45s' }} />
          <circle cx="232" cy="150" r="7" style={{ animationDelay: '0.85s' }} />
          <circle cx="286" cy="70"  r="7" style={{ animationDelay: '1.2s' }} />
        </g>
        {/* spinning compass */}
        <g className="mod-compass" transform="translate(160 60)">
          <circle className="mod-compass-ring" r="26" />
          <g className="mod-compass-needle">
            <path d="M0 -20 L6 0 L0 6 L-6 0 Z" className="mod-needle-n" />
            <path d="M0 20 L6 0 L0 -6 L-6 0 Z" className="mod-needle-s" />
          </g>
        </g>
      </svg>
    ),
  },

  food: {
    label: 'Food Trail',
    sub: 'Taste your way across the map',
    render: () => (
      <svg viewBox="0 0 320 240" className="mod-svg" aria-hidden="true">
        {/* rising steam */}
        <g className="mod-steam">
          <path className="mod-steam-w" d="M138 96 q-10 -16 0 -32 q10 -16 0 -32" style={{ animationDelay: '0s' }} />
          <path className="mod-steam-w" d="M160 96 q-10 -16 0 -32 q10 -16 0 -32" style={{ animationDelay: '0.5s' }} />
          <path className="mod-steam-w" d="M182 96 q-10 -16 0 -32 q10 -16 0 -32" style={{ animationDelay: '0.9s' }} />
        </g>
        {/* bowl */}
        <g className="mod-bowl">
          <path className="mod-bowl-body" d="M92 116 a68 68 0 0 0 136 0 Z" />
          <ellipse className="mod-bowl-rim" cx="160" cy="116" rx="68" ry="12" />
          <ellipse className="mod-bowl-food" cx="160" cy="116" rx="56" ry="9" />
        </g>
        {/* cutlery */}
        <g className="mod-cutlery">
          <line className="mod-fork" x1="60" y1="120" x2="60" y2="182" />
          <line className="mod-fork" x1="60" y1="120" x2="60" y2="100" />
          <line className="mod-knife" x1="260" y1="100" x2="260" y2="182" />
        </g>
      </svg>
    ),
  },
}

const FALLBACK = { label: '', sub: 'Loading module…', render: () => null }

export default function ModuleTransition({ moduleKey, onFinish }) {
  const [exiting, setExiting] = useState(false)
  const finishedRef = useRef(false)
  const timers = useRef([])
  const scene = SCENES[moduleKey] || FALLBACK

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    setExiting(true)
    timers.current.push(setTimeout(() => onFinish?.(), MOD_EXIT))
  }

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    timers.current.push(setTimeout(finish, reduce ? 260 : MOD_SHOW))

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
      className={`mod-transition mod-${moduleKey} ${exiting ? 'mod-exit' : ''}`}
      onClick={finish}
      role="presentation"
      aria-hidden="true"
    >
      <div className="mod-bg" />
      <div className="mod-vignette" />

      <div className="mod-scene-wrap">
        <div className="mod-scene">{scene.render()}</div>
        <div className="mod-label">{scene.label}</div>
        <div className="mod-sub">{scene.sub}</div>
        <div className="mod-dots">
          <span style={{ animationDelay: '0s' }} />
          <span style={{ animationDelay: '0.15s' }} />
          <span style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  )
}
