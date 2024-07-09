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

const CreatedEmployees = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.items);
    const status = useSelector((state) => state.employees.status);
    const [selectedId, setSelectedId] = useState(null);
    const [expandedCell, setExpandedCell] = useState(null);
    
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    const handleClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    const handleDoubleClick = (index) => {
        setExpandedCell(index === expandedCell ? null : index);
    };

    const handleDelete = () => {
        if (selectedId) {
            dispatch(deleteEmployee(selectedId)).then(() => {
                setSelectedId(null);
            });
        }
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
                        <Link to={`/employees/edit/${selectedId}`} className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={EditIcon} alt="Edit" />
                            Edit
                        </Link>
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
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#1976D2] text-[13px] font-normal text-white py-6 px-4">
                                <th>სახელი/გვარი</th>
                                <th>დეპარტამენტი</th>
                                <th>პოზიცია</th>
                                <th>პირადი ნომერი</th>
                                <th>phone</th>
                                <th>ბარათის ნომერი</th>
                                <th>სტატუსი</th>
                                <th>მომხმარებელი</th>
                                <th>ჯგუფი</th>
                                <th>განრიგი</th>
                                <th>საპატიო წუთები</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleClick(employee.id)}
                                    onDoubleClick={() => handleDoubleClick(index)}
                                    className={`border-b ${selectedId === employee.id ? 'bg-blue-200' : ''}`}
                                >
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.fullname}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.department?.name}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.position}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.personal_id}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.phone_number}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.card_number}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>შეჩერებული</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>" "</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.group?.name}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee?.schedule?.name}</td>
                                    <td className={`py-2 px-4 ${expandedCell === index ? 'expanded-cell' : 'truncate-cell'}`}>{employee.honorable_minutes_per_day}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatedEmployees;
