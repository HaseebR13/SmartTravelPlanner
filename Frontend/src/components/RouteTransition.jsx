// ============================================================================
//  RouteTransition.jsx — gives every page its own entrance animation.
//
//  Wraps the <Routes> output in a keyed container. Because the key is the
//  pathname, React remounts the wrapper on each navigation, replaying a CSS
//  entrance that is *distinct per route*:
//
//    /              → soft fade-up           (home)
//    /destinations  → zoom-in                (explore)
//    /weather       → drop from above        (sky / weather)
//    /tips          → slide in from left
//    /tools         → rise + settle
//    /plan          → scale-in               (planner)
//    /saved         → slide in from right
//    /login         → gentle fade            (login has its own welcome FX)
//
//  This is purely presentational. React Router already mounts/unmounts the
//  matched route element on navigation, so keying the wrapper changes nothing
//  about routing, guards, or page state — it only attaches an animation class.
// ============================================================================
import { useLocation } from 'react-router-dom'

const ROUTE_FX = {
  '/': 'fade',
  '/destinations': 'zoom',
  '/weather': 'drop',
  '/tips': 'left',
  '/tools': 'rise',
  '/plan': 'scale',
  '/saved': 'right',
  '/login': 'fade',
}

export default function RouteTransition({ children }) {
  const { pathname } = useLocation()
  const variant = ROUTE_FX[pathname] || 'fade'
  return (
    <div className={`route-fx route-fx-${variant}`} key={pathname}>
      {children}
    </div>
  )
}
