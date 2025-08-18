import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EditEnd from './EditEnd'
import App from './App'
import SessionDetail from './SessionDetail'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/session/:id/edit" element={<EditEnd />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
