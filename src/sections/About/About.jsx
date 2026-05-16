import React from 'react'
import './About.css'
import { profile_picture } from '../../assets'
import { Button } from '../../components'

const About = () => {
  
  const imgSize = '200px';
  return (
    <section className='flex py-20 px-[10svw] w-[100svw] justify-end items-start sm:items-center flex-col md:flex-row' id='about'>

      {/* Profile Pic */}

      <div className='m-4'>
        <img className={`rounded-full md:h-[240px] md:w-[240px] ss:w-[200px] ss:h-[200px] w-[180px] h-[180px]` } src={profile_picture} height={imgSize} width={imgSize} alt="profile_picture" />
      </div>
      <div className='px-5 max-w-[500px] md:text-[1.125rem]  ss:text-[1rem] text-[0.9rem]'>
        <h2 className='font-semibold text-[#969696] leading-10'>ABOUT ME</h2>
        <p className='text-white '>
        I am a creative and someone who is fascinated by technology. I have been entertaining my creative tingle for more than 5 years as a Digital Artist and now I've decided to foster my love for technology by embarking on a journey in web development with a passion for building captivating online experiences.
        </p>
        <Button fontColor={'white'} text={"Let's Talk"} bgColor='black' borderWidth='3px' />
      </div>
    </section>
  )
}

export default About