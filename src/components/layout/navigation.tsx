import React, { ReactNode, Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { useControlsContext } from '../../context/controls'
import { classNames } from '../../utils'
import Link from './link'
import { HiOutlineCog6Tooth, HiOutlinePrinter, HiOutlineWrenchScrewdriver, HiOutlineRectangleStack, HiOutlineCloud } from 'react-icons/hi2'

interface Props {
  children: ReactNode
}

const Navigation = ({ children }: Props) => {
  const { open, toggle } = useControlsContext()
  return (
    <div className="h-full w-full relative text-white/80">
      <Transition
        as={Fragment}
        show={open}
        enter="transition-transform duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="bg-black/50 absolute inset-y-0 w-36 z-20">
        </div>
      </Transition>
      <div className={classNames(!open ? "-translate-x-full transition-all duration-75 delay-200" : "w-36", "absolute inset-y-0 w-36 z-30 flex px-3 pt-4 flex-col space-y-4 pb-12")}>
            <Link open={open} label="Print" icon={{ data: HiOutlinePrinter }} delay='delay-[200ms]' />
            <Link open={open} label="Config" icon={{ data: HiOutlineWrenchScrewdriver }} delay='delay-[250ms]' />
            <Link open={open} label="Templates" icon={{ data: HiOutlineRectangleStack }} delay='delay-[300ms]' />
            <Link open={open} label="Community" icon={{ data: HiOutlineCloud}} delay='delay-[350ms]' />
            <div className='flex grow'></div>
            <Link open={open} label="Settings" icon={{ data: HiOutlineCog6Tooth }} delay='delay-[400ms]' />
        </div>
      {open && <button onClick={toggle} className='absolute inset-0 z-10'></button>}
      <div className={classNames(open ? 'translate-x-36 opacity-60 duration-500' : 'translate-x-0 opacity-100 duration-200', 'absolute inset-0 transition-all  z-0')}>{children}</div>
    </div>
  )
}

export default Navigation
