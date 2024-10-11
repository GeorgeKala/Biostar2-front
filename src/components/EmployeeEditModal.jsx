import React, { useEffect, useState } from "react";
import InputGroup from "./employee/InputGroup";
import employeeService from "../services/employee";
import { useDispatch, useSelector } from "react-redux";
import { fetchHolidays, selectHolidays } from "../redux/holidaySlice";
import deviceService from "../services/device";
import SuccessPopup from "./SuccessPopup";
import NestedDropdownModal from "./NestedDropdownModal";
import SearchIcon from "../assets/search.png";
import CardScanModal from "./CardScanModal";
import { updateEmployee } from "../redux/employeeSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeEditModal = ({ employeeId, isOpen, onClose }) => {

  
  const dispatch = useDispatch();
  const holidays = useSelector(selectHolidays);
  const { departments, nestedDepartments } = useSelector(
    (state) => state.departments
  );
  const user = useSelector((state) => state.user.user);
  const groups = useSelector((state) => state.groups.items);
  const schedules = useSelector((state) => state.schedules.items);

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
    session_id: sessionStorage.getItem("sessionToken"),
    holidays: [],
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [isCardScanModalOpen, setIsCardScanModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await employeeService.getEmployeeById(employeeId.id);

        console.log(employeeData);
        
  
        setFormData({
          fullname: employeeData.fullname || "",
          personal_id: employeeData.personal_id || "",
          phone_number: employeeData.phone_number || "",
          department_id: employeeData?.department?.id || "",
          // department_id: user?.user_type?.has_full_access
          //   ? employeeData?.department?.id || ""  // Store department_id
          //   : user?.department?.id || "",
          // department_name: employeeData?.department?.name || "",  // Store department name for display
          start_datetime: employeeData.start_datetime
            ? new Date(employeeData.start_datetime).toISOString().slice(0, 10)
            : "",
          expiry_datetime: employeeData.expiry_datetime
            ? new Date(employeeData.expiry_datetime).toISOString().slice(0, 10)
            : "",
          position: employeeData.position || "",
          group_id: employeeData?.group?.id || "",
          schedule_id: employeeData?.schedule?.id || "",
          honorable_minutes_per_day: employeeData.honorable_minutes_per_day || "",
          device_id: employeeData?.device?.id || "",
          card_number: employeeData.card_number || "",
          checksum: employeeData.checksum || "",
          holidays: employeeData.holidays?.map((holiday) => holiday.id) || [],
          session_id: sessionStorage.getItem("sessionToken"),
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
  
    if (isOpen && employeeId) {
      fetchEmployee();
    }
  }, [isOpen, employeeId, user]);
  

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await deviceService.fetchDevices();
        setDevices(devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Dispatch the updateEmployee action
      dispatch(updateEmployee({ id: employeeId?.id, employeeData: formData }))
        .unwrap() // Make sure to unwrap the promise to catch the error directly
        .then(() => {
          toast.success("თანამშრომლის ინფორმაცია წარმატებით განახლდა.");
          onClose();
        })
        .catch((error) => {
          toast.error(`შეცდომა თანამშრომლის განახლებისას: ${error.message}`);
        });
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeviceSelect = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);
    setFormData({
      ...formData,
      device_id: deviceId,
    });
  };

  const handleScanCard = async () => {
    setIsCardScanModalOpen(true);
    try {
      const scanResult = await deviceService.scanCard(selectedDevice);
      setFormData({
        ...formData,
        card_number: scanResult.Card.card_id,
        display_card_id: scanResult.Card.display_card_id,
      });
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

  const handleDepartmentSelect = (departmentId, departmentName) => {
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

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-1/2 h-[80%] p-4 rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის ცვლილება
          </h2>
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path
                fill="currentColor"
                d="M18.364 5.636a.999.999 0 0 0-1.414 0L12 10.586 7.05 5.636a.999.999 0 1 0-1.414 1.414L10.586 12l-4.95 4.95a.999.999 0 1 0 1.414 1.414L12 13.414l4.95 4.95a.999.999 0 1 0 1.414-1.414L13.414 12l4.95-4.95c.39-.39.39-1.023 0-1.414z"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-[85%] pr-2">
          {" "}
          {/* Scrollable content */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-8">
              <InputGroup
                label="სახელი/გვარი"
                name="fullname"
                value={formData.fullname}
                onChange={handleInput}
              />
              <InputGroup
                label="პირადი ნომერი"
                name="personal_id"
                value={formData.personal_id}
                onChange={handleInput}
              />
            </div>
            <div className="flex justify-between gap-8">
              <InputGroup
                label="ტელეფონის ნომერი"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInput}
              />
              <div className="w-full flex flex-col gap-2 relative">
                <label className="text-[#105D8D] font-medium">
                  დეპარტამენტი
                </label>
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
              />
              <InputGroup
                label="გათავისუფლების დრო"
                name="expiry_datetime"
                placeholder="გათავისუფლების დრო"
                type="date"
                value={formData.expiry_datetime}
                onChange={handleInput}
              />
            </div>
            <div className="flex justify-between gap-8">
              <InputGroup
                label="პოზიცია"
                name="position"
                value={formData.position}
                onChange={handleInput}
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
              </div>
            </div>
            <div className="flex justify-between gap-8">
              <InputGroup
                label="საპატიო წუთები"
                name="honorable_minutes_per_day"
                value={formData.honorable_minutes_per_day}
                onChange={handleInput}
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
              </div>
            </div>
            <div className="flex justify-between gap-8">
              <div className="w-full flex flex-col gap-2">
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
              </div>
              <div className="w-full flex gap-3 items-center">
                <InputGroup
                  label="ბარათის ნომერი"
                  name="card_number"
                  placeholder="ბარათის ნომერი"
                  type="text"
                  value={formData.card_number}
                  onChange={handleInput}
                />
                <button
                  className="bg-[#5CB85C] mt-4 text-white rounded-lg py-2"
                  onClick={handleScanCard}
                >
                  + ბარათის დამატება
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-8">
              <InputGroup
                label="საკონტროლო ჯამი"
                name="checksum"
                value={formData.checksum}
                onChange={handleInput}
              />
              <div className="w-full flex flex-col gap-2">
                <label className="text-[#105D8D] font-medium">
                  დასვენების დღეები
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center relative bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4"
                    onClick={toggleDropdown}
                  >
                    აირჩიე დასვენების დღეები
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <select name=""></select>
                    </svg>
                  </button>
                </div>
                {isOpenDropdown && (
                  <div className="w-full rounded-md bg-white shadow-lg">
                    <div className="flex flex-col flex-wrap p-2">
                      {renderHolidays()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#1976D2] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1565C0]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "ცვლილების შენახვა"}
          </button>
        </div>
        {showSuccessPopup && (
          <SuccessPopup
            title="Success!"
            message="თანამშრომლის ინფორმაცია წარმატებით განახლდა."
            onClose={() => {
              setShowSuccessPopup(false);
              onClose();
            }}
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
    </div>
  );
};

export default EmployeeEditModal;
