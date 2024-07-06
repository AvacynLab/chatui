import { useSelector } from 'react-redux'
import { RootState } from './store'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import Welcome from './pages/Welcome/Welcome'
import Chat from './pages/Chat/Chat'
import Dashboard from './pages/Dashboard/Dashboard'
import Search from './pages/Search/Search'

function App() {
  const { API_KEY, theme } = useSelector((state: RootState) => state.user)

  return (
    <main className={`app-wrapper ${theme === 'light' ? 'light' : 'dark'}`}>
      {API_KEY ? (
        <>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </>
      ) : (
        <Welcome />
      )}
    </main>
  )
}

export default App
