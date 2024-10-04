import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "../../assets/logout-icon.png";
import ArrowRight from "../../assets/arrow-right.png";
import { logout } from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import GorgiaLogo from "../../assets/gorgia-jobs-cover.png";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/modalSlice";
import ReferenceIcon from '../../assets/sidebar/folder-open.png';
import ReportsIcon from '../../assets/sidebar/task-square.png';
import SettingsIcon from '../../assets/sidebar/Subtract.png';


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);  // State to control the sidebar open/close state
  const getInitialSectionsState = () => {
    const savedState = sessionStorage.getItem("sidebarSections");
    return savedState
      ? JSON.parse(savedState)
      : {
          employees: false,
          reports: false,
          comments: false,
          settings: false,
          kitchenReport: false,
        };
  };

  const [sections, setSections] = useState(getInitialSectionsState);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const canAccessPage = (allowedUserTypes) => {
    return allowedUserTypes.includes(user?.user?.user_type.name);
  };

  const saveSectionsState = (updatedSections) => {
    sessionStorage.setItem("sidebarSections", JSON.stringify(updatedSections));
    setSections(updatedSections); 
  };

  const toggleSection = (section) => {
    const updatedSections = {
      ...sections,
      [section]: !sections[section], 
    };
    saveSectionsState(updatedSections); 
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleModalOpen = () => {
    dispatch(openModal('userModal'));
  };

  const isAdminLogged = sessionStorage.getItem('isAdminLogged');

  // Function to toggle the sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);  // Toggle between open and close
  };

  return (
    <div className={`bg-[#1976D2] ${isOpen ? "w-[15%]" : "w-[5%]"} transition-all duration-300 flex flex-col gap-8`}>
      
      {/* Sidebar Header with toggle button */}
      <div className={`px-4 ${!isOpen ?"justify-center mt-4": "justify-between"} flex  items-center`}>
        {isOpen && (
          <Link to="/reports/general" className="cursor-pointer">
            <img
              src={GorgiaLogo}
              className="w-[155px] h-[65px]"
              alt="Gorgia Logo"
            />
          </Link>
        )}
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? "←" : "→"} {/* Toggle button */}
        </button>
      </div>

      <div className="flex flex-col h-full gap-6 px-4">
        {/* "ცნობარები" Section */}
        <div>
          <div
            className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("reports")}
          >
            <img src={ReferenceIcon} alt="Reference Icon" />
            {isOpen && <span>ცნობარები</span>} 
          </div>
          {sections.reports && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/employees"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
              {/* Additional links for reports section */}
              {canAccessPage([
                "ადმინისტრატორი",
                "HR",
                "IT",
                "მენეჯერი 1",
                "მენეჯერი-რეგიონები",
              ]) && (
                <Link
                  to="/groups"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/groups" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ჯგუფები
                </Link>
              )}
              {canAccessPage([
                "ადმინისტრატორი",
                "IT",
                "მენეჯერი 1",
                "მენეჯერი-რეგიონები",
              ]) && (
                <Link
                  to="/departments"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/departments" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი", "IT"]) && (
                <Link
                  to="/schedules"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/schedules" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  განრიგები
                </Link>
              )}
              {canAccessPage([
                "ადმინისტრატორი",
                "HR",
                "IT",
                "მენეჯერი",
                "მენეჯერი-რეგიონები",
              ]) && (
                <Link
                  to="/command-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/command-types" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ბრძანების ტიპები
                </Link>
              )}
              {canAccessPage([
                "ადმინისტრატორი",
                "IT",
                "მენეჯერი-რეგიონები",
              ]) && (
                <Link
                  to="/forgive-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/forgive-types" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პატიების ტიპები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/devices"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/devices" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მოწყობილობები
                </Link>
              )}
            </div>
          )}
        </div>

        {/* "ანგარიშები" Section */}
        <div>
          <div
            className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("employees")}
          >
            <img src={ReportsIcon} alt="Reports Icon" />
            {isOpen && <span>ანგარიშები</span>}  {/* Show text only when open */}
          </div>
          {sections.employees && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/employees/create"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees/create" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლის დამატება
              </Link>
              <Link
                to="/records/full"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/records/full" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                სრული ჩანაწერები
              </Link>
              <Link
                to="/reports/general"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/reports/general" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პერიოდის რეპორტი
              </Link>
              {canAccessPage(["ადმინისტრატორი", "HR", "IT", "მენეჯერი 1"]) && (
                <Link
                  to="/comments/table"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/comments/table" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  კომენტარების ცხრილი
                </Link>
              )}
              <Link
                to="/orders"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/orders" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
              </Link>
              <Link
                to="/comments/analyze"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/comments/analyze" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                კომენტარების ანალიზი
              </Link>
            </div>
          )}
        </div>

        {/* "პარამეტრები" Section */}
        <div>
          <div
            className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("comments")}
          >
            <img src={SettingsIcon} alt="Settings Icon" />
            {isOpen && <span>პარამეტრები</span>}  {/* Show text only when open */}
          </div>
          {sections.comments && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/users"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/users" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/user-types"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/user-types" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლების ტიპები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/buildings"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/buildings" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  შენობები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/departments-distributions"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/departments-distributions" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტების განაწილება
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link
                  to="/employees/access"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees/access" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  თანამშრომლის დაშვება
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი", "IT"]) && (
                <Link
                  to="/direct"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/direct" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პირდაპირი
                </Link>
              )}
              <Link
                to="/change-password"
                className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/change-password" ? "font-bold" : ""}`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პაროლის შეცვლა
              </Link>
              {(canAccessPage(["ადმინისტრატორი"]) || isAdminLogged === "true") && (
                <button onClick={handleModalOpen} className="flex items-center gap-3 text-white text-[14px]">
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  შესვლა როგორც
                </button>
              )}
            </div>
          )}
        </div>

        {/* Kitchen Report Section */}
        {canAccessPage(["ადმინისტრატორი"]) && (
          <div>
            <div
              className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
              onClick={() => toggleSection("kitchenReport")}
            >
              <img src={SettingsIcon} alt="Settings Icon" />
              {isOpen && <span>სამზარეულოს რეპორტი</span>}  {/* Show text only when open */}
            </div>
            {sections.kitchenReport && isOpen && (
              <div className="pl-4 flex flex-col gap-4 mt-4">
                <Link
                  to="/reports/kitchen"
                  className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/reports/kitchen" ? "font-bold" : ""}`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  რეპორტი
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Section */}
      <div className="flex gap-2 items-center justify-center pb-2">
        <button onClick={handleLogout} className="text-white flex gap-2">
          <img src={LogoutIcon} alt="Logout Icon" />
          {isOpen && <span>გამოსვლა</span>}  {/* Show text only when open */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
