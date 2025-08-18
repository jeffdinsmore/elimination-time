import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useStore } from './store'
import './App.css'

export default function EditEnd() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const session   = useStore(s => s.sessions.find(x => x.id === id))
  const setEndTime = useStore(s => s.setEndTime) // make sure this exists in your store

  const [endMs, setEndMs] = useState<string>('')

  useEffect(() => {
    if (session) setEndMs(String(session.end ?? ''))
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
    const n = endMs === '' ? null : Number(endMs)
    if (n !== null && Number.isNaN(n)) { alert('Enter a valid number (ms).'); return }
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
              <span className="label">Start (ms)</span>
              <span>{session.start}</span>
            </div>
            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
              <span className="label">End (ms)</span>
              <input
                type="number"
                className="input"
                value={endMs}
                onChange={e => setEndMs(e.target.value)}
                placeholder="end time in ms"
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
