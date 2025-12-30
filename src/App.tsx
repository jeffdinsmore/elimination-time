import { useStore } from "./store";
import { Link } from "react-router-dom";
import {
  averagePoopMinutes,
  averageTimeBetweenPoopsDHM,
  sessionsToCSV,
  downloadCSV,
} from "./helper";
import "./App.css";

function format(ms: number) {
  return new Date(ms).toLocaleString();
}

export default function App() {
  const sessions = useStore((s) => s.sessions);
  const activeId = useStore((s) => s.activeId);
  const averageBetween = averageTimeBetweenPoopsDHM(sessions)
    ? averageTimeBetweenPoopsDHM(sessions)
    : "Not Available";
  const average = averagePoopMinutes(sessions)
    ? averagePoopMinutes(sessions) + " minutes"
    : "Not Available";
  const startPoop = useStore((s) => s.startPoop);
  const endPoop = useStore((s) => s.endPoop);

  const isActive = !!activeId;

  const exportCSV = () => {
    const csv = sessionsToCSV(sessions, "en-US", "America/Los_Angeles"); // adjust locale/tz if you want
    const fname = `poops-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(fname, csv);
  };

  const handleClick = () => {
    if (isActive) endPoop();
    else startPoop();
  };

  return (
    <div className="wrap">
      <header className="header">
        <h1>Elimination Time</h1>
      </header>

      <main className="main">
        <button
          className={`primaryBtn ${isActive ? "danger" : "success"}`}
          onClick={handleClick}
          aria-pressed={isActive}
        >
          {isActive ? "Stop" : "Start"}
        </button>
        <h3>Averge Poop Time</h3>
        <p>{!average ? "" : average}</p>

        <h3>Average Time Between Poops</h3>
        <p>{averageBetween}</p>
        <div className="card">
          <h2>Poops</h2>
          {sessions.length ? (
            <ul className="list">
              {sessions
                .slice(-10)
                .reverse()
                .map((s) => (
                  <li className="listRow" key={s.id}>
                    <Link className="listLink" to={`/session/${s.id}`}>
                      {format(s.start)}
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="muted">None saved yet.</p>
          )}
        </div>
        <br></br>
        <button className="exportBtn" onClick={exportCSV}>
          Export CSV
        </button>
      </main>

      <footer className="footer" />
    </div>
  );
}
