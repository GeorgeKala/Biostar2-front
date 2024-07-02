import { Link } from 'react-router-dom';
import BiostarIcon from '../../assets/biostar-icon.png';
import ArrowRight from '../../assets/arrow-right.png';
import BiostarLogo from '../../assets/Biostar.png';
import LogoutIcon from '../../assets/logout-icon.png';

const Sidebar = () => {
    return (
        <div className='bg-[#1976D2] w-[18%] flex flex-col gap-8 py-4 min-h-full'>
            <div className='flex justify-center gap-2 '>
                <img src={BiostarIcon} alt="Biostar Icon" />
                <img src={BiostarLogo} className='w-[90px]' alt="Biostar Logo" />
            </div>
            <div className='flex flex-col h-full gap-6 px-4'>
                <Link to="/employees/create" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    თანამშრომლის დამატება/ცვლილება
                </Link>
                <Link to="/reports/detailed" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    პერიოდის რეპორტი (დეტალური)
                </Link>
                <Link to="/reports/general" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    პერიოდის რეპორტი (ზოგადი)
                </Link>
                <Link to="/comments/analyze" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    კომენტარების ანალიზი
                </Link>
                <Link to="/direct" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    პირდაპირი
                </Link>
                <Link to="/comments/table" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    კომენტარების ცხრილი
                </Link>
                <Link to="/orders" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    ბრძანებები
                </Link>
                <Link to="/employees" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    თანამშრომლები
                </Link>
                <Link to="/departments" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    დეპარტამენტები
                </Link>
                <Link to="/regulations" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    განრიგები
                </Link>
                <Link to="/users" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    მომხმარებლები
                </Link>
                <Link to="/areas" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    შენობები
                </Link>
                <Link to="/department_distribution" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    დეპარტამენტების განაწილება
                </Link>
                <Link to="/authorization_employees" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    თანამშრომლის დაშვება
                </Link>
                <Link to="/summary_report" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    სამზარეულოს რეპორტი
                </Link>
                <Link to="/sms" className='flex items-center gap-3 text-white text-[14px]'>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    SMS
                </Link>
            </div>
            <div className='flex gap-2 items-center justify-center'>
                <img src={LogoutIcon} alt="Logout Icon" />
                <p className='text-white text-[16px]'>
                    <Link to="/logout" className="text-white">Logout</Link>
                </p>
            </div>
        </div>
    );
}

export default Sidebar;
