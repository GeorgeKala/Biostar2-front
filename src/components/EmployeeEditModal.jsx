import React, { useEffect, useState } from "react";
import InputGroup from "./employee/InputGroup";
import departmentService from "../services/department";
import groupService from "../services/group";
import scheduleService from "../services/schedule";
import employeeService from "../services/employee";
import { useDispatch, useSelector } from "react-redux";
import { fetchHolidays, selectHolidays } from "../redux/holidaySlice";
import deviceService from "../services/device";


const EmployeeEditModal = ({ employee, isOpen, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    fullname: employee.fullname,
    personal_id: employee.personal_id,
    phone_number: employee.phone_number,
    department_id: employee.department.id,
    start_datetime: employee.start_datetime,
    expiry_datetime: employee.expiry_datetime,
    position: employee.position,
    group_id: employee.group.id,
    schedule_id: employee.schedule.id,
    honorable_minutes_per_day: employee.honorable_minutes_per_day,
    device_id: employee?.device?.id,
    card_number: employee.card_number,
    checksum: employee.checksum,
    session_id: sessionStorage.getItem('sessionToken'),
    holidays: employee.holidays.map(holiday => holiday.id)
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const dispatch = useDispatch();
  const holidays = useSelector(selectHolidays);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("")
  const [isOpenSelected, setIsOpenSelected] = useState(false);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, groupsData, schedulesData] = await Promise.all([
          departmentService.getAllDepartments(),
          groupService.getAllGroups(),
          scheduleService.getAllSchedules(),
        ]);
        setDepartments(departmentsData);
        setGroups(groupsData);
        setSchedules(schedulesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "fullname" && !value) {
      error = "სახელი/გვარი აუცილებელია";
    } else if (name === "personal_id" && !value) {
      error = "პირადი ნომერი აუცილებელია";
    } else if (name === "phone_number" && !value) {
      error = "ტელეფონის ნომერი აუცილებელია";
    } else if (name === "checksum" && !value) {
      error = "საკონტროლო ჯამი აუცილებელია";
    } else if (name === "card_number" && !value) {
      error = "ბარათის ნომერი აუცილებელია";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
  
    Object.keys(formData).forEach((field) => {
      // Skip validation for device_id
      if (field === "device_id") return;
  
      validateField(field, formData[field]);
      if (
        !formData[field] &&
        field !== "expiry_datetime" &&
        field !== "device"
      ) {
        newErrors[field] = `${georgianLabels[field]} მითითება აუცილებელია`;
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      await employeeService.updateEmployee(employee.id, formData);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          if (field === "personal_id" && apiErrors[field].length > 0) {
            newErrors[field] = "ასეთი პირადი ნომრით თანამშრომელი უკვე არსებობს";
          } else {
            newErrors[field] = apiErrors[field][0];
          }
        });
        setErrors(newErrors);
      } else {
        console.error("Error updating employee:", error);
      }
    }
  };

  const georgianLabels = {
    fullname: "სახელი/გვარი",
    personal_id: "პირადი ნომერი",
    phone_number: "ტელეფონის ნომერი",
    department_id: "დეპარტამენტი",
    start_datetime: "დაწყების დრო",
    expiry_datetime: "გათავისუფლების დრო",
    position: "პოზიცია",
    group_id: "ჯგუფი",
    schedule_id: "განრიგი",
    honorable_minutes_per_day: "საპატიო წუთები",
    device: "მოწყობილობა",
    card_number: "ბარათის ნომერი",
    checksum: "საკონტროლო ჯამი",
  };

