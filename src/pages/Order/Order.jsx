import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import CustomTable from '../../components/CustomTable';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';

const Order = () => {
    const data = [
        {
            id: 1,
            date: '22-12-2023',
            employer: 'john ss',
            Department: 'Lorem ipsum dolor sit amet',
            user: 'John Doe',
            violation_type: 'Type A',
        },
        {
            id: 2,
            date: '11-12-2022',
            employer: 'james',
            Department: 'Lorem ipsum dolor sit amet',
            user: 'John Doe',
            violation_type: 'Type B',
        },
    ];

    const columns = [
        { label: "თარიღი", key: "date" },
        { label: "თანამშრომელი", key: "employer" },
        { label: "დეპარტამენტი", key: "Department" },
        { label: "მომხმარებელი", key: "user" },
        { label: "ბრძანების ტიპი", key: "violation_type" }
    ];

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
                    <SearchButton></SearchButton>
                </div>
                <CustomTable
                    columns={columns}
                    data={data}
                />
            </div>
        </AuthenticatedLayout>
    )
}

export default Order;