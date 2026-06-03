import { Routes, Route } from 'react-router-dom'
import { useScrollReveal } from './hooks/useScrollReveal'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ChatBot from './components/ChatBot'
import Footer from './components/Footer'
import RouteTransition from './components/RouteTransition'
import Home from './pages/Home'
import Login from './pages/Login'
import PlanGenerator from './pages/PlanGenerator'
import SavedPlans from './pages/SavedPlans'
import Tools from './pages/Tools'
// ── NEW pages (added without disturbing existing routes) ──
import Destinations from './pages/Destinations'
import Weather from './pages/Weather'
import Tips from './pages/Tips'

export default function App() {
  useScrollReveal()  // globally reveal elements as they scroll into view

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <RouteTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tools" element={<Tools />} />

            {/* NEW routes — public, browseable without an account */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/tips" element={<Tips />} />

            {/* Pages below require the user to be logged in */}
            <Route
              path="/plan"
              element={
                <ProtectedRoute>
                  <PlanGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedPlans />
                </ProtectedRoute>
              }
            />
          </Routes>
        </RouteTransition>
      </main>

      <Footer />
      {/* Floating travel-assistant chatbot, available on every page */}
      <ChatBot />
    </div>
  )
}
