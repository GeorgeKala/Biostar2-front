import { useState, useEffect } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import NewIcon from '../../assets/new.png';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';
import DeleteIcon from '../../assets/delete.png';
import EditIcon from '../../assets/edit.png';
import buildingService from '../../services/building';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../redux/departmentsSlice';
import { fetchBuildings } from '../../redux/buildingSlice';

const DepartmentDistribution = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [selectedBuildingId, setSelectedBuildingId] = useState('');

    const dispatch = useDispatch();
    const buildings = useSelector(state => state.building.items);
    const { departments } = useSelector((state) => state.departments);

    useEffect(() => {
        fetchData();
        dispatch(fetchDepartments());
        dispatch(fetchBuildings());
    }, []);

    const fetchData = async () => {
        try {
            const response = await buildingService.getBuildingsWithDepartments();
            setData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleItemClick = (itemId, departmentId, buildingId) => {
        setSelectedItemId(itemId);
        setSelectedDepartmentId(departmentId);
        setSelectedBuildingId(buildingId);
    };

    const handleAddClick = () => {
        setShowModal(true);
        setSelectedItemId(null); // Reset selected item ID for create mode
        setSelectedDepartmentId('');
        setSelectedBuildingId('');
    };

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedDepartmentId('');
        setSelectedBuildingId('');
    };

    const handleAddDepartmentToBuilding = async () => {
        if (selectedDepartmentId && selectedBuildingId) {
          try {
            if (selectedItemId) {
              await buildingService.updateDepartmentBuilding(selectedBuildingId, selectedDepartmentId);
            } else {
              await buildingService.attachDepartment(selectedBuildingId, selectedDepartmentId);
            }
            setShowModal(false);
            setSelectedItemId(null);
            setSelectedDepartmentId('');
            setSelectedBuildingId('');
            fetchData(); // Refetch data to update UI
          } catch (error) {
            console.error('Error adding/editing department to building:', error);
          }
        }
      };

    const handleDelete = async () => {
        if (selectedDepartmentId && selectedBuildingId) {
            try {
                await buildingService.detachDepartment(selectedBuildingId, selectedDepartmentId);
                fetchData();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        დეპარტამენტების განაწილება
                    </h1>
                    <div className='flex items-center gap-8'>
                        <button className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleAddClick}>
                            <img src={NewIcon} alt="New Icon" />
                            New
                        </button>
                        <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleEditClick}>
                            <img src={EditIcon} alt="Edit Icon" />
                            Edit
                        </button>
                        <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2"  onClick={handleDelete}>
                            <img src={DeleteIcon} alt="Delete Icon" />
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
                        options={departments.map(dep => dep.name)}
                        value={selectedDepartmentId}
                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                    />
                    <SearchButton />
                </div>
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <div className="min-w-max">
                        <div className="grid grid-cols-2 gap-2 bg-[#1976D2] text-white py-6 px-4 min-w-max">
                            <div>შენობა</div>
                            <div>დეპარტამენტი</div>
                        </div>
                        <div className="h-100 min-w-max">
                            {data.map((item) => (
                                <div key={item.id} className={`grid grid-cols-2 gap-2 py-2 px-4 border-b min-w-max ${selectedItemId === item.id ? 'bg-gray-200' : ''}`} onClick={() => handleItemClick(item.id, item.department_id, item.building_id)}>
                                    <div>{item.building_name}</div>
                                    <div>{item.department_name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-lg font-medium mb-4">{selectedItemId ? 'რედაქტირება' : 'დამატება'} შენობების განაწილება</h2>
                        <div className="mb-4">
                            <label htmlFor="building_id" className="block text-sm font-medium text-gray-700">შენობა:</label>
                            <select
                                id="building_id"
                                name="building_id"
                                value={selectedBuildingId}
                                onChange={(e) => setSelectedBuildingId(e.target.value)}
                                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="">შენობა</option>
                                {buildings && buildings.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">დეპარტამენტი:</label>
                            <select
                                id="department_id"
                                name="department_id"
                                value={selectedDepartmentId}
                                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                                className="mt-1 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="">დეპარტამენტი</option>
                                {departments && departments.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleModalClose}>Cancel</button>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleAddDepartmentToBuilding}>{selectedItemId ? 'რედაქტირება' : 'დამატება'}</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default DepartmentDistribution;
