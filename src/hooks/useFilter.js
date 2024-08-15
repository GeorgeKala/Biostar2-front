import { useState } from "react";

export const useFilter = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: {
        ...prevFilters[name],
        text: value,
      },
    }));
  };

  const applyModalFilters = (field, selectedFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: {
        ...prevFilters[field],
        selected: selectedFilters,
      },
    }));
  };

  const clearFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = { text: "", selected: [] };
      return acc;
    }, {});
    setFilters(clearedFilters);
  };

  return { filters, handleInputChange, applyModalFilters, clearFilters };
};
