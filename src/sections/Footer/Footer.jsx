import React from 'react'
import { socials } from '../../constants'
import './Footer.css'
const Footer = ({formattedTime}) => {


  return (
    <footer className='w-full px-5' id='footer'>
      <div className='flex flex-col-reverse gap-4 ss:flex-row justify-between m-auto pb-4 md:pt-[15svh] sm:pt-[10svh] ss:pt-[10svh] xs:pt-[7svh] text-[0.9rem]'>
        <div className='text-white font-semibold '>2023 &nbsp;&nbsp;&nbsp; {formattedTime} PST</div>
        
        <ul className='flex '>{socials.map((social, index)=>(
          <li className={`list-none sm:${index < socials.length-1 ? 'mr-5' :''} ${index < socials.length-1 ? 'mr-4' :''}  uppercase font-semibold text-white underline-effect`} key={index}>
            <a href={social.link} target='_blank'>{social.name}</a>
          </li>
        ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer