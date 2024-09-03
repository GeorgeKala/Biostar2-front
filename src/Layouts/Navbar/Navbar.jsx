import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const routeNames = {
  "/reports/general": "პერიოდის რეპორტი",
  "/employees/create": "თანამშრომლის დამატება",
  "/comments/table": "კომენტარების ცხრილი",
  "/comments/analyze": "კომენტარების ანალიზი",
  "/orders": "ბრძანებები",
  "/employees": "თანამშრომლები",
  "/groups": "ჯგუფები",
  "/departments": "დეპარტამენტები",
  "/schedules": "განრიგები",
  "/command-types": "ბრძანების ტიპები",
  "/forgive-types": "პატიების ტიპები",
  "/devices": "მოწყობილობები",
  "/users": "მომხმარებლები",
  "/user-types": "მომხმარებლების ტიპები",
  "/buildings": "შენობები",
  "/departments-distributions": "დეპარტამენტების განაწილება",
  "/employees/access": "თანამშრომლის დაშვება",
  "/direct": "პირდაპირი",
  "/reports/detailed": "დეტალური რეპორტი",
  "/comments/review": "კომენტარების განხილვა",
  "/settings": "პარამეტრები",
  "/notifications": "შეტყობინებები",
  "/dashboard": "დაფა",
  "/records/full": "სრული ჩანაწერები",
  "/reports/kitchen": "სამზარეულო",
  '/change-password': "პაროლის შეცვლა"
};

const Navbar = () => {
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxVisibleTabs = 10;

  useEffect(() => {
    const savedHistory = JSON.parse(sessionStorage.getItem("navHistory")) || [];
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    const savedHistory = JSON.parse(sessionStorage.getItem("navHistory")) || [];
    if (!savedHistory.includes(location.pathname)) {
      const updatedHistory = [...savedHistory, location.pathname];
      setHistory(updatedHistory);
      sessionStorage.setItem("navHistory", JSON.stringify(updatedHistory));
    }
  }, [location]);

  const handleScrollLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleScrollRight = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, history.length - maxVisibleTabs)
    );
  };

  const handleDelete = (route) => {
    // Remove filter, sort configurations, and formData from localStorage
    localStorage.removeItem(`${route}-filters`);
    localStorage.removeItem(`${route}-sortConfig`);
    localStorage.removeItem(`${route}-formData`);

    // Update the history
    const updatedHistory = history.filter((item) => item !== route);
    setHistory(updatedHistory);
    sessionStorage.setItem("navHistory", JSON.stringify(updatedHistory));

    // Navigate to the previous tab in the history
    const currentIndex = updatedHistory.indexOf(location.pathname);
    if (currentIndex > 0) {
      navigate(updatedHistory[currentIndex - 1]);
    } else if (updatedHistory.length > 0) {
      navigate(updatedHistory[0]);
    }
  };

  return (
    <div className="bg-[#1976D2] w-full flex justify-between gap-4 items-center h-[70px] py-4 border-[#0A5FB6] relative">
      <div className="flex space-x-1 overflow-hidden">
        {history
          .slice(currentIndex, currentIndex + maxVisibleTabs)
          .map((route, index) => (
            <div
              key={index}
              className={`flex items-center px-2 py-2 text-white cursor-pointer text-sm
                ${
                  location.pathname === route
                    ? "bg-white text-[#1976D2]"
                    : "bg-[#255585]"
                }
                hover:bg-[#0A5FB6] transition-colors duration-200 rounded-md`}
              onClick={() => navigate(route)}
            >
              <span
                className={`${
                  location.pathname === route ? "text-[#1976D2]" : "text-white"
                } text-xs`}
              >
                {routeNames[route] || route}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(route);
                }}
                className="ml-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={`${
                    location.pathname === route ? "#1976D2" : "white"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* Scroll Buttons */}
      <div className=" flex items-center space-x-1 mr-2">
        <button
          onClick={handleScrollLeft}
          className="text-white bg-[#0A5FB6] px-2 py-1 rounded-md"
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <button
          onClick={handleScrollRight}
          className="text-white bg-[#0A5FB6] px-2 py-1 rounded-md"
          disabled={currentIndex >= history.length - maxVisibleTabs}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Navbar;
