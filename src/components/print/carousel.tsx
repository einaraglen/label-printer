import React, { RefObject, useRef, useEffect } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import PrintButton from "../library/printbutton";
import { HiOutlinePrinter, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Loader } from "../library/animations/loading";
import { usePrintContext } from "../../context/print";
import Selector from "../library/selector";

const variants: Variants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hidden: { opacity: 0.2, scale: 0.7, transition: { duration: 0.4 } },
};

const Item = ({ root, item }: { root: RefObject<Element>; item: string }) => {
  const ref: any = useRef(null);
  const control = useAnimation();
  const inView = useInView(ref, { root });

  useEffect(() => {
    control.start(inView ? "visible" : "hidden");
  }, [control, inView]);

  return (
    <div className="h-full w-full py-6">
      <motion.div
        className="h-full w-full relative"
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={control}
      >
        <img
          src={`data:image/png;base64,${item}`}
          className="w-96 mx-auto flex-shrink object-contain rounded-3xl shadow-lg overflow-hidden"
        />
      </motion.div>
    </div>
  );
};

interface Props {
  items: any[] | null;
}

const Carousel = ({ items }: Props) => {
  const root = useRef(null);
  const { set, isPrinting } = usePrintContext();
  return (
    <section
      ref={root}
      className="relative w-full h-full py-[60px] scrollbar-hide overflow-y-auto"
    >
      <div className="fixed z-40 top-0 inset-x-0 bg-gradient-to-b from-zinc-800 h-16 flex justify-center items-center space-x-3">
        <div className="w-[30rem] flex space-x-2">
        <Selector />
          <Selector />
          <button className="bg-black/60 hover:bg-black/90 rounded-xl px-3 transition-all duration-200"><HiOutlineAdjustmentsHorizontal className="text-green-700 h-5 w-5" /></button>
        </div>
      </div>
      {(items || []).map((item, index) => (
        <Item key={index} root={root} item={item} />
      ))}
      <div className="fixed z-52 bottom-0 inset-x-0 bg-gradient-to-t from-zinc-800 h-16 flex justify-center items-center">
        <PrintButton onClick={() => set({ isPrinting: !isPrinting })}>
          <div className="flex space-x-1 justify-center items-center">
            {isPrinting ? (
              <Loader />
            ) : (
              <>
                <span>Print</span>
                <HiOutlinePrinter className="h-5 w-5" />
              </>
            )}
          </div>
        </PrintButton>
      </div>
    </section>
  );
};

export default Carousel;
