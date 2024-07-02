
import GorgiaLogo from '../../assets/gorgia-jobs-cover.png'

const Navbar = () => {
  return (
    <div className='bg-[#1976D2] w-full flex justify-between items-center px-20'>
        <img src={GorgiaLogo} className='w-[155px]' />
        <button className='bg-[#FFFFFF] text-[#105D8D] font-medium px-3 py-2 rounded-xl'>Welcome Sopho!</button>
    </div>
  )
}

export default Navbar