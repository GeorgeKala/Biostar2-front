import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BiostarIcon from '../../assets/biostar-icon.png';
import BiostarLogo from '../../assets/Biostar.png';
import LogoutIcon from '../../assets/logout-icon.png';
import ArrowRight from '../../assets/arrow-right.png';
import { logout } from '../../services/auth';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    employees: false,
    reports: false,
    comments: false,
    settings: false,
  });
  const { hasFullAccess } = useAuth();

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
    <div className="bg-[#1976D2] w-[18%]  flex flex-col gap-8 py-4">
      <div className="flex justify-center gap-2">
        <img src={BiostarIcon} alt="Biostar Icon" />
        <img src={BiostarLogo} className="w-[90px]" alt="Biostar Logo" />
      </div>
      <div className="flex flex-col h-full gap-6 px-4">
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection("employees")}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${
                sections.employees ? "rotate-0" : "-rotate-90"
              } transition-transform duration-300`}
            />
            ანგარიშები
          </div>
          {sections.employees && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/reports/general"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/reports/general" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პერიოდის რეპორტი
              </Link>
              {hasFullAccess && (
                <Link
                  to="/employees/create"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/employees/create" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დამატება/ცვლილება
                </Link>
              )}
              <Link
                to="/employees"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/employees" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
              <Link
                to="/comments/table"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/comments/table" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                კომენტარების ცხრილი
              </Link>
              <Link
                to="/comments/analyze"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/comments/analyze" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                კომენტარების ანალიზი
              </Link>
              <Link
                to="/orders"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/orders" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
              </Link>
            </div>
          )}
        </div>
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection("reports")}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${
                sections.reports ? "rotate-0" : "-rotate-90"
              } transition-transform duration-300`}
            />
            ცნობარები
          </div>
          {sections.reports && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/employees"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/employees" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
              {hasFullAccess && (
                <Link
                  to="/groups"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/groups" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ჯგუფები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/departments"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/departments" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/schedules"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/schedules" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  განრიგები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/command-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/command-types" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ბრძანების ტიპები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/forgive-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/forgive-types" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პატიების ტიპები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/employees/archived"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/employees/archived"
                      ? "font-bold"
                      : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  არქივი
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/devices"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/devices" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მოწყობილობები
                </Link>
              )}
            </div>
          )}
        </div>
        <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection("comments")}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${
                sections.comments ? "rotate-0" : "-rotate-90"
              } transition-transform duration-300`}
            />
            პარამეტრები
          </div>

          {sections.comments && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              {hasFullAccess && (
                <Link
                  to="/users"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/users" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/user-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/user-types" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლების ტიპები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/buildings"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/buildings" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  შენობები
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/departments-distributions"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/departments-distributions"
                      ? "font-bold"
                      : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტების განაწილება
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/employees/access"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/employees/access" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  თანამშრომლის დაშვება
                </Link>
              )}
              {hasFullAccess && (
                <Link
                  to="/direct"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/direct" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პირდაპირი
                </Link>
              )}
            </div>
          )}
        </div>
        {/* Settings Section */}
        {/* <div>
          <div
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection("settings")}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${
                sections.settings ? "rotate-0" : "-rotate-90"
              } transition-transform duration-300`}
            />
            სამზარეულოს ანგარიშები
          </div>
          {sections.settings && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              
              <Link
                to="/orders"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/orders" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
              </Link>
            </div>
          )}
        </div> */}
      </div>
      <div className="flex gap-2 items-center justify-center">
        <button onClick={handleLogout} className="text-white flex gap-2">
          <img src={LogoutIcon} alt="Logout Icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


