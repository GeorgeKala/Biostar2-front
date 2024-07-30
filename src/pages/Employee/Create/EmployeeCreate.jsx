import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import CloseIcon from "../../../assets/close.png";
import InputGroup from "../../../components/employee/InputGroup";
import NewIcon from "../../../assets/new.png";
import SaveIcon from "../../../assets/save.png";
import DeleteIcon from "../../../assets/delete.png";
import EditIcon from "../../../assets/edit.png";
import SelectGroup from "../../../components/employee/SelectGroup";
import departmentService from "../../../services/department";
import groupService from "../../../services/group";
import scheduleService from "../../../services/schedule";
import employeeService from "../../../services/employee";
import SuccessPopup from "../../../components/SuccessPopup";
import MultiSelect from "../../../components/MultiSelect";
import { fetchHolidays, selectHolidays } from "../../../redux/holidaySlice";
import { useDispatch, useSelector } from "react-redux";
import fetchDevices from "../../../services/device";
import deviceService from "../../../services/device";
import axiosInstance from "../../../Config/axios";

const EmployeeCreate = () => {
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    personal_id: "",
    phone_number: "",
    department_id: "",
    start_datetime: "",
    expiry_datetime: "",
    position: "",
    group_id: "",
    schedule_id: "",
    honorable_minutes_per_day: "",
    device_id: "",
    card_number: "",
    checksum: "",
    session_id: sessionStorage.getItem('sessionToken'),
    holidays: []
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const dispatch = useDispatch();
  const holidays = useSelector(selectHolidays);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("")

  useEffect(() => {
      dispatch(fetchHolidays());
  }, [dispatch]);

  const toggleDropdown = () => {
      setIsOpen(!isOpen);
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
      await employeeService.createEmployee(formData);
      setShowSuccessPopup(true);
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
        console.error("Error creating employee:", error);
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


  useEffect(() => {
    const sessionToken = sessionStorage.getItem('bs_id_token');

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/get-schedules', {
          headers: {
            'Bs-Session-Id': sessionToken
          }
        });
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchData();
  }, []);



  const renderHolidays = () => {
      return (
          <div>
              {holidays && holidays.map(holiday => (
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
      );
  };

  
  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის დამატება/ცვლილება
          </h1>
          {/* <button className="bg-[#1976D2] px-7 py-4 rounded-2xl">
            <img src={CloseIcon} alt="Close" />
          </button> */}
        </div>
        <div className="flex justify-end gap-4">
          {/* <button className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2"> */}
            {/* <img src={NewIcon} alt="New" /> */}
            {/* ახალი */}
          {/* </button> */}
          {/* <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={EditIcon} alt="Edit" />
            Edit
          </button>
          <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={DeleteIcon} alt="Delete" />
            Delete
          </button> */}
          <button
            onClick={handleSubmit}
            className="bg-[#FBD15B] text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <img src={SaveIcon} alt="Save" />
            Save
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-8">
            <InputGroup
              label="სახელი/გვარი"
              name="fullname"
              placeholder="სახელი/გვარი"
              type="text"
              value={formData.fullname}
              onChange={handleInput}
              error={errors.fullname}
            />
            <InputGroup
              label="პირადი ნომერი / ID"
              name="personal_id"
              placeholder="პირადი ნომერი"
              type="number"
              value={formData.personal_id}
              onChange={handleInput}
              error={errors.personal_id}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="ტელეფონის ნომერი"
              name="phone_number"
              placeholder="ტელეფონის ნომერი"
              type="number"
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
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიეთ დეპარტამენტი</option>
                {departments &&
                  departments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
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
              placeholder="პოზიცია"
              type="text"
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
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
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
            <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">განრიგი</label>
              <select
                id="schedule_id"
                name="schedule_id"
                value={formData.schedule_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიეთ განრიგი</option>
                {schedules &&
                  schedules.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.schedule_id && (
                <p className="text-red-500 text-sm">{errors.schedule_id}</p>
              )}
            </div>
            <InputGroup
              label="საპატიო წუთები"
              name="honorable_minutes_per_day"
              placeholder="საპატიო წუთები"
              type="text"
              value={formData.honorable_minutes_per_day}
              onChange={handleInput}
              error={errors.honorable_minutes_per_day}
            />
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
              <button className="bg-[#5CB85C] mt-8 text-white rounded-lg py-2" onClick={handleScanCard}>+ ბარათის დამატება</button>
            </div>
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="საკონტროლო ჯამი"
              name="checksum"
              placeholder="საკონტროლო ჯამი"
              type="number"
              value={formData.checksum}
              onChange={handleInput}
              error={errors.checksum}
            />
            <div className="relative w-full flex flex-col gap-2">
            <label className='text-[#105D8D] font-medium'>დასვენების დღეები</label>
            <div className='relative'>
                <button
                    type="button"
                    className="w-full flex justify-between items-center relative bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 "
                    onClick={toggleDropdown}
                >
                    აირჩიე დასვენების დღეები
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <select name="" id=""></select>
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className=" w-full rounded-md bg-white shadow-lg">
                    <div className="flex flex-col flex-wrap p-2">
                        {renderHolidays()}
                    </div>
                </div>
            )}
        </div>
          </div>
        </div>
        {showSuccessPopup && (
          <SuccessPopup
            title="Success!"
            message="თანამშრომელი დაემატა წარმატებით"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeCreate;
