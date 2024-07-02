
import BiostarIcon from '../../assets/biostar-icon.png'
import ArrowRight from '../../assets/arrow-right.png'
import BiostarLogo from '../../assets/Biostar.png'
import LogoutIcon from '../../assets/logout-icon.png'

const Sidebar = () => {
  return (
    <div className='bg-[#1976D2] w-[18%] flex flex-col gap-8 py-4 h-full'>
        <div className='flex justify-center gap-2 '>
            <img src={BiostarIcon} />
            <img src={BiostarLogo} className='w-[90px]'/>
        </div>
        <div className='flex flex-col h-full gap-6 px-4'>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>თანამშრომლის დამატება/ცვლილება</p>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>პერიოდის რეპორტი (დეტალური) </p>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>პერიოდის რეპორტი (ზოგადი) </p>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>კომენტარების ანალიზი </p>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>თანამშრომლის დამატება/ცვლილება</p>
            <p className='flex items-center gap-3 text-white text-[14px]'><img src={ArrowRight}/>თანამშრომლის დამატება/ცვლილება</p>
        </div>
        <div className='flex gap-2 items-center justify-center'>
            <img src={LogoutIcon} alt="" />
            <p className='text-white text-[16px]'>Logout</p>
        </div>
    </div>
  )
}

export default Sidebar