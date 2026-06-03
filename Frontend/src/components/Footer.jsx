// ============================================================================
//  Footer.jsx — Small site-wide footer (matches the SmartTravel HTML look).
// ============================================================================
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      Made with ♥ by <strong>SmartTravel Planner</strong> — Your AI-powered travel companion · © {year}
    </footer>
  )
}
