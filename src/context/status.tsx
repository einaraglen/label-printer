import React, { ReactNode, useEffect } from 'react'
import Dymo from '../api/dymo'
import { create } from 'zustand'

export type StatusContext = {
  connected: boolean
  setConnected: (value: boolean) => void
}

export const useStatusContext = create<StatusContext>((set) => ({
  connected: false,
  setConnected: (value: boolean) => set({ connected: value }),
}))

interface Props {
  children: ReactNode
}

const StatusProvider = ({ children }: Props) => {
  const { connected, setConnected } = useStatusContext()

  const polling = () => {
    const client = new Dymo()
      client.getStatus()
        .then(() => setConnected(true))
        .catch(() => {
          if (connected) {
            // window.main.StartService()
          }
          setConnected(false)
        })
  }

  useEffect(() => {
     polling()
     const interval = setInterval(polling, 7000)
    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}

export default StatusProvider
