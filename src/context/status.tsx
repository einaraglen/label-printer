import React, { ReactNode, useEffect } from 'react'
import Dymo from '../api/dymo'
import { create } from 'zustand'
import { XMLParser } from 'fast-xml-parser'

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
  const { setConnected } = useStatusContext()

  const polling = (client: Dymo) => {
    return setInterval(() => {
      client.getPrinters().then((res) => {
        const parser = new XMLParser()
        console.log(parser.parse(res.data))
      })
      client.getStatus()
        .then(() => setConnected(true))
        .catch(() => setConnected(false))
    }, 2000)
  }

  useEffect(() => {
    const client = new Dymo()
    const interval = polling(client)
    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}

export default StatusProvider
