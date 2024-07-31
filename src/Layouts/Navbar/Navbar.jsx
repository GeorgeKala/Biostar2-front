
import { Link } from 'react-router-dom'
import GorgiaLogo from '../../assets/gorgia-jobs-cover.png'

const Navbar = () => {
  return (
    <div className='bg-[#1976D2] w-full flex justify-between items-center px-20'>
      <Link to='/reports/general'>
        <img src={GorgiaLogo} className='w-[155px]' />
      </Link>
       
    </div>
  )
}

export default Navbar