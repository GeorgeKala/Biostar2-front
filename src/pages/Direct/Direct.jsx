import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import ArrowDownIcon from '../../assets/arrow-down-2.png';
import GeneralInputGroup from '../../components/GeneralInputGroup';
import GeneralSelectGroup from '../../components/GeneralSelectGroup';
import SearchButton from '../../components/SearchButton';
import directService from '../../services/direct';
import deviceService from '../../services/device';
import * as XLSX from 'xlsx';
const Direct = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [events, setEvents] = useState([]);

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
                const response = await directService.fetchEvents({ device_id: selectedDevice });
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
        events.map((item) => ({
            "გატარების დრო": item?.datetime,
            "თანამშრომელი": item?.employee_name,
            "დეპარტამენტი": item?.department,
            "სტატუსი": item?.employee_status,
            "მოწყობილობა": item?.device_name,
          }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "directs");
        XLSX.writeFile(workbook, "direct.xlsx");
      };

    return (
        <AuthenticatedLayout>
            <div className='w-full px-20 py-4 flex flex-col gap-8'>
                <div className="flex justify-between w-full">
                    <h1 className="text-[#1976D2] font-medium text-[23px]">
                        პირდაპირი
                    </h1>
                    <button onClick={exportToExcel} className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
                        ჩამოტვირთე
                        <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
                        <span className="absolute inset-0 border border-white border-dashed rounded"></span>
                    </button>
                </div>
                <div className='flex items-center gap-4'>
                    <select
                        value={selectedDevice}
                        onChange={handleDeviceSelect}
                        className="bg-white border border-[#105D8D] outline-none rounded-md py-3 px-4 "
                    >
                        <option value="">აირჩიე მოწყობილობა</option>
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchData}
                        className="bg-[#1976D2] text-white px-4 py-3 rounded-md flex items-center gap-2"
                    >
                        ჩართვა
                    </button>
                </div>
                <div className="container mx-auto mt-10 overflow-x-auto">
                    <div className="min-w-max">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
                            <thead className="bg-[#1976D2] text-white text-xs">
                                <tr>
                                    {["გატარების დრო", "თანამშრომელი", "დეპარტამენტი", "სტატუსი", "მოწყობილობა"].map((header) => (
                                        <th key={header} className="px-2 py-1 border border-gray-200 break-all w-20">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-xs">
                                {events.length > 0 && events?.map((item, index) => (
                                    <tr key={index} className={`px-2 py-1 border border-gray-200 w-20 `}>
                                        <td className="px-2 py-1 border border-gray-200 w-20">{item.datetime}</td>
                                        <td className="px-2 py-1 border border-gray-200 w-20">{item.employee_name}</td>
                                        <td className="px-2 py-1 border border-gray-200 w-20">{item.department}</td>
                                        <td className="px-2 py-1 border border-gray-200 w-20">{item.employee_status}</td>
                                        <td className="px-2 py-1 border border-gray-200 w-20">{item.device_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Direct;
