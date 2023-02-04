import { Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { classNames } from '../../utils'
import { Link as RouterLink } from "react-router-dom"

interface Props {
  open: boolean
  icon: { data: any }
  label: string
  delay: string
  selected?: boolean
  href: string
  onClick: any
}

const Link = ({ open, label, icon, delay, selected, href, onClick }: Props) => {
  return (
    <Transition
      as={Fragment}
      show={open}
      enter={classNames('transition-all duration-300', delay)}
      enterFrom="-translate-x-full opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transition-all duration-200"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="-translate-x-full opacity-0"
    >
      <RouterLink onClick={onClick} to={href} className="flex items-center space-x-2 group py-2">
        <icon.data className={classNames(selected ? 'animate-bounce text-green-700' : 'text-white/40', 'h-5 w-5 transition-all duration-200')} />
        <span className={classNames(selected && 'text-white', 'text-sm group-hover:text-white transition-colors duration-150')}>{label}</span>
      </RouterLink>
    </Transition>
  )
}

export default Link
