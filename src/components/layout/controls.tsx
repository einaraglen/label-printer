import React from 'react'
import { HiOutlineMinus, HiXMark, HiOutlineBars3, HiOutlineArrowLongLeft } from 'react-icons/hi2'
import { useLocation } from 'react-router-dom'
import { useControlsContext } from '../../context/controls'
import { useStatusContext } from '../../context/status'
import { capitalize, classNames } from '../../utils'
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
    <span className="flex h-2.5 w-2.5 relative">
      <span className={classNames(connected ? "opacity-100 animate-ping" : "opacity-0", "absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75 transition-all duration-300")}></span>
      <span className={classNames(!connected ? "bg-gray-700" : "bg-green-700", "relative inline-flex rounded-full h-2.5 w-2.5 transition-all duration-300")}></span>
    </span>
  )
}

const Controls = () => {
  const { open, toggle } = useControlsContext()
  const { connected } = useStatusContext()
  const { pathname } = useLocation()

  return (
    <div className="h-8 absolute inset-x-0 top-0 bg-black/50 flex justify-between text-white/80 shadow-md">
      <div>
        <ControlButton className="hover:bg-zinc-800/60" icon={<Swap className="h-5 w-5" swap={open} first={{ data: HiOutlineBars3 }} second={{ data: HiOutlineArrowLongLeft }} />} onClick={toggle} />
      </div>
      <div className="draggable flex-grow flex items-center px-4 justify-between text-xs">
        <span>{capitalize(pathname.split("/")[1])}</span>
        <div className="flex items-center space-x-2">
          <span>Connected</span>
          <StatusIndicator connected={connected} />
        </div>
      </div>
      <div className="flex items-center">
        <ControlButton className="hover:bg-zinc-800/60" icon={<HiOutlineMinus className="h-5 w-5 transition-all duration-200" />} onClick={window.ui.Minimize} />
        <ControlButton className="hover:bg-red-700" icon={<HiXMark className="h-5 w-5 transition-all duration-200" />} onClick={window.ui.Close} />
      </div>
    </div>
  )
}

export default Controls
