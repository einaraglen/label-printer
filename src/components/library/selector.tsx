import { Listbox, Transition } from "@headlessui/react"
import React, { Fragment } from "react"
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Selector = () => {
    return (
        <div className="w-full relative flex items-center">
            <Listbox value={null}>
            <Listbox.Button className="bg-black/40 flex justify-start hover:bg-black/60 backdrop-blur-sm rounded-l-xl px-4 w-full py-1.5 transition-all duration-200">
            <span className="block truncate">Test</span>
          </Listbox.Button>
          <button className="bg-black/40 flex hover:bg-black/60 backdrop-blur-sm rounded-r-xl pl-2 pr-3 py-2"><HiOutlinePencilSquare className="h-5 w-5 text-green-700" /></button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 -translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
          >
            <Listbox.Options className="absolute origin-top-left mt-1 top-10 max-h-60 w-full overflow-auto rounded-xl bg-black/40 backdrop-blur-sm">
                <Listbox.Option
                  value={"Test"}
                  className="hover:bg-black/20 flex justify-between px-3 py-2 transition-all duration-150 cursor-pointer"
                >
                  {({ selected }) => (
                    <>
                      <span
                      >
                        test
                      </span>
                      {/* {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null} */}
                    </>
                  )}
                </Listbox.Option>
            </Listbox.Options>
          </Transition>
      </Listbox>
        </div>
    )
}

export default Selector;