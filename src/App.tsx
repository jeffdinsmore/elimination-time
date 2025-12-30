import { useStore } from "./store";
import { Link } from "react-router-dom";
import {
  averagePoopMinutes,
  averageTimeBetweenPoopsDHM,
  sessionsToCSV,
  downloadCSV,
  medianPoopMinutes,
  countPoopsByHour,
} from "./helper";
import "./App.css";

function format(ms: number) {
  return new Date(ms).toLocaleString();
}

export default function App() {
  const sessions = useStore((s) => s.sessions);
  const activeId = useStore((s) => s.activeId);
  const medianMins = medianPoopMinutes(sessions);
  const byHour = countPoopsByHour(sessions);
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
        <div className="card" style={{ marginTop: 12 }}>
          <h2>Stats</h2>
          <div className="rows">
            <div className="row">
              <span className="label">Median duration</span>
              <span>{medianMins !== null ? `${medianMins} min` : "—"}</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>
              Poops by Hour (start time)
            </h3>
            <ul className="hourGrid">
              {byHour.map((count, hour) => (
                <li key={hour}>
                  <span className="hour">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                  <span className="count">{count}</span>
                </li>
              ))}
            </ul>
          </div>
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
