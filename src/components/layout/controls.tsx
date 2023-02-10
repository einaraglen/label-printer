import React from 'react'
import { HiOutlineMinus, HiXMark, HiOutlineBars3, HiOutlineArrowLongLeft } from 'react-icons/hi2'
import { useControlsContext } from '../../context/controls'
import { useStatusContext } from '../../context/status'
import { classNames } from '../../utils'
import Swap from '../library/animations/swap'

interface ButtonProps {
  className: string
  icon: any
  onClick?: () => void
}

const ControlButton = ({ className, icon, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={classNames(className, 'h-full px-4 group transition-all duration-200 outline-none focus:ring-0 ring-0')}>
      {icon}
    </button>
  )
}

const StatusIndicator = ({ connected }: { connected: boolean | null }) => {
  return (
    <span className="flex h-3 w-3 relative">
      <span className={classNames(connected ? "opacity-100 animate-ping" : "opacity-0", "absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75 transition-all duration-300")}></span>
      <span className={classNames(!connected ? "bg-gray-700" : "bg-green-700", "absolute top-0.5 left-0.5 rounded-full h-2 w-2 transition-all duration-300")}></span>
    </span>
  )
}

const Controls = () => {
  const { open, toggle } = useControlsContext()
  const { connected } = useStatusContext()

  return (
    <header className="h-8 absolute z-50 inset-x-0 top-0 bg-black/50 flex justify-between text-white/80 shadow-md">
      <div className="flex items-center">
        <ControlButton className="hover:bg-zinc-800" icon={<Swap className="h-5 w-5" swap={open} first={{ data: HiOutlineBars3 }} second={{ data: HiOutlineArrowLongLeft }} />} onClick={toggle} />
      </div>
      <div className="px-2 draggable flex-grow flex items-center justify-between text-xs">
        <span>LabelPrinter</span>
        <div className="flex items-center space-x-2">
          <span>Connected</span>
          <StatusIndicator connected={connected} />
        </div>
      </div>
      <div className="flex items-center">
        <ControlButton className="hover:bg-zinc-800" icon={<HiOutlineMinus className="h-5 w-5 transition-all duration-200" />} onClick={window.ui.Minimize} />
        <ControlButton className="hover:bg-red-700" icon={<HiXMark className="h-5 w-5 transition-all duration-200" />} onClick={window.ui.Close} />
      </div>
    </header>
  )
}

export default Controls
