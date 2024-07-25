import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../../assets/arrow-down-2.png';
import GeneralInputGroup from '../../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../../components/GeneralSelectGroup';
import SearchIcon from '../../../assets/search.png';
import EmployeeModal from '../../../components/employee/EmployeeModal';
import { useState, useEffect } from 'react';
import commentService from '../../../services/comment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../../redux/departmentsSlice';
import { fetchForgiveTypes } from '../../../redux/forgiveTypeSlice';


const CommentTable = () => {
    const columns = ["თანამშრომელი", "დეპარტამენტი", "პატიების ტიპი", "მომხმარებელი", "ჩაწერის თარიღი", "კომენტარი"];
    const dispatch = useDispatch();
    const { departments } = useSelector((state) => state.departments);
    const forgiveTypeItems = useSelector((state) => state.forgiveTypes.forgiveTypes);

    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        department_id: '',
        forgive_type_id: '',
        employee_id: ''
    });

    const [details, setDetails] = useState([]);
    const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchDepartments());
        dispatch(fetchForgiveTypes());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value.trim()
        });
    };

    const handleSubmit = async (e) => {
        const data = {};
    
        if (filters.start_date) {
            data.start_date = filters.start_date;
        }
    
        if (filters.end_date) {
            data.end_date = filters.end_date;
        }
    
        if (filters.department_id) {
            data.department_id = filters.department_id;
        }
    
        if (filters.forgive_type_id) {
            data.forgive_type_id = filters.forgive_type_id;
        }
    
    
        if (filters.employee_id) {
            data.employee_id = filters.employee_id;
        }
    
        e.preventDefault();
        try {
            const response = await commentService.fetchCommentedDetails(data);
            setDetails(response.records);
        } catch (error) {
            console.error('Error fetching commented details:', error);
        }
    };

    const openModal = () => {
        setEmployeeModalOpen(true);
    };

    const closeModal = () => {
        setEmployeeModalOpen(false);
    };

    const handleEmployeeSelect = (employee) => {
        setFilters({
            ...filters,
            employee_id: employee.id,
            employee: employee.fullname
        });
    };

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        კომენტარების ცხრილი
                    </h1>
                    <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
                        Download Data
                        <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
                        <span className="absolute inset-0 border border-white border-dashed rounded"></span>
                    </button>
                </div>
                <div className='flex items-center gap-4'>
                    <GeneralInputGroup
                        name="start_date"
                        placeholder="Start Date"
                        type="date"
                        value={filters.start_date}
                        onChange={handleInputChange}
                    />
                    <GeneralInputGroup
                        name="end_date"
                        placeholder="End Date"
                        type="date"
                        value={filters.end_date}
                        onChange={handleInputChange}
                    />
                    <div className="w-full flex flex-col gap-2">
                        <select
                            id="department_id"
                            name="department_id"
                            value={filters.department_id}
                            onChange={handleInputChange}
                            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
                        >
                            <option value="">აირჩიეთ დეპარტამენტი</option>
                            {departments &&
                                departments.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <select
                            id="forgive_type_id"
                            name="forgive_type_id"
                            value={filters.forgive_type_id}
                            onChange={handleInputChange}
                            className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 w-full"
                        >
                            <option value="">აირჩიეთ პატიების ტიპი</option>
                            {forgiveTypeItems &&
                                forgiveTypeItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div onClick={openModal} className='w-full'>
                        <GeneralInputGroup
                            name="employee"
                            placeholder="თანამშრომელი"
                            type="text"
                            value={filters.employee}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className='bg-[#1AB7C1] rounded-lg px-8 py-4' onClick={handleSubmit}>
                        <img src={SearchIcon} className='w-[100px]' alt="Search Icon" />
                    </button>
                </div>
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <div className="min-w-max">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
                            <thead className="bg-[#1976D2] text-white">
                                <tr>
                                    {columns.map((header) => (
                                        <th key={header} className="px-4 py-2 border border-gray-200 w-1/6 truncate">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {details && details.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.employee}</td>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.department}</td>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.forgive_type}</td>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.user}</td>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.created_at}</td>
                                        <td className="px-4 py-2 border border-gray-200 w-1/6 truncate">{item.comment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <EmployeeModal
                isOpen={employeeModalOpen}
                onClose={closeModal}
                onSelectEmployee={handleEmployeeSelect}
            />
        </AuthenticatedLayout>
    );
};

export default CommentTable;