console.log(errors);
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await deviceService.fetchDevices()
      setDevices(devices)
    }

    fetchDevices()
  },[])


  const handleDeviceSelect = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId); 
    const updatedFormData = {
      ...formData,
      device_id: deviceId
    };

    setFormData(updatedFormData)
  };

  const handleScanCard = async () => {
    const scanResult = await deviceService.scanCard(selectedDevice);

    const updatedFormData = {
      ...formData,
      card_number: scanResult.Card.card_id,
      display_card_id: scanResult.Card.display_card_id
    };

    setFormData(updatedFormData);
    
  }


  const toggleDropdown = () => {
    setIsOpenSelected(!isOpenSelected);
  };

  const handleOptionToggle = (optionId) => {
    if (formData.holidays.includes(optionId)) {
      setFormData(prevData => ({
        ...prevData,
        holidays: prevData.holidays.filter(item => item !== optionId)
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        holidays: [...prevData.holidays, optionId]
      }));
    }
  };


  const renderSelectedHolidays = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {holidays.length > 0 ? (
          holidays.map((holiday) => (
            <div key={holiday.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`holiday-${holiday.id}`}
                checked={formData.holidays.includes(holiday.id)}
                onChange={() => handleOptionToggle(holiday.id)}
              />
              <label htmlFor={`holiday-${holiday.id}`}>{holiday.name}</label>
            </div>
          ))
        ) : (
          <p>No holidays available</p>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div className="bg-white w-1/2 p-4 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#1976D2] font-medium text-[23px]">თანამშრომლის ცვლილება</h2>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="currentColor" d="M18.364 5.636a.999.999 0 0 0-1.414 0L12 10.586 7.05 5.636a.999.999 0 1 0-1.414 1.414L10.586 12l-4.95 4.95a.999.999 0 1 0 1.414 1.414L12 13.414l4.95 4.95a.999.999 0 1 0 1.414-1.414L13.414 12l4.95-4.95c.39-.39.39-1.023 0-1.414z"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-8">
            <InputGroup
                label="სახელი/გვარი"
                name="fullname"
                value={formData.fullname}
                onChange={handleInput}
                error={errors.fullname}
            />
            <InputGroup
                label="პირადი ნომერი"
                name="personal_id"
                value={formData.personal_id}
                onChange={handleInput}
                error={errors.personal_id}
            />
        </div>
        <div className="flex justify-between gap-8">
            <InputGroup
                label="ტელეფონის ნომერი"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInput}
                error={errors.phone_number}
            />
            <div className="w-full flex flex-col gap-2">
                <label className="text-[#105D8D] font-medium">დეპარტამენტი</label>
                <select
                    id="department_id"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInput}
                    className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
                >
                    <option value="">აირჩიეთ დეპარტამენტი</option>
                    {departments &&
                    departments.map((department) => (
                        <option key={department.id} value={department.id}>
                        {department.name}
                        </option>
                    ))}
                </select>
                {errors.department_id && (
                    <p className="text-red-500 text-sm">{errors.department_id}</p>
                )}
                </div>
        </div>
        <div className="flex justify-between gap-8">
            <InputGroup
              label="დაწყების დრო"
              name="start_datetime"
              placeholder="დაწყების დრო"
              type="date"
              value={formData.start_datetime}
              onChange={handleInput}
              error={errors.start_datetime}
            />
            <InputGroup
              label="გათავისუფლების დრო"
              name="expiry_datetime"
              placeholder="გათავისუფლების დრო"
              type="date"
              value={formData.expiry_datetime}
              onChange={handleInput}
              error={errors.expiry_datetime}
            />
          </div>
        <div className="flex justify-between gap-8">
        <InputGroup
            label="პოზიცია"
            name="position"
            value={formData.position}
            onChange={handleInput}
            error={errors.position}
          />
        <div className="w-full flex flex-col gap-2">
            <label className="text-[#105D8D] font-medium">ჯგუფი</label>
            <select
                id="group_id"
                name="group_id"
                value={formData.group_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
            >
                <option value="">აირჩიეთ ჯგუფი</option>
                {groups &&
                groups.map((item) => (
                    <option key={item.id} value={item.id}>
                    {item.name}
                    </option>
                ))}
            </select>
            {errors.group_id && (
                <p className="text-red-500 text-sm">{errors.group_id}</p>
            )}
        </div>
        </div>
        <div className="flex justify-between gap-8">
            <InputGroup
                label="საპატიო წუთები"
                name="honorable_minutes_per_day"
                value={formData.honorable_minutes_per_day}
                onChange={handleInput}
                error={errors.honorable_minutes_per_day}
            />
            <div className="w-full flex flex-col gap-2">
                <label className="text-[#105D8D] font-medium">გრაფიკი</label>
                <select
                id="schedule_id"
                name="schedule_id"
                value={formData.schedule_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
                >
                <option value="">აირჩიეთ გრაფიკი</option>
                {schedules &&
                    schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                        {schedule.name}
                    </option>
                    ))}
                </select>
                {errors.schedule_id && (
                <p className="text-red-500 text-sm">{errors.schedule_id}</p>
                )}
            </div>
        </div>
        <div className="flex justify-between gap-8">
          <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">აირჩიე მოწყობილობა</label>
              <select
                value={selectedDevice} 
                onChange={handleDeviceSelect}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
                
              >
                <option value="">აირჩიე მოწყობილობა</option>
                {devices &&
                  devices.map((item) => (
                    <option key={item.id} value={item.id} >
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.schedule_id && (
                <p className="text-red-500 text-sm">{errors.schedule_id}</p>
              )}
            </div>
            <div className="w-full flex gap-3 items-center">
              <InputGroup
                label="ბარათის ნომერი"
                name="card_number"
                placeholder="ბარათის ნომერი"
                type="text"
                value={formData.card_number}
                onChange={handleInput}
                error={errors.card_number}
              />
              <button className="bg-[#5CB85C] mt-4 text-white rounded-lg py-2" onClick={handleScanCard}>+ ბარათის დამატება</button>
            </div>
          </div>
          <div className="flex justify-between gap-8">
                <InputGroup
                    label="საკონტროლო ჯამი"
                    name="checksum"
                    value={formData.checksum}
                    onChange={handleInput}
                    error={errors.checksum}
                />
                <div className="w-full flex flex-col gap-2">
                    <label className="text-[#105D8D] font-medium">დასვენების დღეები</label>
                    <div className="relative">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center relative bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4"
                        onClick={toggleDropdown}
                    >
                        აირჩიე დასვენების დღეები
                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <select name=""></select>
                        </svg>
                    </button>
                    </div>
                    {isOpenSelected && (
                    <div className="w-full rounded-md bg-white shadow-lg">
                        <div className="flex flex-col flex-wrap p-2">
                        {holidays &&
                            holidays.map((holiday) => (
                            <div key={holiday.id}>
                                <input
                                type="checkbox"
                                id={holiday.id}
                                checked={formData.holidays.includes(holiday.id)}
                                onChange={() => handleOptionToggle(holiday.id)}
                                />
                                <label htmlFor={holiday.id}>{holiday.name}</label>
                            </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#1976D2] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1565C0]"
            onClick={handleSubmit}
          >
            ცვლილების შენახვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
