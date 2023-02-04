import { Transition } from "@headlessui/react";
import React, { Fragment } from "react"
import { classNames } from "../../utils";

interface Props {
    open: boolean,
    icon: { data: any }
    label: string
    delay: string
}

const Link = ({ open, label, icon, delay }: Props) => {
    return (
        <Transition
        as={Fragment}
        show={open}
        enter={classNames("transition-all duration-300", delay)}
        enterFrom="-translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-full opacity-0">
            <div className="flex items-center space-x-2">
                <icon.data className="h-5 w-5 text-white/40" />
            <span className="text-sm">{label}</span>
            </div>
        </Transition>
    )
}

export default Link;