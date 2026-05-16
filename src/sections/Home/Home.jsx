"use client";

import { useEffect, useState } from "react";
import './Home.css'
import {arrow_down, arrow_right_up} from '../../assets/'

const Home = () => {

  const [isVisible, setIsVisible] = useState(false)
  useEffect(()=>{

    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
    };
  
  }, [])


  return (
    <section className='home flex flex-col justify-between py-20 mt-[80px] xl:max-w-[1700px] w-full h-[100svh] bg-black'>
      
      {/* Top */}

      <div className='text-white '>
        
        {/* Main Heading */}
        <div className='flex flex-col md:pl-12 sm:pl-10 ss:pl-6 pl-5 '>
          
          {/* Main Container */}
          <div className='flex flex-col w-min items-end'>
            <div className='flex-col text-[#a0a1a3] lg:text-[200px] md:text-[150px] sm:text-[100px] ss:text-[90px] text-[50px] text-container'>
              <span className= {`hero-text flex items-center font-semibold lg:h-[170px]  md:h-[130px] sm:h-[90px] ss:h-[80px] h-[40px] overflow-hidden `}><h1 className={`${isVisible? 'visible' : 'not-visible'} `}>WEB</h1></span>
            
              <span className={`hero-text flex items-center font-semibold lg:h-[170px] md:ml-[170px] md:h-[130px] sm:ml-[120px] sm:h-[90px] ss:ml-[100px] ss:h-[80px] h-[55px] ml-[50px] overflow-hidden`}><h1 className={`${isVisible? 'visible' : 'not-visible'} `}>DEVELOPER</h1></span>
            </div>
            
            <div className='flex overflow-hidden'>
              <h2 className={`md:text-sm sm:text-[0.7rem] ss:text-[0.7rem] text-[0.6rem] font-semibold ${isVisible? 'visible' : '-not-visible'} `}>BASED IN PAKISTAN</h2>
            </div>
          </div>
        </div>

        <div className='mt-[20vh] flex flex-col md:text-sm sm:text-[0.7rem] ss:text-[0.7rem] text-[0.6rem] font-semibold items-end mr-5 overflow-hidden'>
          <h2 className='-not-visible to-transition delay-[300ms]'>AVAILABLE FOR FREELANCE <br /> FROM JAN 2024</h2>
          
        </div>
      </div>

      {/* Bottom */}
      <div className={`text-white md:text-sm sm:text-[0.7rem] ss:text-[0.7rem]  text-[0.7rem] font-semibold justify-between flex w-full bottom-0 px-5 pb-1 overflow-hidden`}>
        
        <h2 className={`flex items-center max-xs:w-[5rem] mb-2 left-0 ${isVisible? 'visible' : 'not-visible'} delay-[600ms]`} alt='Current Occupation'>CURRENTLY <br className='hidden max-ss:block' />A FREELANCER</h2>
        
        <h2 className={`flex items-center max-xs:items-end ml-[-10%] cursor-pointer mb-2 ${isVisible? 'visible' : 'not-visible'} delay-[600ms] underline-effect arrow-rotate`}><a href="https://www.fiverr.com/mbilal41" target='_blank'>DIGITAL <br className='hidden max-ss:block' /> ARTIST AT FIVERR </a><img className=' arrow ml-2 md:h-[20px] md:w-[20px] h-[17px] w-[17px]' src={arrow_right_up} alt="Fiverr profile"  /></h2>
        
        <button className={`w-[25px] h-[25px] max-sm:hidden flex justify-center items-center rounded-full bg-gray-400 right-0 ${isVisible? 'visible' : 'not-visible'} delay-[600ms] arrow-translate`}><a href='#footer'><img className='arrow-down h-[17px] w-[17px] max-xs:h-[10px] max-xs:w-[10px]' src={arrow_down} alt="scroll-down" /></a></button>
      </div>
     

    </section>
  )
}

export default Home