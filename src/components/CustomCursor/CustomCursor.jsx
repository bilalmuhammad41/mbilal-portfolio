"use client";

import { useEffect, useRef } from "react";
import './CustomCursor.css'

const CustomCursor = () => {
  
  const cursorRef = useRef(null)
 
  useEffect(()=>{
      document.addEventListener('mousemove', (e)=>{
        const {clientX, clientY} = e
        const mouseX = clientX - cursorRef.current.clientWidth/2
        const mouseY = clientY - cursorRef.current.clientHeight/2

        cursorRef.current.style.left = `${mouseX}px` 
        cursorRef.current.style.top = `${mouseY}px`
        
      })
  }, [])
  

  return (
    <div className='custom-cursor md:block hidden' ref={cursorRef}></div>
  )
}

export default CustomCursor