import React, { ReactNode } from "react"

interface Props {
    children: ReactNode
    onClick?: () => void
}

const Button = ({ children, onClick }: Props) => {
    return (
        <button onClick={onClick} className="">
            {children}
        </button>
    )
}   

export default Button;