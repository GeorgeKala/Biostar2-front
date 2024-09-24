import React, { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import InputGroup from "../../../components/employee/InputGroup";
import SaveIcon from "../../../assets/save.png";
import employeeService from "../../../services/employee";
import SuccessPopup from "../../../components/SuccessPopup";
import { fetchHolidays, selectHolidays } from "../../../redux/holidaySlice";
import { useDispatch, useSelector } from "react-redux";
import deviceService from "../../../services/device";
import NestedDropdownModal from "../../../components/NestedDropdownModal";
import SearchIcon from "../../../assets/search.png";
import CardScanModal from "../../../components/CardScanModal";
import { useFormData } from "../../../hooks/useFormData"; // Import the useFormData hook
import SelectGroup from "../../../components/employee/SelectGroup";

const EmployeeCreate = () => {
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const user = useSelector((state) => state.user.user);
  const groups = useSelector((state) => state.groups.items);
  const schedules = useSelector((state) => state.schedules.items);

  // Use the useFormData hook
  const initialFormData = {
    fullname: "",
    personal_id: "",
    phone_number: "",
    department_id: user?.user_type?.has_full_access ? "" : user?.department?.id,
    start_datetime: "",
    expiry_datetime: "",
    position: "",
    group_id: "",
    schedule_id: "",
    honorable_minutes_per_day: "",
    device_id: "",
    card_number: "",
    checksum: "",
    session_id: sessionStorage.getItem("sessionToken"),
    holidays: [],
  };

  const { formData, handleFormDataChange, clearFormData, setFormData } =
    useFormData(initialFormData);

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const dispatch = useDispatch();
  const holidays = useSelector(selectHolidays);
  const [isOpen, setIsOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [isCardScanModalOpen, setIsCardScanModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  useEffect(() => {
    // Detect clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionToggle = (optionId) => {
    if (formData.holidays.includes(optionId)) {
      setFormData((prevData) => ({
        ...prevData,
        holidays: prevData.holidays.filter((item) => item !== optionId),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        holidays: [...prevData.holidays, optionId],
      }));
    }
  };

  const handleInput = (e) => {
    handleFormDataChange(e);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "fullname" && !value) {
      error = "გვარი/სახელი აუცილებელია";
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
        field !== "checksum" &&
        field !== "honorable_minutes_per_day" &&
        field !== "device_id"
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
      clearFormData(); // Clear form data after successful submission
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
    fullname: "გვარი/სახელი",
    personal_id: "პირადი ნომერი",
    phone_number: "ტელეფონის ნომერი",
    department_id: "დეპარტამენტი",
    start_datetime: "დაწყების დრო",
    expiry_datetime: "გათავისუფლების დრო",
    position: "პოზიცია",
    group_id: "ჯგუფი",
    schedule_id: "განრიგი",
    device_id: "მოწყობილობა",
    card_number: "ბარათის ნომერი",
  };

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await deviceService.fetchDevices();
      setDevices(devices);
    };

    fetchDevices();
  }, []);

  const handleDeviceSelect = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);
    setFormData((prevData) => ({
      ...prevData,
      device_id: deviceId,
    }));
  };

  const handleScanCard = async () => {
    setIsCardScanModalOpen(true);
    try {
      const scanResult = await deviceService.scanCard(selectedDevice);
      setFormData((prevData) => ({
        ...prevData,
        card_number: scanResult.Card.card_id,
        display_card_id: scanResult.Card.display_card_id,
      }));
      setIsCardScanModalOpen(false);
    } catch (error) {
      console.error("Error scanning card:", error);
    }
  };

  const renderHolidays = () => {
    return (
      <div>
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
    );
  };

  const handleDepartmentSelect = (departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  };

  const handleClearDepartment = () => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: "",
    }));
  };

  const selectedHolidays = holidays
    .filter((holiday) => formData.holidays.includes(holiday.id))
    .map((holiday) => holiday.name)
    .join(", ");

    
    

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის დამატება
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-8">
            <InputGroup
              label="გვარი / სახელი"
              name="fullname"
              placeholder="გვარი / სახელი"
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
            <div className="w-full flex flex-col gap-2 relative">
              <label className="text-[#105D8D] font-medium">დეპარტამენტი</label>
              <div className="flex">
                <input
                  className="bg-white border border-[#105D8D] outline-none rounded-l-2xl py-3 px-4 w-full pr-10"
                  placeholder="დეპარტამენტი"
                  value={
                    departments.find((d) => d.id === formData.department_id)
                      ?.name || ""
                  }
                  readOnly
                />
                {formData.department_id && (
                  <button
                    type="button"
                    onClick={handleClearDepartment}
                    className="absolute right-12 top-[70%] transform -translate-y-1/2 mr-4"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="black"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setOpenNestedDropdown(true)}
                  className="bg-[#105D8D] px-4 rounded-r-2xl"
                >
                  <img className="w-[20px]" src={SearchIcon} alt="" />
                </button>
              </div>
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
            <SelectGroup
              label="ჯგუფი"
              options={groups.map((group) => group.name)}
              placeholder="აირჩიე ჯგუფი"
              onSelect={(selectedGroup) => {
                const selectedGroupObj = groups.find(
                  (group) => group.name === selectedGroup
                );
                setFormData((prevData) => ({
                  ...prevData,
                  group_id: selectedGroupObj.id, // Set the group_id here
                }));
              }}
            />
          </div>
          <div className="flex justify-between gap-8">
            {/* <div className="w-full flex flex-col gap-2">
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
            </div> */}
            <SelectGroup
              label="განრიგი"
              options={schedules.map((schedule) => schedule.name)} // Pass the schedule names as options
              placeholder="აირჩიეთ განრიგი"
              onSelect={(selectedSchedule) => {
                const selectedScheduleObj = schedules.find(
                  (schedule) => schedule.name === selectedSchedule
                );
                setFormData((prevData) => ({
                  ...prevData,
                  schedule_id: selectedScheduleObj.id, // Set the selected schedule ID in formData
                }));
              }}
            />
            {errors.schedule_id && (
              <p className="text-red-500 text-sm">{errors.schedule_id}</p>
            )}
            <InputGroup
              label="საპატიო წუთები"
              name="honorable_minutes_per_day"
              placeholder="საპატიო წუთები"
              type="text"
              value={formData.honorable_minutes_per_day}
              onChange={handleInput}
            />
          </div>
          <div className="flex justify-between gap-8">
            {/* <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">
                აირჩიე მოწყობილობა
              </label>
              <select
                value={selectedDevice}
                onChange={handleDeviceSelect}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიე მოწყობილობა</option>
                {devices &&
                  devices.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.device_id && (
                <p className="text-red-500 text-sm">{errors.device_id}</p>
              )}
            </div> */}
            <SelectGroup
              label="აირჩიე მოწყობილობა"
              options={devices.map((device) => device.name)} // Pass the device names as options
              placeholder="აირჩიე მოწყობილობა"
              onSelect={(selectedDeviceName) => {
                const selectedDeviceObj = devices.find(
                  (device) => device.name === selectedDeviceName
                );
                setSelectedDevice(selectedDeviceObj.id); // Set the selected device in state
                setFormData((prevData) => ({
                  ...prevData,
                  device_id: selectedDeviceObj.id, // Update formData with the selected device ID
                }));
              }}
            />
            {errors.device_id && (
              <p className="text-red-500 text-sm">{errors.device_id}</p>
            )}
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
              <button
                className="bg-[#5CB85C] mt-8 text-white rounded-lg py-2"
                onClick={handleScanCard}
              >
                + ბარათის დამატება
              </button>
            </div>
          </div>
          <div className="flex justify-between gap-8">
            <div
              className="relative w-1/2 flex flex-col pr-4"
              ref={dropdownRef}
            >
              <label className="text-[#105D8D] font-medium mb-2">
                დასვენების დღეები
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex justify-between items-center relative bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4"
                  onClick={toggleDropdown}
                >
                  {selectedHolidays || "აირჩიე დასვენების დღეები"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {isOpen && (
                <div className="w-full rounded-md bg-white shadow-lg z-10">
                  <div className="flex flex-col flex-wrap p-2">
                    {renderHolidays()}
                  </div>
                </div>
              )}
            </div>
            {/* <InputGroup
              label="საკონტროლო ჯამი"
              name="checksum"
              placeholder="საკონტროლო ჯამი"
              type="number"
              value={formData.checksum}
              onChange={handleInput}
            /> */}
          </div>
          <div className="flex justify-end  gap-4 mt-10">
            <button
              onClick={handleSubmit}
              className="bg-[#FBD15B] text-white  px-4 py-2 rounded-md flex items-center gap-2"
            >
              <img src={SaveIcon} alt="Save" />
              შენახვა
            </button>
          </div>
        </div>
        {showSuccessPopup && (
          <SuccessPopup
            title="Success!"
            message="თანამშრომელი დაემატა წარმატებით"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
        {openNestedDropdown && (
          <NestedDropdownModal
            header="დეპარტამენტები"
            isOpen={openNestedDropdown}
            onClose={() => setOpenNestedDropdown(false)}
            onSelect={handleDepartmentSelect}
            data={nestedDepartments}
            link={"/departments"}
          />
        )}
        <CardScanModal
          isOpen={isCardScanModalOpen}
          onClose={() => setIsCardScanModalOpen(false)}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeCreate;
