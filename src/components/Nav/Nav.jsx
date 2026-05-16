"use client";

import { useState, useEffect } from "react";
import "./Nav.css"
import { MobileNavItems, NavItems } from '../../constants'
import {lines, close} from '../../assets'
import Image from "next/image";

const Nav = ({formattedTime}) => {
  const [scrolling, setScrolling] = useState(false)
  const [logoVisible, setLogoVisible] = useState(true)
  const [menuBtnVisible, setMenuBtnVisible] = useState(true)
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const [mobileMenuBtnVisible, setMobileMenuBtnVisible] = useState(true)
  const [closeBtnVisible, setCloseBtnVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(true)
      
    const navLinks = document.querySelectorAll('.nav-link')

      navLinks.forEach((link, index)=>{
        
       setTimeout(()=>{
          link.classList.remove('menu-visible')
          link.classList.remove('underline-effect')
          link.classList.add('menu-not-visible')}, index*10)
      })
      
      setMenuBtnVisible(true)
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuClick = () =>{
    setMenuBtnVisible(false)
    setScrolling(false)
    
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach((link, index)=>{
    
    setTimeout(()=>{
      link.classList.add('menu-visible')
      link.classList.add('underline-effect')
      link.classList.remove('menu-not-visible')}, index*40)  

    })
  }

  const closeBtnClick = ()=>{
    setCloseBtnVisible(false)
    setLogoVisible(false)

    const mobileNavItemsText = document.querySelectorAll('.mobile-nav-items-text')
      mobileNavItemsText.forEach((text)=>{
        text.classList.remove('mobile-nav-items-text-visible')
        text.classList.add('mobile-nav-items-text-not-visible')
      })
    
    const mobileMenuBottomText = document.querySelectorAll('.mobile-nav-bottom-text')
      mobileMenuBottomText.forEach((text)=>{
        text.classList.remove("mobile-nav-bottom-text-visible")
        text.classList.add("mobile-nav-bottom-text-not-visible")
      })   

    setTimeout(()=>{
      setMobileMenuBtnVisible(true)
      setMobileMenuVisible(false)
    }, 400)
   
  }


  //Time
  
  


  const handleMobileMenuClick = () => {
      setTimeout(()=>{
        setCloseBtnVisible(true)
        setLogoVisible(true)

        const mobileNavItemsText = document.querySelectorAll('.mobile-nav-items-text')
        mobileNavItemsText.forEach((text)=>{
          text.classList.add('mobile-nav-items-text-visible')
          text.classList.remove('mobile-nav-items-text-not-visible') 
        })
       
      }, 200)

      setTimeout(()=>{
        const mobileMenuBottomText = document.querySelectorAll('.mobile-nav-bottom-text')
        mobileMenuBottomText.forEach((text)=>{
          text.classList.add("mobile-nav-bottom-text-visible")
          text.classList.remove("mobile-nav-bottom-text-not-visible")
        })
      }, 400)
      setMobileMenuVisible(true)
      setMobileMenuBtnVisible(false)
    }





  return (
    
    <nav className= "flex fixed w-full xl:max-w-[1700px] z-10">
      

      {/* Desktop Navbar */}
      <div className='flex items-center justify-between w-full h-[80px] max-ss:h-[55px] py-5 max-ss:px-4 px-7 bg-black'>
                       {/* Logo */}
        <div className='text-white font-semibold'>
          <h3 className='text-lg max-ss:text-[1rem]'>Muhammad Bilal</h3>
        </div>
                       {/* Right side Nav */}
        <div className='flex flex-col justify-between items-end h-[30px] relative'>
        
                       {/* NavLinks */}
          <ul className ='sm:flex hidden flex-col text-white font-semibold uppercase list-none items-end mt-1 overflow-hidden'>
            <div className='flex gap-4 justify-center items-center'>
              {
                NavItems.map((item, index)=>(
                  <li className={` nav-link select-none text-white text-[17px] menu-not-visible`}  key={index}><a href={item.link} target='_blank'>{item.title}</a></li>
                ))
              }
            </div>
           
          </ul>
                       {/* Menu Button */}
              
          <div className='sm:flex hidden menu-btn-container overflow-hidden absolute z-10'
            onClick={(e)=>handleMenuClick(e)}>
      
            <button className={` text-white select-none font-semibold text-[17px] menu-button flex justify-center items-center ${menuBtnVisible ? 'menu-button-visible underline-effect' : 'menu-button-not-visible'}`}>
              <span >MENU</span>
              <span className='text-gray-400'>+</span>
            </button>
          </div>



                       {/* Mobile Menu Button */}
              
          <div className={`max-sm:flex hidden menu-btn-container overflow-hidden absolute ${mobileMenuBtnVisible ? 'menu-button-visible underline-effect' : 'menu-button-not-visible'} `}
            onClick={(e) => handleMobileMenuClick(e)}>
      
            <button className={` text-white select-none font-semibold text-[17px] max-ss:text-[1rem] mt-1 menu-button flex justify-center items-center `}>
              <span >MENU</span>
              <span className='text-gray-400'>+</span>
            </button>
          </div>

              
           
        </div>
      </div>

              {/* Mobile Menu */}

              
      <div className={`max-sm:flex flex-col justify-between absolute hidden w-[100svw] h-[100svh] bg-gray-400 ${ mobileMenuVisible? 'mobile-menu-visible':'mobile-menu-not-visible'} origin-top`}>
          
          {/* Mobile Nav */}
        <div className='flex w-full h-[80px] border-b-[1px] border-gray-300 items-center justify-between py-5 px-7' > 
                                 
          {/* Top Container */}
          <div className={`flex w-full items-center select-none h-[30px] overflow-hidden relative`}>
            {/* Black Logo */}
              <div className={`text-black font-semibold absolute ${logoVisible? 'logo-visible' : 'logo-not-visible'}`}>
                <h3 className='text-lg'>Muhammad Bilal</h3>
              </div>
            
            {/* Close Button */}
          
            <div className={`max-sm:flex right-0 z-10 hidden menu-btn-container overflow-hidden absolute ${closeBtnVisible ? 'close-btn-visible' : 'close-btn-not-visible'}`}
                onClick={(e) => closeBtnClick(e)}>
        
              <button className={` text-black select-none font-semibold text-[17px] menu-button flex justify-center items-center `}>
                  <span >CLOSE</span>
                  <span className='ml-2 h-[13px] w-[13px]'><Image src={close} alt="" /></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}

          <div className={`h-[70%] w-full overflow-hidden`}>
            <ul className='list-none w-full h-full px-5 mobile-nav-items-container'>
              {MobileNavItems.map((item, index)=>(
                  <div className={`w-full h-[55px] mobile-nav-items overflow-hidden cursor-pointer`} key={index}>
                    <li className={`uppercase list-none font-medium mobile-nav-items-text`}>
                      <a href={item.link} target='_blank'>{item.title}</a>
                    </li>
                  </div>
              ))}
            </ul>
          </div>

            {/* Mobile Nav */}
        <div className='flex bottom-0 w-full h-[80px] border-t-[1px] border-gray-300 items-center justify-between py-5 px-7' > 
            
            {/* Bottom Container */}
            <div className={`flex w-full items-center  justify-between select-none h-[30px] overflow-hidden relative`}>
              {/* Year */}
                <div className={`text-black font-semibold mobile-nav-bottom-text mobile-nav-bottom-text-not-visible`}>
                  <h3 className='text-lg mobile-nav-bottom-text'>2023</h3>
                </div>
              
              {/* Time */}
            
              <div className={` text-black select-none font-semibold text-[17px] menu-button flex justify-center items-center `}>
                  <span className='mobile-nav-bottom-text mobile-nav-bottom-text-not-visible' id='time'>{formattedTime}</span>           
              </div>
              
            </div>
          </div>
      </div>

     
          
    </nav>
  
    
  )
}

export default Nav