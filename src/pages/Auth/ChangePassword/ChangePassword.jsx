import React, { useState } from "react";
import { changePassword } from "../../../services/auth";
import AuthenticatedLayout from "../../../Layouts/AuthenticatedLayout";
import SuccessPopup from "../../../components/SuccessPopup";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(
        formData.current_password,
        formData.new_password,
        formData.new_password_confirmation
      );
      setSuccessMessage("პაროლი წარმატებით შეიცვალა");
      setShowSuccessPopup(true);
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setErrors({});
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        console.error("პაროლის შეცვლის შეცდომა:", error);
      }
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="w-full px-20 py-4 flex flex-col gap-8">
        <div className="flex justify-between w-full">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            პაროლის შეცვლა
          </h1>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[#105D8D] font-medium">
              მიმდინარე პაროლი
            </label>
            <input
              type="password"
              name="current_password"
              placeholder="მიუთითეთ მიმდინარე პაროლი"
              value={formData.current_password}
              onChange={handleInputChange}
              className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
            />
            {errors.current_password && (
              <p className="text-red-500 text-sm">{errors.current_password}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#105D8D] font-medium">ახალი პაროლი</label>
            <input
              type="password"
              name="new_password"
              placeholder="მიუთითეთ ახალი პაროლი"
              value={formData.new_password}
              onChange={handleInputChange}
              className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm">{errors.new_password}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#105D8D] font-medium">
              ახალი პაროლის დადასტურება
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              placeholder="გაიმეორეთ ახალი პაროლი"
              value={formData.new_password_confirmation}
              onChange={handleInputChange}
              className="bg-white border border-[#105D8D] outline-none rounded-xl py-3 px-4 w-full"
            />
            {errors.new_password_confirmation && (
              <p className="text-red-500 text-sm">
                {errors.new_password_confirmation}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#1976D2] text-white px-7 py-4 rounded flex items-center gap-3 text-[16px]"
            >
              პაროლის შეცვლა
            </button>
          </div>
        </form>
        {showSuccessPopup && (
          <SuccessPopup
            title="წარმატება"
            message={successMessage}
            onClose={() => setShowSuccessPopup(false)}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default ChangePassword;
