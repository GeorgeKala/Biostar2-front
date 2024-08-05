import React, { useState } from 'react';



const NestedDropdownModal = ({ isOpen, onClose, onSelect, data, header, link }) => {
  const [selectedItem, setSelectedItem] = useState({});

  const toggleSubMenu = (e) => {
    e.stopPropagation();
    const submenu = e.currentTarget.querySelector('ul');
    if (!submenu) return;
    submenu.style.display = submenu.style.display === 'none' || submenu.style.display === '' ? 'block' : 'none';
  };

  const renderSubMenu = (subMenu, level = 1) => (
    <ul className={`ml-10 hidden`}>
      {subMenu.map((subItem, index) => (
        <li  key={index} onClick={toggleSubMenu} className="cursor-pointer">
          <div onClick={() => setSelectedItem(subItem)}  className={`flex justify-between items-center mb-2 border-b py-2 border-black ${selectedItem.id === subItem.id ? "bg-blue-300": ""}`}>
            <div className="flex items-center gap-2 text-sm">
              {subItem?.children?.length > 0 && (
                <button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px]">+</button>
              )}
              <p className="text-gray-700 font-medium">{subItem.name}</p>
            </div>
          </div>
          {subItem?.children && renderSubMenu(subItem?.children, level + 1)}
        </li>
      ))}
    </ul>
  );


  const handleItemClick = () => {
    onSelect(selectedItem.id, selectedItem.name);
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col bg-white w-1/2 h-[80%] rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="px-10 rounded-t-md py-2 bg-[#1976D2] flex justify-between w-full mb-10">
          <h1 className="rounded-md font-medium text-[23px] text-white">{header}</h1>
          <button onClick={onClose} className="hover:text-gray-200 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto" >
          {data && data.map((item, index) => (
            <div key={index} onClick={toggleSubMenu} className="cursor-pointer">
              <div onClick={() => setSelectedItem(item)} className={`flex justify-between items-center border-b py-2 border-black ${selectedItem.id === item.id ? "bg-blue-300": ""}`}>
                <div className="flex items-center gap-2 text-sm">
                  {item?.children?.length > 0 && (
                    <button className="bg-[#00C7BE] text-white px-1 rounded py-[0.2px] z-100">+</button>
                  )}
                  <p className="text-gray-700 font-medium">{item.name}</p>
                </div>
              </div>
              {item.children && renderSubMenu(item.children)}
            </div>
          ))}
        </div>
        <div className='px-10 py-2 flex justify-end gap-2 mt-8'>
          <button className='bg-blue-300 text-white px-3 rounded-md py-2' onClick={handleItemClick}>არჩევა</button>
          {/* <Link to={link} className='bg-blue-300 text-white px-3 rounded-md py-2'>სრულად</Link> */}
        </div>
      </div>
    </div>
  );
};

export default NestedDropdownModal;
