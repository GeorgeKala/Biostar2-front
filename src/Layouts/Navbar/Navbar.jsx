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
  "/records/full":"სრული ჩანაწერები",
};

const Navbar = () => {
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleDelete = (route) => {
    const updatedHistory = history.filter((item) => item !== route);
    setHistory(updatedHistory);
    sessionStorage.setItem("navHistory", JSON.stringify(updatedHistory));
  };

  return (
    <div className="bg-[#1976D2] w-full flex justify-between items-center px-4 py-4">
      
      <div className="flex space-x-2">
        {history.map((route, index) => (
          <div
            key={index}
            className={`flex items-center px-4 py-2 text-white cursor-pointer 
              ${location.pathname === route ? "bg-[#0A5FB6]" : "bg-[#1976D2]"} 
              hover:bg-[#0A5FB6] transition-colors duration-200`}
            onClick={() => navigate(route)}
          >
            <span>{routeNames[route] || route}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(route);
              }}
              className="ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
    </div>
  );
};

export default Navbar;
