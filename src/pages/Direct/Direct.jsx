import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import SearchIcon from '../../assets/search.png';
import * as XLSX from 'xlsx';
import directService from '../../services/direct';
import deviceService from '../../services/device';
import Table from '../../components/Table';
import { useFilter } from '../../hooks/useFilter';
import FilterModal from '../../components/FilterModal';
import { useFilterAndSort } from '../../hooks/useFilterAndSort';
import SearchButton from '../../components/SearchButton';

const Direct = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [events, setEvents] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterableData, setFilterableData] = useState([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [currentFilterField, setCurrentFilterField] = useState('');

  const {
    filteredAndSortedData: filteredEvents,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    sortConfig,
    filters
  } = useFilterAndSort(
    events,
    {
      datetime: { text: "", selected: [] },
      employee_name: { text: "", selected: [] },
      department: { text: "", selected: [] },
      employee_status: { text: "", selected: [] },
      device_name: { text: "", selected: [] },
    },
    { key: "", direction: "ascending" }
  );

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await deviceService.fetchDevices();
        setDevices(devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const fetchData = async () => {
    if (selectedDevice) {
      try {
        const response = await directService.fetchEvents({
          device_id: selectedDevice,
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    } else {
      console.error('No device selected');
    }
  };

  const handleDeviceSelect = (e) => {
    setSelectedDevice(e.target.value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEvents.map((item) => ({
        'გატარების დრო': item?.datetime,
        'თანამშრომელი': item?.employee_name,
        'დეპარტამენტი': item?.department,
        'სტატუსი': item?.employee_status,
        'მოწყობილობა': item?.device_name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'directs');
    XLSX.writeFile(workbook, 'direct.xlsx');
  };

  const handleOpenFilterModal = (data, fieldName, rect) => {
    const uniqueData = [...new Set(data)];
    setFilterableData(uniqueData);
    setIsFilterModalOpen(true);
    setModalPosition({ top: rect.bottom, left: rect.left - 240 });
    setCurrentFilterField(fieldName);
  };

  const tableHeaders = [
    {
      label: 'გატარების დრო',
      key: 'datetime',
      extractValue: (event) => event.datetime,
    },
    {
      label: 'თანამშრომელი',
      key: 'employee_name',
      extractValue: (event) => event.employee_name,
    },
    {
      label: 'დეპარტამენტი',
      key: 'department',
      extractValue: (event) => event.department,
    },
    {
      label: 'სტატუსი',
      key: 'employee_status',
      extractValue: (event) => event.employee_status,
    },
    {
      label: 'მოწყობილობა',
      key: 'device_name',
      extractValue: (event) => event.device_name,
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className='w-full px-10 py-4 flex flex-col gap-8'>
        <div className='flex justify-between w-full'>
          <h1 className='text-[#1976D2] font-medium text-[23px]'>პირდაპირი</h1>
          <button
            onClick={exportToExcel}
            className='bg-[#105D8D] px-7 py-2 rounded flex items-center gap-3 text-white text-[16px] border relative'
          >
            ჩამოტვირთე
            <span className='absolute inset-0 border border-white border-dashed rounded'></span>
          </button>
        </div>
        <div className='flex items-center gap-4'>
          <select
            value={selectedDevice}
            onChange={handleDeviceSelect}
            className='bg-white border border-[#105D8D] outline-none rounded-md py-2 px-4'
          >
            <option value=''>აირჩიე მოწყობილობა</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
          {/* <button
            onClick={fetchData}
            className='bg-[#1976D2] text-white px-4 py-3 rounded-md flex items-center gap-2'
          >
            ჩართვა
          </button> */}
          <SearchButton onClick={fetchData}></SearchButton>
        </div>
        <div className=' mt-10 overflow-x-auto'>
          <div>
            
          </div>
          <Table
            data={filteredEvents}
            headers={tableHeaders}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
            onFilterClick={handleOpenFilterModal}
            onFilterChange={handleFilterChange}
            filterableFields={[
              'datetime',
              'employee_name',
              'department',
              'employee_status',
              'device_name',
            ]}
          />
        </div>
        {isFilterModalOpen && (
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            filterableData={filterableData}
            onApply={(selectedFilters) =>
              applyModalFilters(currentFilterField, selectedFilters)
            }
            position={modalPosition}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default Direct;
