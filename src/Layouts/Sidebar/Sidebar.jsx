import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BiostarIcon from '../../assets/biostar-icon.png';
import BiostarLogo from '../../assets/Biostar.png';
import LogoutIcon from '../../assets/logout-icon.png';
import ArrowRight from '../../assets/arrow-right.png';

const Sidebar = () => {
  const location = useLocation();
  
  const [sections, setSections] = useState({
    employees: false,
    reports: false,
    comments: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const handleLogout = async () => {
    try {
        await logout();
        navigate('/'); 
    } catch (error) {
        console.error('Logout error:', error);
    }
};

  return (
    <div className="bg-[#1976D2] w-[18%] flex flex-col gap-8 py-4 h-[92vh]">
      <div className="flex justify-center gap-2">
        <img src={BiostarIcon} alt="Biostar Icon" />
        <img src={BiostarLogo} className="w-[90px]" alt="Biostar Logo" />
      </div>
      <div className="flex flex-col h-full gap-6 px-4">
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection('employees')}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${sections.employees ? 'rotate-0' : '-rotate-90'} transition-transform duration-300`}
            />
            ანგარიშები
          </div>
          {sections.employees && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/employees/create"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/employees/create' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                დამატება/ცვლილება
              </Link>
              <Link
                to="/employees"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/employees' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
            </div>
          )}
        </div>
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection('reports')}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${sections.reports ? 'rotate-0' : '-rotate-90'} transition-transform duration-300`}
            />
            ცნობარები
          </div>
          {sections.reports && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/employees"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/employees' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
              <Link
                to="/groups"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/groups' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ჯგუფები
              </Link>
              <Link
                to="/departments"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/departments' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                დეპარტამენტები
              </Link>
              <Link
                to="/schedules"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/schedules' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                განრიგები
              </Link>
              <Link
                to="/command-types"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/command-types' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანების ტიპები
              </Link>
              
            </div>
          )}
        </div>
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection('comments')}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${sections.comments ? 'rotate-0' : '-rotate-90'} transition-transform duration-300`}
            />
            პარამეტრები
          </div>
          {sections.comments && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/users"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/users' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                მომხმარებლები
              </Link>
              <Link
                to="/user-types"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/user-types' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                მომხმარებლების ტიპები
              </Link>
              <Link
                to="/buildings"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/buildings' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                შენობები
              </Link>
              <Link
                to='/departments-distributions'
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/departments-distributions' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                დეპარტამენტების განაწილება
              </Link>
            </div>
          )}
        </div>
        {/* Settings Section */}
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection('settings')}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${sections.settings ? 'rotate-0' : '-rotate-90'} transition-transform duration-300`}
            />
            სამზარეულოს ანგარიშები
          </div>
          {sections.settings && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/direct"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/direct' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პირდაპირი
              </Link>
              <Link
                to="/orders"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === '/orders' ? 'font-bold' : ''
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <img src={LogoutIcon} alt="Logout Icon" />
        <p className="text-white text-[16px]">
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;


