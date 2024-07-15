import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEmployees, deleteEmployee } from '../../../redux/employeeSlice';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../../assets/arrow-down-2.png';
import NewIcon from '../../../assets/new.png';
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import GeneralInputGroup from '../../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../../components/GeneralSelectGroup';
import SearchButton from '../../../components/SearchButton';
import EmployeeEditModal from '../../../components/EmployeeEditModal';

const CreatedEmployees = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.items);
    const status = useSelector((state) => state.employees.status);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [expandedCell, setExpandedCell] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Fetch employees when component mounts or status changes to 'idle'
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [status, dispatch]);

    // Render loading indicator while fetching data
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    // Handle click event to select/unselect an employee
    const handleClick = (employee) => {
        setSelectedEmployee(selectedEmployee === employee ? null : employee);
    };

    // Handle double click event to expand/collapse a table row
    const handleDoubleClick = (index) => {
        setExpandedCell(index === expandedCell ? null : index);
    };

    // Handle delete button click to delete selected employee
    const handleDelete = () => {
        if (selectedEmployee) {
            dispatch(deleteEmployee(selectedEmployee.id)).then(() => {
                setSelectedEmployee(null);
            });
        }
    };

    // Open edit modal with selected employee data
    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setEditModalOpen(true);
    };

    // Close edit modal and reset selected employee state
    const closeEditModal = () => {
        setSelectedEmployee(null);
        setEditModalOpen(false);
    };

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        თანამშრომლები
                    </h1>
                    <div className='flex items-center gap-8'>
                        <Link to='/employees/create' className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={NewIcon} alt="New Icon" />
                            New
                        </Link>
                        <button onClick={() => openEditModal(selectedEmployee)} className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={EditIcon}  alt="Edit" />
                            Edit
                        </button>
                        <button onClick={handleDelete} className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={DeleteIcon} alt="Delete" />
                            Delete
                        </button>
                        <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
                            Download Data
                            <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
                            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
                        </button>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <GeneralInputGroup
                        name="employee"
                        placeholder="თანამშრომელი"
                        type="text"
                    />
                    <GeneralSelectGroup
                        label="დეპარტამენტი"
                        options={["Option 1", "Option 2", "Option 3"]}
                    />
                    <SearchButton />
                </div>
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 table-auto">
                        <thead>
                            <tr className="bg-[#1976D2] text-[13px] font-normal text-white py-6 px-4 border-b border-gray-300">
                                <th className='text-center border-r border-gray-300'>სახელი/გვარი</th>
                                <th className='text-center border-r border-gray-300'>დეპარტამენტი</th>
                                <th className='text-center border-r border-gray-300'>პოზიცია</th>
                                <th className='text-center border-r border-gray-300'>პირადი ნომერი</th>
                                <th className='text-center border-r border-gray-300'>phone</th>
                                <th className='text-center border-r border-gray-300'>ბარათის ნომერი</th>
                                <th className='text-center border-r border-gray-300'>სტატუსი</th>
                                <th className='text-center border-r border-gray-300'>მომხმარებელი</th>
                                <th className='text-center border-r border-gray-300'>ჯგუფი</th>
                                <th className='text-center border-r border-gray-300'>განრიგი</th>
                                <th className='text-center'>საპატიო წუთები</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleClick(employee)}
                                    onDoubleClick={() => handleDoubleClick(index)}
                                    className={`text-center ${selectedEmployee && selectedEmployee.id === employee.id ? 'bg-blue-200' : ''}`}
                                >
                                    <td className={`text-center py-2 px-4 border-r border-gray-300 whitespace-normal ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>
                                        <input
                                            type="text"
                                            value={employee.fullname}
                                            className="w-full bg-transparent outline-none"
                                            readOnly
                                        />
                                    </td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.department?.name}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.position}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.personal_id}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.phone_number}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.card_number}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>შეჩერებული</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>" "</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.group?.name}</td>
                                    <td className={`py-2 px-4 border-r border-gray-300 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.schedule?.name}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.honorable_minutes_per_day}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editModalOpen && (
                <EmployeeEditModal
                    employee={selectedEmployee}
                    isOpen={editModalOpen}
                    closeModal={closeEditModal}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default CreatedEmployees;
