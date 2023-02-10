import React from "react"

interface Props {
    onChange: (args: any) => void
    name: string
}

const Input = ({ onChange, name }: Props) => {
    return (
        <div className="w-full">
            <input name={name} onChange={onChange} className="w-full outline-none bg-black/40 hover:bg-black/60 focus:bg-black/90 transition-all duration-200 backdrop-blur-sm rounded-xl py-2 px-4" />
        </div>
    )
}

export default Input;