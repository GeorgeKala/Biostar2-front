import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import CustomTable from '../../components/CustomTable';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';

const Direct = () => {
   
    const data = [
        {
            id: 1,
            elapsed_minutes: '120',
            allowances: 'Yes',
            comments: 'Lorem ipsum dolor sit amet',
            user: 'John Doe',
            violation_type: 'Type A',
        },
        {
            id: 2,
            elapsed_minutes: '90',
            allowances: 'No',
            comments: 'Lorem ipsum dolor sit amet',
            user: 'Jane Smith',
            violation_type: 'Type B',
        },
    ];

    const columns = [
        { label: "გაცდენილი წუთები", key: "elapsed_minutes" },
        { label: "პატიება", key: "allowances" },
        { label: "კომენტარი", key: "comments" },
        { label: "მომხმარებელი", key: "user" },
        { label: "დარღვევის ტიპი", key: "violation_type" }
    ];

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        პირდაპირი
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

export default Direct;