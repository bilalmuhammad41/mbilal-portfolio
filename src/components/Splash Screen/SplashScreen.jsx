"use client";

import { useState, useEffect } from "react";
import './SplashScreen.css'

const SplashScreen = ({ setIsLoading}) => {
  const [percentage, setPercentage] = useState(0)
  const [active, setActive] = useState(true)
  
  useEffect(() => {
    let count = 1
  
    const incrementPercentage = () => {
      if (percentage < 100){
        setPercentage((prevPercentage) => Math.min(prevPercentage += count, 100))   
      }    
      else{

        setActive(false)
        setTimeout(()=>{
          setIsLoading(false)
        }, 800)
      }
    }
    
    setTimeout(()=>{
      incrementPercentage()
    }, 30)
  }, [percentage]);
  
  const barWidth = {
    width: `${percentage}%`
  }
   
  return (
    <div className='[100vh] w-[100vw] bg-black'>
      <div className={`${active ? 'splash-visible': 'splash-not-visible' } flex h-[100vh] w-[100vw] items-center bg-gray-400`}>
        <div className={`m-auto flex w-[320px] items-center loader`}>
          <h2 className={`text-[1.125rem] font-semibold`}>Muhammad Bilal</h2>
          {/* Loading bar */}
          <span className={`relative w-[80px] h-[2px] mx-5 bg-white rounded-full`}>
          <span className={`z-3 absolute h-[2px] bg-black  rounded-full`} style={barWidth}></span>
          </span>
          
          <h2 className=' text-[1.125rem] font-semibold'>{percentage}%</h2>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen