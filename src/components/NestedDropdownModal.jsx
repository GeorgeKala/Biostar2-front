import React, { useState, useEffect } from "react";

const NestedDropdownModal = ({
  isOpen,
  onClose,
  onSelect,
  data,
  header,
  link,
}) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(searchItems(data, searchTerm));
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const searchItems = (items, term) => {
    return items.reduce((acc, item) => {
      if (
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        (item.children && searchItems(item.children, term).length > 0)
      ) {
        acc.push({
          ...item,
          children: item.children ? searchItems(item.children, term) : [],
        });
      }
      return acc;
    }, []);
  };

  const toggleSubMenu = (e, subItemId) => {
    e.stopPropagation(); // Prevent parent click event
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [subItemId]: !prevOpenSubmenus[subItemId],
    }));
  };

  const renderSubMenu = (subMenu) => (
    <ul className="ml-10">
      {subMenu.map((subItem, index) => (
        <li key={index} className="cursor-pointer">
          <div
            onClick={() => setSelectedItem(subItem)}
            className={`flex justify-between items-center mb-2 border-b py-2 border-black ${
              selectedItem.id === subItem.id ? "bg-blue-300" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              {subItem?.children?.length > 0 && (
                <button
                  onClick={(e) => toggleSubMenu(e, subItem.id)}
                  className="bg-[#00C7BE] text-white px-1 rounded w-[20px] py-[0.2px]"
                >
                  {openSubmenus[subItem.id] ? "-" : "+"}
                </button>
              )}
              <p className="text-gray-700 font-medium">{subItem.name}</p>
            </div>
          </div>
          {subItem?.children && openSubmenus[subItem.id] && renderSubMenu(subItem.children)}
        </li>
      ))}
    </ul>
  );

  const handleItemClick = () => {
    if (selectedItem && selectedItem.id) {
      onSelect(selectedItem.id, selectedItem.name);
      onClose();
    }
  };

  return (
    <>
      <style>
        {`
          .fade-in {
            opacity: 0;
            transform: scale(0.95);
            animation: fadeIn 0.3s forwards;
          }
          .fade-out {
            opacity: 1;
            transform: scale(1);
            animation: fadeOut 0.3s forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes fadeOut {
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}
      </style>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
          isOpen ? "fade-in" : "fade-out"
        }`}
        style={{ display: isModalVisible ? "block" : "none" }}
      >
        <div
          className={`flex flex-col bg-white w-1/2 h-[80%] rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        >
          <div className="px-10 rounded-t-md py-2 bg-[#1976D2] flex justify-between w-full mb-10">
            <h1 className="rounded-md font-medium text-[23px] text-white">
              {header}
            </h1>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => setModalVisible(false), 300);
              }}
              className="hover:text-gray-200 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 mb-4">
            <input
              type="text"
              placeholder="ძიება..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div className="p-4 overflow-y-auto">
            {filteredData &&
              filteredData.map((item, index) => (
                <div key={index} className="cursor-pointer">
                  <div
                    onClick={() => setSelectedItem(item)}
                    className={`flex justify-between items-center border-b py-2 border-black ${
                      selectedItem.id === item.id ? "bg-blue-300" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      {item?.children?.length > 0 && (
                        <button
                          onClick={(e) => toggleSubMenu(e, item.id)}
                          className="bg-[#00C7BE] text-white px-1 rounded w-[20px]"
                        >
                          {openSubmenus[item.id] ? "-" : "+"}
                        </button>
                      )}
                      <p className="text-gray-700 font-medium">{item.name}</p>
                    </div>
                  </div>
                  {item.children && openSubmenus[item.id] && renderSubMenu(item.children)}
                </div>
              ))}
          </div>
          <div className="px-10 py-2 flex absolute bottom-0 right-0 gap-2 mt-8">
            <button
              className="bg-blue-300 text-white px-3 rounded-md py-2"
              onClick={handleItemClick}
            >
              არჩევა
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NestedDropdownModal;
