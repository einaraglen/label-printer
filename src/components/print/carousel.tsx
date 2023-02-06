import React, { RefObject, useRef, useEffect } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

const variants: Variants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hidden: { opacity: 0.2, scale: 0.7, transition: { duration: 0.4 } },
}

const items = [1, 2, 3, 4, 5, 6, 7]

const Item = ({ root }: { root: RefObject<Element> }) => {
  const item: any = useRef(null)
  const control = useAnimation()
  const inView = useInView(item, { root })

  useEffect(() => {
    control.start(inView ? 'visible' : 'hidden')
  }, [control, inView])

  return (
    <div className="h-full w-full py-6">
      <motion.div className="bg-blue-700 h-full rounded-lg" ref={item} variants={variants} initial="hidden" animate={control}>
        Test
      </motion.div>
    </div>
  )
}

interface Props {
    items: any[] | null
}

const Carousel = ({ items }: Props) => {
  const root = useRef(null)
  return (
    <section ref={root} className="relative w-full h-full py-[60px] scrollbar-hide overflow-y-auto">
      <div className="fixed z-40 top-0 inset-x-0 bg-gradient-to-b from-zinc-800 h-16" />
      {(items || []).map((item, index) => (
        <Item key={index} root={root} />
      ))}
      <div className="fixed z-40 bottom-0 inset-x-0 bg-gradient-to-t from-zinc-800 h-16" />
    </section>
  )
}

export default Carousel
