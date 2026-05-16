
const Button = ({text, fontColor='', bgColor='white', border=true, borderColor='white', borderWidth = '2px', height='30px', width='60px'}) => {
  return (
    <button className={`mt-5 w-[${width}] h-[${height}] font-semibold bg-${bgColor} text-${fontColor} ${border ? 'border':''} border-${borderColor} border-${borderWidth} rounded-[100px] px-3 hover:bg-white hover:text-black duration-[600ms] ease-[cubic-bezier(.25,1.08,.68,.98)]`}>{text}</button>
  )
}

export default Button