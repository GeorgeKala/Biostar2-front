import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout'
import ArrowDownIcon from '../../../assets/arrow-down-2.png'
import GeneralInputGroup from '../../../components/GeneralInputGroup'
import SearchButton from '../../../components/SearchButton'
import GeneralSelectGroup from '../../../components/GeneralSelectGroup'


const GeneralReport = () => {
    const data = [
        { id: 1, name: 'John', firstname: 'Doe', lastname: 'Smith', age: 25, city: 'New York', email: 'john@example.com', phone: '123-456-7890', occupation: 'Engineer', group: 'Scientist' },
        { id: 2, name: 'Jane', firstname: 'Doe', lastname: 'Johnson', age: 28, city: 'Los Angeles', email: 'jane@example.com', phone: '234-567-8901', occupation: 'Designer', group: 'Scientist' },
        { id: 3, name: 'Alice', firstname: 'Doe', lastname: 'Brown', age: 23, city: 'Chicago', email: 'alice@example.com', phone: '345-678-9012', occupation: 'Teacher', group: 'Scientist' },
        { id: 4, name: 'Bob', firstname: 'Doe', lastname: 'Davis', age: 30, city: 'Houston', email: 'bob@example.com', phone: '456-789-0123', occupation: 'Doctor', group: 'Scientist' },
        { id: 5, name: 'Charlie', firstname: 'Doe', lastname: 'Wilson', age: 27, city: 'Phoenix', email: 'charlie@example.com', phone: '567-890-1234', occupation: 'Lawyer', group: 'Scientist' },
        { id: 6, name: 'Eve', firstname: 'Doe', lastname: 'Miller', age: 22, city: 'Philadelphia', email: 'eve@example.com', phone: '678-901-2345', occupation: 'Developer', group: 'Scientist' },
    
        { id: 7, name: 'Frank', firstname: 'Doe', lastname: 'Garcia', age: 32, city: 'San Antonio', email: 'frank@example.com', phone: '789-012-3456', occupation: 'Architect', group: 'Scientist' },
        { id: 8, name: 'Grace', firstname: 'Doe', lastname: 'Martinez', age: 26, city: 'Dallas', email: 'grace@example.com', phone: '890-123-4567', occupation: 'Nurse', group: 'Scientist' },
        { id: 9, name: 'Hank', firstname: 'Doe', lastname: 'Rodriguez', age: 29, city: 'San Diego', email: 'hank@example.com', phone: '901-234-5678', occupation: 'Pilot', group: 'Scientist' },
        { id: 10, name: 'Ivy', firstname: 'Doe', lastname: 'Hernandez', age: 24, city: 'San Jose', email: 'ivy@example.com', phone: '012-345-6789', occupation: 'Scientist', group: 'Scientist' },
    ];

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        თანამშრომლის დამატება/ცვლილება
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
                            <div className="grid grid-cols-9 gap-2 bg-[#1976D2] text-white py-6 px-4  min-w-max">
                                <div>თანამშრომელი</div>
                                <div>გატარების დრო</div>
                                <div>მოწყობილობა</div>
                                <div>ოპერაციის ტიპი</div>
                                <div>დეპარტამენტი</div>
                                <div>დაშვებულია</div>
                                <div>შენობის სახელი</div>
                                <div>თანამდებობა</div>
                                <div>ჯგუფი</div>
                               
                            </div>
                            <div className="h-100 min-w-max">
                                {data.map((item) => (
                                    <div key={item.id} className="grid grid-cols-9 gap-2 py-2 px-4 border-b min-w-max">
                                        <div>{item.name}</div>
                                        <div>{item.firstname}</div>
                                        <div>{item.lastname}</div>
                                        <div>{item.age}</div>
                                        <div>{item.city}</div>
                                        <div>{item.email}</div>
                                        <div>{item.phone}</div>
                                        <div>{item.occupation}</div>
                                        <div>{item.group}</div> 
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

export default GeneralReport
