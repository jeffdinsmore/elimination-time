import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore, type Session } from './store'
import { useState } from 'react'
import './App.css'

function format(ms: number) {
  return new Date(ms).toLocaleString()
}

function minutesFromSession(s: Session): number | null {
  if (!s.end || s.end <= s.start) return null
  return Math.round((s.end - s.start) / 60000)
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const session = useStore(state => state.sessions.find(s => s.id === id));
  const deletePoop = useStore(s => s.deletePoop); // make sure you added this action earlier

  if (!session) {
    return (
      <div className="wrap">
        <main className="main">
          <div className="card">
            <h2>Not found</h2>
            <p className="muted">That session doesn’t exist.</p>
            <Link to="/" className="backLink">← Back</Link>
          </div>
        </main>
      </div>
      
    )
  }

  const START_OFFSET_MS = 120000
  const mins = minutesFromSession(session)

  const handleDelete = () => {
    deletePoop(session.id)
    navigate('/')
  }

  const handleEdit = () => {
    navigate('/');
  }

  return (
    <div className="wrap">
      <header className="header">
        <h1>Session Details</h1>
      </header>

      <main className="main">
        <div className="card">
          <div className="rows">
            <div className="row">
              <span className="label">Start</span>
              <span>{format(session.start + START_OFFSET_MS)}</span>
            </div>
            <div className="row">
              <span className="label">End</span>
              <span>{session.end ? format(session.end) : '—'}</span>
            </div>
            <div className="row">
              <span className="label">Duration</span>
              <span>{mins !== null ? `${mins} min` : '—'}</span>
            </div>
          </div>
          <div className="detailActions">
            
          </div>

          <div className="detailActions">
            <button className="ghostBtn" onClick={() => navigate(-1)}>← Back</button>
            <Link className="warningBtn" to={`/session/${session.id}/edit`}>Edit</Link>
            <button className="dangerBtn" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </main>
    </div>
  )
}
