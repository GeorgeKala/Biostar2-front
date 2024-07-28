import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidays, selectHolidays, selectLoading, selectError } from '../redux/holidaySlice'

const MultiSelect = () => {
    const dispatch = useDispatch();
    const holidays = useSelector(selectHolidays);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        dispatch(fetchHolidays());
    }, [dispatch]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionToggle = (optionId) => {
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions(prevOptions => prevOptions.filter(item => item !== optionId));
        } else {
            setSelectedOptions(prevOptions => [...prevOptions, optionId]);
        }
    };

    const renderHolidays = () => {
        if (loading) {
            return <div>Loading holidays...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                {holidays.map(holiday => (
                    <div key={holiday.id}>
                        <input
                            type="checkbox"
                            id={holiday.id}
                            checked={selectedOptions.includes(holiday.id)}
                            onChange={(e) => handleOptionToggle(e.target.id)}
                        />
                        <label htmlFor={holiday.id}>{holiday.name}</label>
                    </div>
                ))}
            </div>
        );
    };

   

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
                        {renderHolidays()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
