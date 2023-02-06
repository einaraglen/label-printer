import React from 'react'
import { usePrintContext } from '../../context/print'
import Carousel from './carousel'

const Print = () => {
    const { payload } = usePrintContext()
    
  return (
    <div className='w-full h-full flex items-center relative'>
    <Carousel items={[1, 2 ,3 ]} />
    </div>
  )
}

export default Print
