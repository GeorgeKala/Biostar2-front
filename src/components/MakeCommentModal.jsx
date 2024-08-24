import React from "react";

const MakeCommentModal = ({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  forgiveTypes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">კომენტარის დამატება</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            სახელი და გვარი
          </label>
          <input
            type="text"
            name="employee_name"
            value={data.employee_name}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            readOnly
          />
          <input
            type="hidden"
            name="employee_id"
            value={data.employee_id}
            onChange={onChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            თარიღი
          </label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            პატიების ტიპი
          </label>
          <select
            name="forgive_type_id"
            value={data.forgive_type_id}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">აირჩიე პატიების ტიპი</option>
            {forgiveTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            გასვლა
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSave}>
            შენახვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeCommentModal;
