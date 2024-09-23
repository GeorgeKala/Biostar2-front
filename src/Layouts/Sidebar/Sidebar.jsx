import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BiostarIcon from "../../assets/biostar-icon.png";
import BiostarLogo from "../../assets/Biostar.png";
import LogoutIcon from "../../assets/logout-icon.png";
import ArrowRight from "../../assets/arrow-right.png";
import { logout } from "../../services/auth";
import useAuth from "../../hooks/useAuth";
import GorgiaLogo from "../../assets/gorgia-jobs-cover.png";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/modalSlice";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    employees: false,
    reports: false,
    comments: false,
    settings: false,
    kitchenReport: false,
  });
  const { user } = useAuth();
  const dispatch = useDispatch();

  const canAccessPage = (allowedUserTypes) => {
    return allowedUserTypes.includes(user?.user?.user_type.name);
  };

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
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
    dispatch(openModal('userModal'))
  }

  const isAdminLogged = sessionStorage.getItem('isAdminLogged');
  return (
    <div className="bg-[#1976D2] min-w-[18%] flex flex-col gap-8">
      <div className="flex flex-col items-center w-full">
        <Link to="/reports/general" className="cursor-pointer">
          <img
            src={GorgiaLogo}
            className="w-[155px] h-[65px]"
            alt="Gorgia Logo"
          />
        </Link>
        <Link to="/reports/general" className="cursor-pointer">
          <div className="flex justify-center gap-2 mt-4">
            <img
              src={BiostarIcon}
              className="w-[18px] h-[21.37px] "
              alt="Biostar Icon"
            />
            <img src={BiostarLogo} className="w-[100px]" alt="Biostar Logo" />
          </div>
        </Link>
      </div>

      <div className="flex flex-col h-full gap-6 px-4">
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
              {canAccessPage([
                "ადმინისტრატორი",
                "HR",
                "IT",
                "მენეჯერი 1",
                "მენეჯერი-რეგიონები",
              ]) && (
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
              {canAccessPage([
                "ადმინისტრატორი",
                "IT",
                "მენეჯერი 1",
                "მენეჯერი-რეგიონები",
              ]) && (
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
              {canAccessPage(["ადმინისტრატორი", "IT"]) && (
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
              {canAccessPage([
                "ადმინისტრატორი",
                "HR",
                "IT",
                "მენეჯერი",
                "მენეჯერი-რეგიონები",
              ]) && (
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
              {canAccessPage([
                "ადმინისტრატორი",
                "IT",
                "მენეჯერი-რეგიონები",
              ]) && (
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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
              {canAccessPage([
                "ადმინისტრატორი",
                "HR",
                "IT",
                "მენეჯერი",
                "მენეჯერი-რეგიონები",
              ]) && (
                <Link
                  to="/employees/create"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/employees/create" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  თანამშრომლის დამატება
                </Link>
              )}
              <Link
                to="/records/full"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/records/full" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                სრული ჩანაწერები
              </Link>
              <Link
                to="/reports/general"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/reports/general" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პერიოდის რეპორტი
              </Link>
              
              
              {canAccessPage(["ადმინისტრატორი", "HR", "IT", "მენეჯერი 1"]) && (
                <Link
                  to="/comments/table"
                  className={`flex items-center gap-3 text-white text-[14px] ${
                    location.pathname === "/comments/table" ? "font-bold" : ""
                  }`}
                >
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  კომენტარების ცხრილი
                </Link>
              )}
              <Link
                to="/orders"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/orders" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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
              {canAccessPage(["ადმინისტრატორი"]) && (
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

              {canAccessPage(["ადმინისტრატორი", "IT"]) && (
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
              <Link
                to="/change-password"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/change-password" ? "font-bold" : ""
                }`}
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
            className="flex items-center gap-3 text-white text-[14px] cursor-pointer"
            onClick={() => toggleSection("kitchenReport")}
          >
            <img
              src={ArrowRight}
              alt="Arrow Right Icon"
              className={`transform ${
                sections.kitchenReport ? "rotate-0" : "-rotate-90"
              } transition-transform duration-300`}
            />
            სამზარეულოს რეპორტი {/* Added Kitchen Report Section */}
          </div>
          {sections.kitchenReport && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link
                to="/reports/kitchen"
                className={`flex items-center gap-3 text-white text-[14px] ${
                  location.pathname === "/reports/kitchen" ? "font-bold" : ""
                }`}
              >
                <img src={ArrowRight} alt="Arrow Right Icon" />
                რეპორტი
              </Link>
            </div>
          )}
        </div>
        )}
        
      </div>
      <div className="flex gap-2 items-center justify-center pb-2">
        <button onClick={handleLogout} className="text-white flex gap-2">
          <img src={LogoutIcon} alt="Logout Icon" />
          გამოსვლა
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
