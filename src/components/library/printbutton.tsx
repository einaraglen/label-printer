import React, { ReactNode, Fragment } from "react";
import { classNames } from "../../utils";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlineSquare2Stack, HiOutlineStop } from "react-icons/hi2";
import { usePrintContext } from "../../context/print";
import Swap from "./animations/swap";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

const PrintButton = ({ children, onClick }: Props) => {
  const { type, set } = usePrintContext()

  return (
    <div className="flex w-[30rem]">
      <button
        onClick={onClick}
        className={classNames(
          "bg-green-700/90 w-full backdrop-blur-sm text-white font-medium px-4 py-1.5 rounded-l-xl hover:bg-green-600/90 transition-all duration-200"
        )}
      >
        <div className="group-focus:scale-95">{children}</div>
      </button>
      <Menu as="div" className="relative ">
        <div>
          <Menu.Button className="py-2 bg-black/60 backdrop-blur-sm text-white overflow-hidden font-medium pl-2 pr-3 hover:bg-black/90 rounded-r-xl transition-all duration-200">
            <Swap className="text-green-700 h-5 w-5" swap={type === "single"} first={{ data: HiOutlineSquare2Stack }} second={{ data: HiOutlineStop }} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Menu.Items className="absolute right-0 flex text-sm font-normal flex-col bottom-10 mb-1 w-28 origin-bottom-right bg-black/60 rounded-xl overflow-hidden backdrop-blur-sm text-white">
            <Menu.Item>
              {({ active }) => (
                <button onClick={() => set({ type: "single" })} className={classNames(active && "bg-black/20", "flex justify-between px-3 py-2 transition-all duration-150")}>
                  <span>Single</span>
                  <HiOutlineStop className={classNames(active && "scale-110 text-green-700", "h-5 w-5 transition-all duration-150")} />
                  </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button onClick={() => set({ type: "multiple" })} className={classNames(active && "bg-black/20", "flex justify-between px-3 py-2 transition-all duration-150")}>
                  <span>Multiple</span>
                  <HiOutlineSquare2Stack className={classNames(active && "scale-110 text-green-700", "h-5 w-5 transition-all duration-150")} />
                  </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default PrintButton;
