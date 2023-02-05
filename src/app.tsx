import React from 'react'
import Controls from './components/layout/controls'
import Navigation from './components/layout/navigation'
import StatusProvider from './context/status'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Print from './components/print/print'
import Config from './components/config/config'
import Templates from './components/templates/templates'
import Community from './components/community/community'
import Settings from './components/settings/settings'
import PrintProvider from './context/print'

const App = () => {
  return (
    <HashRouter>
      <StatusProvider>
        <PrintProvider>
        <div className="w-screen h-screen flex p-6">
          <div className="rounded-xl shadow-lg flex-grow bg-zinc-900/90 overflow-hidden relative">
            <Controls />
            <Navigation>
              <Routes>
                <Route path='/' element={<Navigate to="/print" />} />
                <Route path="/print" element={<Print />} />
                <Route path="/config" element={<Config />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/community" element={<Community />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Navigation>
          </div>
        </div>
        </PrintProvider>
      </StatusProvider>
    </HashRouter>
  )
}

export default App
