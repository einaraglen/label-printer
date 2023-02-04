import React from 'react'
import { Transition } from '@headlessui/react'
import { classNames } from '../../../utils'

interface Icon {
  data: any
}

interface Props {
  swap: boolean
  className?: string
  first: Icon
  second: Icon
}

const Swap = ({ swap, first, second, className = 'h-5 w-5' }: Props) => {
  return (
    <div className={classNames(className, 'relative dura')}>
      <Transition
        show={swap == false}
        enter="transition-all duration-100 delay-75"
        enterFrom="opacity-0 translate-x-5"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-5"
      >
        <first.data className={classNames(className, 'absolute inset-0')} />
      </Transition>
      <Transition
        show={swap == true}
        enter="transition-all duration-100 delay-75"
        enterFrom="opacity-0 -translate-x-5"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 -translate-x-5"
      >
        <second.data className={classNames(className, 'absolute inset-0')} />
      </Transition>
    </div>
  )
}

export default Swap
