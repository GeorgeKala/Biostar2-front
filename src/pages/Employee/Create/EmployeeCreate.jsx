import React, { useEffect } from 'react'
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout'
import CloseIcon from '../../../assets/close.png'
import InputGroup from '../../../components/employee/InputGroup'
import NewIcon from '../../../assets/new.png'
import SaveIcon from '../../../assets/save.png'
import DeleteIcon from '../../../assets/delete.png'
import EditIcon from '../../../assets/edit.png'
import SelectGroup from '../../../components/employee/SelectGroup'

const EmployeeCreate = () => {

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            თანამშრომლის დამატება/ცვლილება
          </h1>
          <button className="bg-[#1976D2] px-7 py-4 rounded-2xl">
            <img src={CloseIcon} />
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button className="bg-[#5CB85C] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={NewIcon} />
            New
          </button>
          <button className="bg-[#1976D2] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={EditIcon} />
            Edit
          </button>
          <button className="bg-[#D9534F] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={DeleteIcon} />
            Delete
          </button>
          <button className="bg-[#FBD15B] text-white px-4 py-2 rounded-md flex items-center gap-2">
            <img src={SaveIcon} />
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
            />
            <InputGroup
              label="პირადი ნომერი / ID"
              name="personal_id"
              placeholder="პირადი ნომერი"
              type="number"
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="ტელეფონის ნომერი"
              name="phone_number"
              placeholder="ტელეფონის ნომერი"
              type="number"
            />
            <SelectGroup
              label="დეპარტამენტი"
              options={["Option 1", "Option 2", "Option 3"]}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="დაწყების დრო"
              name="start_date"
              placeholder="დაწყების დრო"
              type="date"
            />
            <InputGroup
              label="გათავისუფლების დრო"
              name="end_date"
              placeholder="გათავისუფლების დრო"
              type="date"
            />
          </div>
          <div className="flex justify-between gap-8">
          <InputGroup
              label="პოზიცია"
              name="position"
              placeholder="პოზიცია"
              type="text"
            />
            <SelectGroup
              label="ჯგუფი"
              options={["Option 1", "Option 2", "Option 3"]}
            />
          </div>
          <div className="flex justify-between gap-8">
            <SelectGroup
              label="განრიგი"
              options={["Option 1", "Option 2", "Option 3"]}
            />
            <InputGroup
              label="საპატიო წუთები"
              name="honorable_minutes"
              placeholder="საპატიო წუთები"
              type="text"
            />
          </div>
          <div className="flex justify-between gap-8">
            <SelectGroup
              label="აირჩიეთ მოწყობილობა"
              options={["Option 1", "Option 2", "Option 3"]}
            />
            <SelectGroup
              label="ბარათის ნომერი"
              options={["Option 1", "Option 2", "Option 3"]}
            />
          </div>
          <div className="flex justify-between gap-8">
            <InputGroup
              label="საკონტროლო ჯამი"
              name="fullname"
              placeholder="საკონტროლო ჯამი"
              type="text"
            />
            <SelectGroup
              label="სტატუსი"
              options={["Option 1", "Option 2", "Option 3"]}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default EmployeeCreate