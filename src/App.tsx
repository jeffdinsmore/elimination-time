import { useStore } from './store'
import { poopMinutesFromSession } from './helper'
import './App.css'

function format(ms: number) {
  return new Date(ms).toLocaleString()
}

const state = useStore.getState();
console.log("sessions", state.sessions, );


export default function App() {
  const sessions = useStore(s => s.sessions)
  const activeId = useStore(s => s.activeId)
  const startPoop = useStore(s => s.startPoop)
  const endPoop = useStore(s => s.endPoop)

  const isActive = !!activeId
  //const first = sessions[0]

  const handleClick = () => {
    if (isActive) endPoop()
    else startPoop()
  }

  return (
    <div className="wrap">
      <header className="header">
        <h1>Poop Time</h1>
      </header>

      <main className="main">
        <button
          className={`primaryBtn ${isActive ? 'danger' : 'success'}`}
          onClick={handleClick}
          aria-pressed={isActive}
        >
          {isActive ? 'Stop' : 'Start'}
        </button>

        {/* First poop display in its own card */}
        <div className="card">
          <h2>Poops Saved</h2>
          <ul className="list">
            {sessions.map(s => {
              const mins = poopMinutesFromSession(s)
              return (
              <li key={s.id}>
                {format(s.start + 120000)}{mins !== null ? ` — ${mins} min` : ''}
              </li>
              )
            })}
          </ul>
        </div>
      </main>

      <footer className="footer" />
    </div>
  )
}
