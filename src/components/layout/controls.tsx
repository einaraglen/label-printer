import React from 'react'
import { HiOutlineMinus, HiXMark, HiOutlineBars3, HiOutlineArrowLongLeft } from 'react-icons/hi2'
import { useControlsContext } from '../../context/controls'
import { classNames } from '../../utils'
import Swap from '../library/animations/swap'

interface ButtonProps {
  className: string
  icon: any
  onClick?: () => void
}

const ControlButton = ({ className, icon, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={classNames(className, 'h-full px-4 group transition-all duration-200')}>
      {icon}
    </button>
  )
}

const Controls = () => {
  const { open, toggle } = useControlsContext()
  return (
    <div className="h-8 w-full bg-black/50 flex justify-between text-white/80 shadow-md">
      <div>
        <ControlButton className="hover:bg-zinc-800/60" icon={<Swap className="h-5 w-5" swap={open} first={{ data: HiOutlineBars3 }} second={{ data: HiOutlineArrowLongLeft }} />} onClick={toggle} />
      </div>
      <div className="draggable flex-grow"></div>
      <div className="flex items-center">
        <ControlButton className="hover:bg-zinc-800/60" icon={<HiOutlineMinus className="group-hover:scale-125 h-5 w-5 transition-all duration-200" />} onClick={window.ui.Minimize} />
        <ControlButton className="hover:bg-red-600" icon={<HiXMark className="group-hover:scale-125 h-5 w-5 transition-all duration-200" />} onClick={window.ui.Close} />
      </div>
    </div>
  )
}

export default Controls
