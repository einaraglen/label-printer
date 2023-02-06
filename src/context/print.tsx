import React, { ReactNode, useEffect } from "react"
import { create } from "zustand"

export type PrintContext = {
    payload: any[] | null
    set: any
}

export const usePrintContext = create<PrintContext>((set: any) => ({
    payload: null,
    set
}))

interface Props {
    children: ReactNode
}

const PrintProvider = ({ children }: Props) => {
    const { set } = usePrintContext()
    
    const subscribe = () => {
        window.main.on.file((res) => {
            set({ payload: res.Table.Row })
        })
    }

    const init = () => {
        window.main.GetFile().then((res) => {
            console.log(res)
            set({ payload: null })
        })
    }

    useEffect(() => {
        init()
        subscribe()
    }, [])

    return (<>{children}</>)
}

export default PrintProvider;