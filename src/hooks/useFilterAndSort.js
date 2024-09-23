import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useFilterAndSort = (data, initialFilters, initialSortConfig) => {
  const location = useLocation();
  const pageKey = location.pathname;

  const getStoredFilters = () => {
    const storedFilters = localStorage.getItem(`${pageKey}-filters`);
    return storedFilters ? JSON.parse(storedFilters) : initialFilters;
  };

  const getStoredSortConfig = () => {
    const storedSortConfig = localStorage.getItem(`${pageKey}-sortConfig`);
    return storedSortConfig ? JSON.parse(storedSortConfig) : initialSortConfig;
  };

  const [filters, setFilters] = useState(getStoredFilters);
  const [sortConfig, setSortConfig] = useState(getStoredSortConfig);

  useEffect(() => {
    localStorage.setItem(`${pageKey}-filters`, JSON.stringify(filters));
  }, [filters, pageKey]);

  useEffect(() => {
    localStorage.setItem(`${pageKey}-sortConfig`, JSON.stringify(sortConfig));
  }, [sortConfig, pageKey]);

  const filteredAndSortedData = useMemo(() => {
    // Ensure data is an array before attempting to filter or sort
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((item) =>
        Object.keys(filters).every((key) => {
          const { text = "", selected = [] } = filters[key] || {};
          const fieldValue =
            key
              .split(".")
              .reduce((o, i) => (o ? o[i] : ""), item) || "";

          // Convert fieldValue to string and lowercase if necessary
          const fieldValueStr =
            typeof fieldValue === "string"
              ? fieldValue.toLowerCase()
              : fieldValue.toString();

          return (
            (!text || fieldValueStr.includes(text.toLowerCase())) &&
            (!selected.length ||
              selected.some((val) =>
                fieldValueStr.includes(val.toString().toLowerCase())
              ))
          );
        })
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue =
          sortConfig.key
            .split(".")
            .reduce((o, i) => (o ? o[i] : ""), a) || "";
        const bValue =
          sortConfig.key
            .split(".")
            .reduce((o, i) => (o ? o[i] : ""), b) || "";

        // Convert values to string and lowercase for comparison
        const aValueStr =
          typeof aValue === "string" ? aValue.toLowerCase() : aValue.toString();
        const bValueStr =
          typeof bValue === "string" ? bValue.toLowerCase() : bValue.toString();

        if (aValueStr < bValueStr)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValueStr > bValueStr)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
  }, [data, filters, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: { ...prev[name], text: value },
    }));
  };

  const applyModalFilters = (field, selectedFilters) => {
    let displayText = "";

    if (selectedFilters.length === 1) {
      displayText = selectedFilters[0];
    } else if (selectedFilters.length > 1) {
      displayText = "";
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: {
        ...prevFilters[field],
        selected: selectedFilters,
      },
    }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return {
    filteredAndSortedData,
    handleFilterChange,
    applyModalFilters,
    handleSort,
    filters,
    sortConfig,
  };
};
