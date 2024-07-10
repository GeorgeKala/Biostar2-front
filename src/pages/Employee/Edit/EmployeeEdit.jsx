import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import CloseIcon from "../../../assets/close.png";
import InputGroup from "../../../components/employee/InputGroup";
import SaveIcon from "../../../assets/save.png";
import EditIcon from "../../../assets/edit.png";
import DeleteIcon from "../../../assets/delete.png";
import SuccessPopup from "../../../components/SuccessPopup";
import { useParams } from "react-router-dom";
import departmentService from "../../../services/department";
import groupService from "../../../services/group";
import scheduleService from "../../../services/schedule";
import employeeService from "../../../services/employee";

const EmployeeEdit = () => {
  const { id } = useParams(); 
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
    device: "",
    card_number: "",
    checksum: "",
    session_id: sessionStorage.getItem('sessionToken') || ""
  });

  

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

        const employeeData = await employeeService.getEmployeeById(id);
        setFormData(employeeData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      session_id: sessionStorage.getItem('sessionToken')
    };
    try {
      await employeeService.updateEmployee(id, updatedFormData);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };



  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის ცვლილება
          </h1>
          <button className="bg-[#1976D2] px-7 py-4 rounded-2xl">
            <img src={CloseIcon} alt="Close" />
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleSubmit}>
            <img src={SaveIcon} alt="Save" />
            Save
          </button>
          <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={EditIcon} alt="Edit" />
            Edit
          </button>
          <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={DeleteIcon} alt="Delete" />
            Delete
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-8">
            <InputGroup
              label="სახელი/გვარი"
              name="fullname"
              placeholder="სახელი/გვარი"
              type="text"
              value={formData?.fullname}
              onChange={handleInput}
            />
            <InputGroup
              label="პირადი ნომერი / ID"
              name="personal_id"
              placeholder="პირადი ნომერი"
              type="number"
              value={formData?.personal_id}
              onChange={handleInput}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="ტელეფონის ნომერი"
              name="phone_number"
              placeholder="ტელეფონის ნომერი"
              type="number"
              value={formData?.phone_number}
              onChange={handleInput}
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">დეპარტამენტი</label>
              <select
                id="department_id"
                name="department_id"
                value={formData?.department_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიეთ დეპარტამენტი</option>
                {departments &&
                  departments.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="დაწყების დრო"
              name="start_datetime"
              placeholder="დაწყების დრო"
              type="date"
              value={formData?.start_datetime}
              onChange={handleInput}
            />
            <InputGroup
              label="გათავისუფლების დრო"
              name="expiry_datetime"
              placeholder="გათავისუფლების დრო"
              type="date"
              value={formData?.expiry_datetime}
              onChange={handleInput}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="პოზიცია"
              name="position"
              placeholder="პოზიცია"
              type="text"
              value={formData?.position}
              onChange={handleInput}
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">ჯგუფი</label>
              <select
                id="group_id"
                name="group_id"
                value={formData?.group_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიეთ ჯგუფი</option>
                {groups &&
                  groups.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-8">
            <div className="w-full flex flex-col gap-2">
              <label className="text-[#105D8D] font-medium">განრიგი</label>
              <select
                id="schedule_id"
                name="schedule_id"
                value={formData?.schedule_id}
                onChange={handleInput}
                className="bg-white border border-[#105D8D] outline-none rounded-xl py-3  px-4 w-full"
              >
                <option value="">აირჩიეთ განრიგი</option>
                {schedules &&
                  schedules.map((item) => (
                    <option key={item?.id} value={item?.id}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </div>
            <InputGroup
              label="საპატიო წუთები"
              name="honorable_minutes_per_day"
              placeholder="საპატიო წუთები"
              type="text"
              value={formData?.honorable_minutes_per_day}
              onChange={handleInput}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="ბარათის ნომერი"
              name="card_number"
              placeholder="ბარათის ნომერი"
              type="text"
              value={formData?.card_number}
              onChange={handleInput}
            />
            <InputGroup
              label="საკონტროლო ჯამი"
              name="checksum"
              placeholder="საკონტროლო ჯამი"
              type="number"
              value={formData?.checksum}
              onChange={handleInput}
            />
          </div>
        </div>
        {showSuccessPopup && (
          <SuccessPopup
            title="Success!"
            message="თანამშრომელი წარმატებით განახლდა"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default EmployeeEdit;
