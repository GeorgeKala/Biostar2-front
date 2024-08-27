import React from "react";

const ScheduleForm = ({ formData, handleChange, handleSave, closeModal, modalMode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">
            {modalMode === "create" ? "დაამატე ახალი განრიგი" : "განაახლე განრიგი"}
          </h2>
          <button onClick={closeModal} className="hover:text-gray-200 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSave} className="p-3">
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              სახელი:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Start Date Input */}
          <div className="mb-4">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              დაწყების თარიღი:
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.start_date || ""}
              onChange={handleChange}
              
            />
          </div>

          {/* End Date Input */}
          <div className="mb-4">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              დასრულების თარიღი:
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.end_date || ""}
              onChange={handleChange}
              
            />
          </div>

          {/* Day Start Time Input */}
          <div className="mb-4">
            <label htmlFor="day_start" className="block text-sm font-medium text-gray-700">
              დაწყების დრო:
            </label>
            <input
              type="time"
              id="day_start"
              name="day_start"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.day_start || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Day End Time Input */}
          <div className="mb-4">
            <label htmlFor="day_end" className="block text-sm font-medium text-gray-700">
              დამთავრების დრო:
            </label>
            <input
              type="time"
              id="day_end"
              name="day_end"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.day_end || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="repetition_unit" className="block text-sm font-medium text-gray-700">
              გამეორების ერთეული:
            </label>
            <input
              type="text"
              id="repetition_unit"
              name="repetition_unit"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.repetition_unit || ""}
              onChange={handleChange}
              
            />
          </div>
          <div className="mb-4">
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
              ინტერვალი:
            </label>
            <input
              type="number"
              id="interval"
              name="interval"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.interval || ""}
              onChange={handleChange}
              
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              კომენტარი:
            </label>
            <input
              type="text"
              id="comment"
              name="comment"
              className="mt-1 px-2 block w-full outline-none bg-gray-300 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              value={formData?.comment || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mr-2">
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
