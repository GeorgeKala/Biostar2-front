import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/employeeSlice';

const EmployeeModal = ({ isOpen, onClose, onSelectEmployee }) => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.items);
    
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [filters, setFilters] = useState({
        fullname: '',
        department: '',
        position: '',
        personal_id: '',
        phone_number: '',
        card_number: '',
        status: '',
        user: '',
        group: '',
        schedule: '',
        honorable_minutes_per_day: '',
        holidays: ''
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchEmployees());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    useEffect(() => {
        filterEmployees();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((value, key) => value && value[key], obj);
    };

    const filterEmployees = () => {
        const filtered = employees.filter(employee => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                const value = getNestedValue(employee, key);
                return value?.toString().toLowerCase().includes(filters[key].toLowerCase());
            });
        });
        setFilteredEmployees(filtered);
    };

    const handleRowClick = (employee) => {
        onSelectEmployee(employee);
        onClose();
    };


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white w-11/12 h-5/6 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex justify-between items-center bg-[#1976D2] p-4 rounded-t-md">
                    <h2 className="text-white text-lg">თანამშრომლები</h2>
                    <button className="text-white text-lg" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="overflow-auto">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr className="bg-[#1976D2] text-white">
                                {[
                                    { label: "სახელი", key: "fullname" },
                                    { label: "დეპარტამენტი", key: "department.name" },
                                    { label: "პოზიცია", key: "position" },
                                    { label: "პირადი", key: "personal_id" },
                                    { label: "phone", key: "phone_number" },
                                    { label: "ბარათის ნომერი", key: "card_number" },
                                    { label: "სტატუსი", key: "expiry_datetime" },
                                    { label: "მომხმარებელი", key: "user" },
                                    { label: "ჯგუფი", key: "group.name" },
                                    { label: "განრიგი", key: "schedule.name" },
                                    { label: "საპატიო დრო", key: "honorable_minutes_per_day" },
                                    { label: "დასვენების დღე", key: "holidays" }
                                ].map(header => (
                                    <th key={header.key} className="border w-1/12">
                                        <span className="truncate text-xs">{header.label}</span>
                                        <input
                                            type="text"
                                            name={header.key}
                                            className="w-full px-1 text-black outline-none placeholder-custom"
                                            value={filters[header.key]}
                                            onChange={handleFilterChange}
                                            placeholder={`შეიყვანე ${header.label}`}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} onClick={() => handleRowClick(employee)}>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee.fullname}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.department?.name}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.position}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.personal_id}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.phone_number}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.card_number}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.expiry_datetime ? "შეჩერებულია" : "აქტიურია"}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.user?.name}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.group?.name}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.schedule?.name}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.honorable_minutes_per_day}</td>
                                    <td className="border px-2 py-1 w-1/12 truncate text-xs">
                                        {employee.holidays && employee.holidays.map((item, idx) => (
                                            <span key={idx} className="truncate">{item.name}, </span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;