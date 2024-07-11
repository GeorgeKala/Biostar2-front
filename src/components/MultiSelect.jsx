import React, { useState } from 'react';

const MultiSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionToggle = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const options = [
        { id: 1, label: 'ორშაბათი' },
        { id: 2, label: 'სამშაბათი' },
        { id: 3, label: 'ოთხშაბათი' },
        { id: 4, label: 'ხუთშაბათი' },
        { id: 5, label: 'პარასკევი' },
        { id: 6, label: 'შაბათი' },
        { id: 7, label: 'კვირა' },
    ];

    console.log(selectedOptions)

    return (
        <div className="relative w-full flex flex-col gap-2">
            <label className='text-[#105D8D] font-medium'>დასვენების დღეები</label>
            <div className='relative'>
                <button
                    type="button"
                    className="w-full flex justify-between items-center relative bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 "
                    onClick={toggleDropdown}
                >
                    აირჩიე დასვენების დღეები
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <select name="" id=""></select>
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className=" w-full rounded-md bg-white shadow-lg">
                    <div className="flex flex-col flex-wrap p-2">
                        {options.map(option => (
                            <label key={option.id} className="inline-flex items-center w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    value={option.id}
                                    checked={selectedOptions.includes(option.id)}
                                    onChange={() => handleOptionToggle(option.id)}
                                />
                                <span className="ml-2">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
