import React from "react"

interface Props {
    onChange: (args: any) => void
    name: string
}

const Textarea = ( { onChange, name }: Props) => {
    return (
        <textarea name={name} onChange={onChange} rows={3} className="w-full resize-none outline-none bg-black/40 hover:bg-black/60 focus:bg-black/60 transition-all duration-200 backdrop-blur-sm rounded-xl py-2 px-4" />
    )
}

export default Textarea;