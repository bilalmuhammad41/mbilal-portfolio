import React from 'react'
import {NavItems} from '../../constants'
import "./Projects.css";

const Projects = () => {
  return (
    <section className='w-full md:py-[15svh] sm:py-[10svh] ss:py-[10svh] xs:py-[7svh] bg-black xl:max-w-[1700px] md:px-12 sm:px-10 ss:px-6 px-5 '>
      <div className='flex flex-col'>
        
        {/* Project Div */}
        
        {NavItems.filter(item => !['scents', 'contact', 'my todo'].includes(item.title)).map((item, index)=>(
         <a
         href={item.link}  // Replace 'item.link' with the actual link you want to open
         target="_blank"   // Optional: Opens the link in a new tab
         rel="noopener noreferrer"  // Recommended for security reasons when using target="_blank"
         key={index}
       >
         <div className={`flex md:h-[250px] sm:h-[150px] ss:h-[120px] h-[90px] text-container border-white ${index === 0 ? 'border-t-[1px]':''} border-b-[1px] leading-none items-center cursor-pointer`}>
           
           {/* Project Title and Year */}
           <h1 className='flex-1 text-[#a0a1a3] uppercase font-semibold md:text-[110px] sm:text-[80px] ss:text-[70px] text-[35px] text-container project'>{item.title}</h1>
           <h3 className='text-white pr-2 font-semibold md:text-sm text-[0.7rem]'>{index === 0 ? '2022' : ''}{index === 1 ? '2022' : ''}{index === 2 ? '2022' : ''}</h3>
         </div>
       </a>
        ))}
      </div>
    </section>
  )
}

export default Projects