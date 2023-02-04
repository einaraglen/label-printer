import React, { ReactNode, Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { useControlsContext } from '../../context/controls'
import { classNames } from '../../utils'
import Link from './link'
import { HiOutlineCog6Tooth, HiOutlinePrinter, HiOutlineWrenchScrewdriver, HiOutlineRectangleStack, HiOutlineUserGroup } from 'react-icons/hi2'
import { useLocation } from 'react-router-dom'

const NavigationBackdrop = ({ open }: { open: boolean }) => {
  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transition-transform duration-300"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform duration-200"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <div className="bg-black/50 absolute inset-y-0 w-36 z-20"></div>
    </Transition>
  )
}

interface Props {
  children: ReactNode
}

const Navigation = ({ children }: Props) => {
  const { open, toggle } = useControlsContext()
    const { pathname } = useLocation()

  return (
    <div className="absolute inset-x-0 top-8 bottom-0 text-white/60">
      <NavigationBackdrop open={open} />
      <div className={classNames(!open ? '-translate-x-full transition-all duration-75 delay-200' : 'w-36', 'absolute inset-y-0 w-36 z-30 flex px-3 pb-2 pt-4 flex-col space-y-2')}>
        <Link href="/print" selected={pathname === "/print"} onClick={toggle} open={open} label="Print" icon={{ data: HiOutlinePrinter }} delay="delay-[50ms]" />
        <Link href="/config"selected={pathname === "/config"} onClick={toggle} open={open} label="Config" icon={{ data: HiOutlineWrenchScrewdriver }} delay="delay-[100ms]" />
        <Link href="/templates" selected={pathname === "/templates"} onClick={toggle} open={open} label="Templates" icon={{ data: HiOutlineRectangleStack }} delay="delay-[150ms]" />
        <Link href="/community" selected={pathname === "/community"} onClick={toggle} open={open} label="Community" icon={{ data: HiOutlineUserGroup }} delay="delay-[200ms]" />
        <div className="flex grow"></div>
        <Link href="/settings" selected={pathname === "/settings"} onClick={toggle} open={open} label="Settings" icon={{ data: HiOutlineCog6Tooth }} delay="delay-[250ms]" />
      </div>
      {open && <button onClick={toggle} className="absolute inset-0 z-10 outline-none focus:outline-none focus:ring-0 ring-0"></button>}
      <div className={classNames(open ? 'translate-x-36 opacity-60 duration-300' : 'translate-x-0 opacity-100 duration-200', 'absolute inset-0 transition-all z-0 px-3')}>{children}</div>
    </div>
  )
}

export default Navigation
