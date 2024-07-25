import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout'
import ArrowDownIcon from '../../../assets/arrow-down-2.png'
import GeneralInputGroup from '../../../components/GeneralInputGroup'
import SearchButton from '../../../components/SearchButton'
import GeneralSelectGroup from '../../../components/GeneralSelectGroup'


const CommentAnalyze = () => {
    const columns = ["გაცდენილი წუთები", "პატიება", "კომენტარი", "მომხმარებელი", "დარღვევის ტიპი"];
    
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

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        კომენტარების ანალიზი
                    </h1>
                    <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
                        Download Data
                        <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon"/>
                        <span className="absolute inset-0 border border-white border-dashed rounded"></span>
                    </button>
                </div>
                <div className='flex items-center gap-4'>
                    <GeneralInputGroup
                        name="date"
                        placeholder="date"
                        type="date"
                    />
                    <GeneralSelectGroup
                        label="დეპარტამენტი"
                        options={["Option 1", "Option 2", "Option 3"]}
                    />
                    <GeneralSelectGroup
                        label="პატიების ტიპი"
                        options={["Option 1", "Option 2", "Option 3"]}
                    />
                    <GeneralInputGroup
                        name="employee"
                        placeholder="თანამშრომელი"
                        type="text"
                    />
                    <SearchButton></SearchButton>
                </div>
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <div>
                        <div className="min-w-max">
                            <div className="grid grid-cols-5 gap-2 bg-[#1976D2] text-white py-6 px-4  min-w-max">
                                <div>გაცდენილი წუთები</div>
                                <div>პატიება</div>
                                <div>კომენტარი</div>
                                <div>მომხმარებელი</div>
                                <div>დარღვევის ტიპი</div>
                            </div>
                            <div className="h-100 min-w-max">
                                {data.map((item) => (
                                    <div key={item.id} className="grid grid-cols-5 gap-2 py-2 px-4 border-b min-w-max">
                                        <div>{item.elapsed_minutes}</div>
                                        <div>{item.allowances}</div>
                                        <div>{item.comments}</div>
                                        <div>{item.user}</div>
                                        <div>{item.violation_type}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default CommentAnalyze