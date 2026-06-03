// ============================================================================
//  Tools.jsx  —  Travel Tools page: currency converter, packing checklist,
//  and a best-time-to-visit guide. All offline, no backend needed.
// ============================================================================
import { useState, useMemo } from 'react'
import { CURRENCY, PACKING, BEST_TIME } from '../data/travelData'

const CODES = Object.keys(CURRENCY)
const STYLES = Object.keys(PACKING.styles)

export default function Tools() {
  // ── Currency converter ──
  const [amount, setAmount] = useState(100)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('PKR')
  const converted = useMemo(() => {
    const pkr = (Number(amount) || 0) * CURRENCY[from].rate
    return pkr / CURRENCY[to].rate
  }, [amount, from, to])

  // ── Packing checklist ──
  const [style, setStyle] = useState('mountain')
  const [days, setDays] = useState(4)
  const [checked, setChecked] = useState({})
  const packList = useMemo(() => {
    const extra = days >= 5 ? ['Extra change of clothes', 'Laundry bag'] : []
    return [...PACKING.base, ...PACKING.styles[style], ...extra]
  }, [style, days])
  const toggle = (item) => setChecked((c) => ({ ...c, [item]: !c[item] }))
  const packedCount = packList.filter((i) => checked[i]).length

  return (
    <div className="page">
      <div className="page-header">
        <h2>Travel Tools</h2>
        <p>Handy utilities to get trip-ready — convert money, build a packing list, and find the best time to travel.</p>
      </div>

      <div className="tools-grid">
        {/* ── Currency converter ── */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">💱</div>
            <div><h3 className="card-title">Currency Converter</h3></div>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Amount</label>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {CODES.map((c) => <option key={c} value={c}>{c} — {CURRENCY[c].name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {CODES.map((c) => <option key={c} value={c}>{c} — {CURRENCY[c].name}</option>)}
              </select>
            </div>
          </div>
          <div className="tool-result">
            {(Number(amount) || 0).toLocaleString()} {from} =
            <strong> {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}</strong>
          </div>
          <p className="tool-note">Offline reference rates — check a live source before exchanging money.</p>
        </div>

        {/* ── Packing checklist ── */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">🧳</div>
            <div><h3 className="card-title">Packing Checklist</h3></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Trip Style</label>
              <select value={style} onChange={(e) => { setStyle(e.target.value); setChecked({}) }}>
                {STYLES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Days</label>
              <input type="number" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
          </div>
          <div className="tool-progress">
            Packed {packedCount} / {packList.length}
          </div>
          <ul className="check-list">
            {packList.map((item) => (
              <li key={item} className={checked[item] ? 'done' : ''} onClick={() => toggle(item)}>
                <span className="check-box">{checked[item] ? '✓' : ''}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Best time to visit ── */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon">📅</div>
            <div><h3 className="card-title">Best Time to Visit</h3></div>
          </div>
          <div className="best-time-list">
            {Object.entries(BEST_TIME).map(([cityName, info]) => (
              <div className="best-time-row" key={cityName}>
                <div className="best-time-city">{cityName}</div>
                <div className="best-time-info">{info}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
