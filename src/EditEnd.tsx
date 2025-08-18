import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useStore } from './store'
import './App.css'

function format(ms: number) {
    return new Date(ms).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',   // 8/11/2025
    day: 'numeric',
    hour: 'numeric',    // 9
    minute: '2-digit',  // 01
    second: '2-digit',  // 29
    hour12: true,       // 9:01:29 PM
    timeZone: 'America/Los_Angeles', // optional: keeps it consistent
  })
}

export default function EditEnd() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const session   = useStore(s => s.sessions.find(x => x.id === id))
  const setEndTime = useStore(s => s.setEndTime) // make sure this exists in your store

  const [endMs, setEndMs] = useState<string>('')

  useEffect(() => {
    if (session) setEndMs(format(Number(session.end)) ?? '')
  }, [session])

  if (!session) {
    return (
      <div className="wrap">
        <main className="main">
          <div className="card">
            <h2>Not found</h2>
            <button className="ghostBtn" onClick={() => navigate('/')}>← Back</button>
          </div>
        </main>
      </div>
    )
  }

  const save = () => {
    const input = endMs.trim();
    const n = input === '' ? null : new Date(endMs).getTime();
    if (n !== null && (Number.isNaN(n) || !Number.isFinite(n))) { alert('Enter a valid date/time in this format 8/11/2025, 8:59:29 PM'); return }
    if (n !== null && n < session.start) { alert('End cannot be before start.'); return }
    setEndTime(session.id, n)
    navigate(`/session/${session.id}`) // back to details
  }

  return (
    <div className="wrap">
      <header className="header"><h1>Edit End (ms)</h1></header>
      <main className="main">
        <div className="card">
          <div className="rows">
            <div className="row">
              <span className="label">Start:</span>
              <span>{format(session.start)}</span>
            </div>
            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
              <span className="label">End:</span>
              <input
                type="text"
                className="input"
                value={endMs}
                onChange={e => setEndMs(e.target.value)}
                placeholder="e.g., 8/11/2025, 8:59:29 PM"
              />
            </div>
          </div>

          <div className="detailActions">
            <button className="ghostBtn" onClick={() => navigate(-1)}>Cancel</button>
            <button className="dangerBtn" onClick={save}>Save</button>
          </div>
        </div>
      </main>
    </div>
  )
}
