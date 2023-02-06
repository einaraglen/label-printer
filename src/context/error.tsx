import React, { ReactNode, useEffect, useState } from "react"

type ErrorState = {
    open: boolean;
    err: any | null
}

interface Props {
    children: ReactNode
}

const ErrorProvider = ({ children }: Props) => {
    const [state, setState] = useState<ErrorState>({
        open: false,
        err: null
    })

    const subscribe = () => {
        window.main.on.error((err) => setState({ open: true, err }))
    }

    useEffect(() => subscribe(), [])

    return (<>{children}</>)
}

export default ErrorProvider