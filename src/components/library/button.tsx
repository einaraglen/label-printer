import React, { ReactNode } from "react"
import { classNames } from "../../utils"

interface Props {
    children: ReactNode
    className?: string
    onClick?: () => void
}

const Button = ({ children, className, onClick }: Props) => {
    return (
        <button onClick={onClick} className={classNames(className, "bg-green-700/80 text-white font-medium px-4 py-1.5 rounded-xl hover:bg-green-600 active:scale-[0.95] transition-all duration-300")}>
            {children}
        </button>
    )
}   

export default Button;