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
import KitchenIcon from '../../assets/sidebar/kitchenicon.png';
import LinksModal from '../../components/LinksModal';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [modalVisibleState, setModalVisibleState] = useState(false);
  const [currentSectionLinks, setCurrentSectionLinks] = useState([]);

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

  const filterLinksByRole = (links) => {
    return links.filter((link) => {
      switch (link.path) {
        case "/employees":
          return canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები" ]);
        case "/groups":
          return canAccessPage([ "ადმინისტრატორი", "HR", "IT" ]);
        case "/departments":
          return canAccessPage([ "ადმინისტრატორი", "IT", "მენეჯერი 1", "მენეჯერი-რეგიონები" ]);
        case "/schedules":
          return canAccessPage([ "ადმინისტრატორი", "IT" ]);
        case "/command-types":
          return canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი", "მენეჯერი-რეგიონები" ]);
        case "/forgive-types":
          return canAccessPage([ "ადმინისტრატორი", "IT", "მენეჯერი-რეგიონები" ]);
        case "/devices":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/employees/create":
          return canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები" ]);
        case "/records/full":
          return true;  // Allow all users
        case "/reports/general":
          return true;  // Allow all users
        case "/comments/table":
          return canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები" ]);
        case "/orders":
          return true;  // Allow all users
        case "/comments/analyze":
          return true;  // Allow all users
        case "/users":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/user-types":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/buildings":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/departments-distributions":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/employees/access":
          return canAccessPage([ "ადმინისტრატორი" ]);
        case "/direct":
          return canAccessPage([ "ადმინისტრატორი", "IT", "მენეჯერი-რეგიონები" ]);
        case "/change-password":
          return true;  // Allow all users
        case "/reports/kitchen":
          return canAccessPage([ "ადმინისტრატორი" ]);
        default:
          return false;
      }
    });
  };

  const toggleSection = (section, links) => {
    const allowedLinks = filterLinksByRole(links); // Filter links based on user role

    const updatedSections = {
      ...sections,
      [section]: !sections[section],
    };

    saveSectionsState(updatedSections);

    if (!isOpen) {
      setCurrentSectionLinks(allowedLinks);  
      setModalVisibleState(true);
    }
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
    setModalVisibleState(false); 
  };

  return (
    <div className={`bg-[#1976D2] ${isOpen ? "w-[15%]" : "w-[5%]"} transition-all duration-300 flex flex-col gap-8`}>
      <div className={`px-4 ${!isOpen ? "justify-center mt-4" : "justify-between"} flex  items-center`}>
        {isOpen && (
          <Link to="/reports/general" className="cursor-pointer">
            <img src={GorgiaLogo} className="w-[155px] h-[65px]" alt="Gorgia Logo" />
          </Link>
        )}
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <div className="flex flex-col h-full gap-6 px-4">
        {/* Reference Section */}
        <div>
          <div
            className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("reports", [
              { path: "/employees", label: "თანამშრომლები" },
              { path: "/groups", label: "ჯგუფები" },
              { path: "/departments", label: "დეპარტამენტები" },
              { path: "/schedules", label: "განრიგები" },
              { path: "/command-types", label: "ბრძანების ტიპები" },
              { path: "/forgive-types", label: "პატიების ტიპები" },
              { path: "/devices", label: "მოწყობილობები" }
            ])}
          >
            <img src={ReferenceIcon} alt="Reference Icon" />
            {isOpen && <span>ცნობარები</span>} 
          </div>
          {sections.reports && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              <Link to="/employees" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees" ? "font-bold" : ""}`}>
                <img src={ArrowRight} alt="Arrow Right Icon" />
                თანამშრომლები
              </Link>
              {canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები" ]) && (
                <Link to="/groups" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/groups" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ჯგუფები
                </Link>
              )}
              {canAccessPage([ "ადმინისტრატორი", "IT", "მენეჯერი 1", "მენეჯერი-რეგიონები" ]) && (
                <Link to="/departments" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/departments" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი", "IT"]) && (
                <Link to="/schedules" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/schedules" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  განრიგები
                </Link>
              )}
              {canAccessPage([ "ადმინისტრატორი", "HR", "IT", "მენეჯერი", "მენეჯერი-რეგიონები" ]) && (
                <Link to="/command-types" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/command-types" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  ბრძანების ტიპები
                </Link>
              )}
              {canAccessPage([ "ადმინისტრატორი", "IT", "მენეჯერი-რეგიონები" ]) && (
                <Link to="/forgive-types" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/forgive-types" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პატიების ტიპები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/devices" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/devices" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მოწყობილობები
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div>
          <div className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("employees", [
              { path: "/employees/create", label: "თანამშრომლის დამატება" },
              { path: "/records/full", label: "სრული ჩანაწერები" },
              { path: "/reports/general", label: "პერიოდის რეპორტი" },
              { path: "/comments/table", label: "კომენტარების ცხრილი" },
              { path: "/orders", label: "ბრძანებები" },
              { path: "/comments/analyze", label: "კომენტარების ანალიზი" }
            ])}
          >
            <img src={ReportsIcon} alt="Reports Icon" />
            {isOpen && <span>ანგარიშები</span>}
          </div>
          {sections.employees && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
               {canAccessPage(["ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები"]) && (
                  <Link to="/employees/create" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees/create" ? "font-bold" : ""}`}>
                    <img src={ArrowRight} alt="Arrow Right Icon" />
                    თანამშრომლის დამატება
                  </Link>
                )}
              <Link to="/records/full" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/records/full" ? "font-bold" : ""}`}>
                <img src={ArrowRight} alt="Arrow Right Icon" />
                სრული ჩანაწერები
              </Link>
              <Link to="/reports/general" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/reports/general" ? "font-bold" : ""}`}>
                <img src={ArrowRight} alt="Arrow Right Icon" />
                პერიოდის რეპორტი
              </Link>
              {canAccessPage(["ადმინისტრატორი", "HR", "IT", "მენეჯერი-რეგიონები"]) && (
                <Link to="/comments/table" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/comments/table" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  კომენტარების ცხრილი
                </Link>
              )}
              <Link to="/orders" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/orders" ? "font-bold" : ""}`}>
                <img src={ArrowRight} alt="Arrow Right Icon" />
                ბრძანებები
              </Link>
              <Link to="/comments/analyze" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/comments/analyze" ? "font-bold" : ""}`}>
                <img src={ArrowRight} alt="Arrow Right Icon" />
                კომენტარების ანალიზი
              </Link>
            </div>
          )}
        </div>

        {/* Parameters Section */}
        <div>
          <div className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
            onClick={() => toggleSection("comments", [
              { path: "/users", label: "მომხმარებლები" },
              { path: "/user-types", label: "მომხმარებლების ტიპები" },
              { path: "/buildings", label: "შენობები" },
              { path: "/departments-distributions", label: "დეპარტამენტების განაწილება" },
              { path: "/employees/access", label: "თანამშრომლის დაშვება" },
              { path: "/direct", label: "პირდაპირი" },
              { path: "/change-password", label: "პაროლის შეცვლა" }
            ])}
          >
            <img src={SettingsIcon} alt="Settings Icon" />
            {isOpen && <span>პარამეტრები</span>}
          </div>
          {sections.comments && isOpen && (
            <div className="pl-4 flex flex-col gap-4 mt-4">
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/users" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/users" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/user-types" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/user-types" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  მომხმარებლების ტიპები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/buildings" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/buildings" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  შენობები
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/departments-distributions" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/departments-distributions" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  დეპარტამენტების განაწილება
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი"]) && (
                <Link to="/employees/access" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/employees/access" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  თანამშრომლის დაშვება
                </Link>
              )}
              {canAccessPage(["ადმინისტრატორი", "IT", "მენეჯერი-რეგიონები"]) && (
                <Link to="/direct" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/direct" ? "font-bold" : ""}`}>
                  <img src={ArrowRight} alt="Arrow Right Icon" />
                  პირდაპირი
                </Link>
              )}
              <Link to="/change-password" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/change-password" ? "font-bold" : ""}`}>
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
            <div className={`flex ${isOpen ? "justify-start": "justify-center"}  items-center gap-3 text-white text-[14px] cursor-pointer`}
              onClick={() => toggleSection("kitchenReport", [
                { path: "/reports/kitchen", label: "სამზარეულოს რეპორტი" }
              ])}
            >
              <img src={KitchenIcon} alt="Kitchen Icon" />
              {isOpen && <span>სამზარეულოს რეპორტი</span>}
            </div>
            {sections.kitchenReport && isOpen && (
              <div className="pl-4 flex flex-col gap-4 mt-4">
                <Link to="/reports/kitchen" className={`flex items-center gap-3 text-white text-[14px] ${location.pathname === "/reports/kitchen" ? "font-bold" : ""}`}>
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
          {isOpen && <span>გამოსვლა</span>}
        </button>
      </div>

      {/* Links Modal */}
      <LinksModal
        isVisible={modalVisibleState}
        links={currentSectionLinks}
        onClose={() => setModalVisibleState(false)}
      />
    </div>
  );
};

export default Sidebar;
