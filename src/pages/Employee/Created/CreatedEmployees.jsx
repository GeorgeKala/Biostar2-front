import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../../assets/arrow-down-2.png';
import NewIcon from '../../../assets/new.png';
import GeneralInputGroup from '../../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../../components/GeneralSelectGroup';
import SearchButton from '../../../components/SearchButton';
import employeeService from "../../../services/employee";
import { Link } from 'react-router-dom';
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";

const CreatedEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeeService.getAllEmployees();
                setEmployees(data)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };
    

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        თანამშრომლები
                    </h1>
                    <div className='flex items-center gap-8'>
                        <Link to='/employees/create'  className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={NewIcon} alt="New Icon" />
                            New
                        </Link>
                        <Link to={`/employees/edit/${selectedId}`} className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <img src={EditIcon} alt="Edit" />
                            Edit
                        </Link>
                        <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
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
                    <div className="min-w-max">
                        <div className="grid grid-cols-11 gap-2 bg-[#1976D2] text-white py-6 px-4">
                            <div className="col-span-1">სახელი/გვარი</div>
                            <div className="col-span-1">დეპარტამენტი</div>
                            <div className="col-span-1">პოზიცია</div>
                            <div className="col-span-1">პირადი ნომერი/ID</div>
                            <div className="col-span-1">ტელეფონის ნომერი</div>
                            <div className="col-span-1">ბარათის ნომერი</div>
                            <div className="col-span-1">სტატუსი</div>
                            <div className="col-span-1">მომხმარებელი</div>
                            <div className="col-span-1">ჯგუფი</div>
                            <div className="col-span-1">განრიგი</div>
                            <div className="col-span-1">საპატიო წუთები</div>
                        </div>
                    </div>

                    <div className="h-100 min-w-max">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                onClick={() => handleClick(employee.id)}
                                className={`grid grid-cols-11 gap-2 py-2 px-4 border-b min-w-max ${selectedId === employee.id ? 'bg-blue-200' : ''}`}
                            >
                                <div className="col-span-1 overflow-hidden overflow-ellipsis whitespace-nowrap">{employee.fullname}</div>
                                <div className="col-span-1">{employee?.department?.name}</div>
                                <div className="col-span-1">{employee.position}</div>
                                <div className="col-span-1">{employee.personal_id}</div>
                                <div className="col-span-1">{employee.phone_number}</div>
                                <div className="col-span-1">{employee.card_number}</div>
                                <div className="col-span-1">შეჩერებული</div>
                                <div className="col-span-1">" "</div>
                                <div className="col-span-1">{employee?.group?.name}</div>
                                <div className="col-span-1">{employee?.schedule?.name}</div>
                                <div className="col-span-1">{employee.honorable_minutes_per_day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatedEmployees;
