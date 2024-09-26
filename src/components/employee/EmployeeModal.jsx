import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, clearEmployees } from '../../redux/employeeSlice';

const EmployeeModal = ({ isOpen, onClose, onSelectEmployee }) => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.items);
    const hasMore = useSelector((state) => state.employees.hasMore);
    const status = useSelector((state) => state.employees.status);
    
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
    const [page, setPage] = useState(1);
    const observer = useRef();
    const debounceRef = useRef();

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchEmployees({ ...filters, page }));
        }
    }, [isOpen, filters, page, dispatch]);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(clearEmployees());
            dispatch(fetchEmployees({ ...filters, page: 1 })); 
        }, 500);
    };

    const lastEmployeeRef = useCallback((node) => {
        if (status === 'loading' || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [status, hasMore]);

    const handleRowClick = (employee) => {
        onSelectEmployee(employee);
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white w-11/12 h-5/6 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg overflow-hidden">
                <div className="flex justify-between items-center bg-[#1976D2] p-4">
                    <h2 className="text-white text-lg">თანამშრომლები</h2>
                    <button className="text-white text-lg" onClick={onClose}>&times;</button>
                </div>
                <div className="overflow-hidden h-[calc(100%-64px)]">
                    <div className="overflow-auto h-full max-h-[calc(100%-64px)]"> 
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr className="bg-[#1976D2] text-white">
                                    {[
                                        { label: "გვარი/სახელი", key: "fullname" },
                                        { label: "დეპარტამენტი", key: "department.name" },
                                        { label: "პოზიცია", key: "position" },
                                        { label: "პირადი", key: "personal_id" },
                                        { label: "ტელეფონის ნომერი", key: "phone_number" },
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
                                                autoComplete='off'
                                                type="text"
                                                name={header.key}
                                                className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-custom font-normal text-xs"
                                                value={filters[header.key]}
                                                onChange={handleFilterChange}
                                                placeholder={`შეიყვანე ${header.label}`}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee, index) => (
                                    <tr 
                                        className='cursor-pointer hover:bg-gray-100 transition duration-200' 
                                        key={employee.id} 
                                        ref={index === filteredEmployees.length - 1 ? lastEmployeeRef : null} 
                                        onClick={() => handleRowClick(employee)}
                                    >
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee.fullname}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.department}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.position}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.personal_id}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.phone_number}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.card_number}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.expiry_datetime ? "შეჩერებულია" : "აქტიურია"}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.user?.name}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.group}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.schedule}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">{employee?.honorable_minutes_per_day}</td>
                                        <td className="border px-2 py-1 w-1/12 truncate text-xs">
                                            {employee.holidays && employee.holidays.map((item, idx) => (
                                                <span key={idx} className="truncate">{item}{idx < employee.holidays.length - 1 ? ', ' : ''}</span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {status === 'loading' && <div className="text-center py-2">Loading...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;
