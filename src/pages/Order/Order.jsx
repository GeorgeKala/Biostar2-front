import React, { useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import CustomTable from '../../components/CustomTable';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import SearchIcon from '../../assets/search.png';
import orderService from '../../services/order';

const Order = () => {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        employee_id: '',
        department_id: '',
        
    });

    const [data, setData] = useState([]);

    const columns = [
        { label: "თარიღი", key: "date" },
        { label: "თანამშრომელი", key: "employer" },
        { label: "დეპარტამენტი", key: "Department" },
        { label: "ბრძანების ტიპი", key: "violation_type" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const payload = Object.fromEntries(
        //     Object.entries(filters).filter(([_, value]) => value)
        // );

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

        try {
            const response = await orderService.fetchEmployeeOrders(payload);
            setData(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        ბრძანებები
                    </h1>
                    <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
                        Download Data
                        <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
                        <span className="absolute inset-0 border border-white border-dashed rounded"></span>
                    </button>
                </div>
                <form className='flex items-center gap-4' onSubmit={handleSubmit}>
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
                    <GeneralInputGroup
                        name="employee"
                        placeholder="თანამშრომელი"
                        type="text"
                        value={filters.employee}
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
                            {/* Replace with actual department options */}
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                    </div>
                    <button className='bg-[#1AB7C1] rounded-lg px-6 py-4' type="submit">
                        <img src={SearchIcon} className='w-[100px]' alt="Search Icon" />
                    </button>
                </form>
                <CustomTable
                    columns={columns}
                    data={data}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Order;
