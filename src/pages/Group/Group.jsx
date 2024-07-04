import React from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import NewIcon from "../../assets/new.png";
import ArrowDownIcon from "../../assets/arrow-down-2.png";
import CreateIcon from "../../assets/create.png";
import DeleteIcon from "../../assets/delete-2.png";

const Group = () => {
  const scheduleItems = [
    { description: "1 ჯგუფი - 09:00 - შესვენება 1 საათი" },
    { description: "2 ჯგუფი - დილა - საღამო" },
    { description: "3 ჯგუფი - დილით მოსვლა" },
    { description: "4 ჯგუფი - შეუძლებელია კონტროლი" },
    { description: "5 ჯგუფი - თავისუფალი გრაფიკი" },
    { description: "6 ჯგუფი - მუშაობენ ცვლებში" },
    { description: "სხვა გრაფიკი" },
  ];

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">ჯგუფები</h1>
          <div className="flex items-center gap-8">
            <button className="bg-[#FBD15B]  text-white px-4 py-4 rounded-md flex items-center gap-2">
              + დაამატე ახალი ჯგუფი
            </button>
            <button className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative">
              Download Data
              <img src={ArrowDownIcon} className="ml-3" alt="Arrow Down Icon" />
              <span className="absolute inset-0 border border-white border-dashed rounded"></span>
            </button>
          </div>
        </div>
        <div className="p-4">
          {scheduleItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 border-b py-2 border-black"
            >
              <div className="flex-1 text-sm text-gray-700 font-medium">
                {item.description}
              </div>
              <div className="flex space-x-2">
                <button>
                  <img src={CreateIcon} alt="" />
                </button>
                <button>
                  <img src={DeleteIcon} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Group;
