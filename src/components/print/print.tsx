import React from 'react'
import { usePrintContext } from '../../context/print'
import Carousel from './carousel'

const Print = () => {
    const { labels } = usePrintContext()
    
  return (
    <div className='w-full h-full flex items-center relative'>
    <Carousel items={labels} />
    </div>
  )
}

export default Print
