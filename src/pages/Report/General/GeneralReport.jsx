import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout'
import ArrowDownIcon from '../../../assets/arrow-down-2.png'
import GeneralInputGroup from '../../../components/GeneralInputGroup'
import SearchButton from '../../../components/SearchButton'
import GeneralSelectGroup from '../../../components/GeneralSelectGroup'


const GeneralReport = () => {
    const data = [
        {
            id: 1,
            name: 'John Doe',
            department: 'Engineering',
            position: 'Software Engineer',
            date: '2024-07-02',
            arrivalTime: '09:00 AM',
            previousArrival: '08:45 AM',
            nextArrival: '09:15 AM',
            delayedMinutes: '15',
            departureTime: '06:00 PM',
            previousDeparture: '05:45 PM',
            nextDeparture: '06:15 PM',
            workingHours: '8',
            dayType: 'Weekday',
            weekday: 'Monday',
            overtimeMinutes: '30',
            overtimeHours: '0.5',
            schedule: 'Regular',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            id: 2,
            name: 'Jane Smith',
            department: 'Marketing',
            position: 'Marketing Specialist',
            date: '2024-07-02',
            arrivalTime: '08:30 AM',
            previousArrival: '08:15 AM',
            nextArrival: '08:45 AM',
            delayedMinutes: '15',
            departureTime: '05:30 PM',
            previousDeparture: '05:15 PM',
            nextDeparture: '05:45 PM',
            workingHours: '8',
            dayType: 'Weekday',
            weekday: 'Monday',
            overtimeMinutes: '0',
            overtimeHours: '0',
            schedule: 'Regular',
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        პერიოდის რეპორტი (ზოგადი)
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
                    <div className="min-w-max">
                        <div className="grid grid-cols-custom gap-2 bg-[#1976D2] text-white py-6 px-4 min-w-max">
                            <div>სახელი/გვარი</div>
                            <div>დეპარტამენტი</div>
                            <div>თანამდებობა</div>
                            <div>თარიღი</div>
                            <div>მოსვლის დრო</div>
                            <div>ადრე მოსვლა</div>
                            <div>გვიან მოსვლა</div>
                            <div>დაგვიანებული წუთები</div>
                            <div>წასვლის დრო</div>
                            <div>ადრე წასვლა</div>
                            <div>გვიან წასვლა</div>
                            <div>ნამუშევარი საათები</div>
                            <div>დღის ტიპი</div>
                            <div>კვირის დღე</div>
                            <div>საპატიო წუთები</div>
                            <div>საპატიო დრო</div>
                            <div>განრიგი</div>
                            <div>კომენტარი</div>
                        </div>
                        <div className="h-100 min-w-max">
                            {data.map((item) => (
                                <div key={item.id} className="grid grid-cols-custom gap-2 py-2 px-4 border-b min-w-max">
                                    <div>{item.name}</div>
                                    <div>{item.department}</div>
                                    <div>{item.position}</div>
                                    <div>{item.date}</div>
                                    <div>{item.arrivalTime}</div>
                                    <div>{item.previousArrival}</div>
                                    <div>{item.nextArrival}</div>
                                    <div>{item.delayedMinutes}</div>
                                    <div>{item.departureTime}</div>
                                    <div>{item.previousDeparture}</div>
                                    <div>{item.nextDeparture}</div>
                                    <div>{item.workingHours}</div>
                                    <div>{item.dayType}</div>
                                    <div>{item.weekday}</div>
                                    <div>{item.overtimeMinutes}</div>
                                    <div>{item.overtimeHours}</div>
                                    <div>{item.schedule}</div>
                                    <div>{item.comment}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default GeneralReport
