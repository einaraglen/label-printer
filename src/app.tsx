import React from 'react'
import Controls from './components/layout/controls'
import Navigation from './components/layout/navigation'

const App = () => {
  return (
    <div className="w-screen h-screen flex p-6">
      <div className="rounded-xl shadow-lg flex-grow bg-zinc-900/90 overflow-hidden">
        <Controls />
        <Navigation>
            <div className='w-full flex-grow bg-red-600'>test</div>
        </Navigation>
      </div>
    </div>
  )
}

export default App
