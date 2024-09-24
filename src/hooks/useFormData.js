import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useFormData = (initialFormData) => {
  const location = useLocation();
  const pageKey = `${location.pathname}-formData`;

  const getStoredFormData = () => {
    const storedFormData = sessionStorage.getItem(pageKey);
    return storedFormData ? JSON.parse(storedFormData) : initialFormData;
  };

  const [formData, setFormData] = useState(getStoredFormData);

  useEffect(() => {
    sessionStorage.setItem(pageKey, JSON.stringify(formData));
  }, [formData, pageKey]);

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFormData = () => {
    sessionStorage.removeItem(pageKey);
    setFormData(initialFormData);
  };

  const handleClearField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  // Handle select actions
  const handleSelect = (fieldName, selectedValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedValue,
    }));
  };

  const handleSelectClear = (fieldName, selectedValue = '') => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedValue,
    }));
  };

  return {
    formData,
    handleFormDataChange,
    clearFormData,
    setFormData, 
    handleClearField,
    handleSelect,
    handleSelectClear

  };
};
