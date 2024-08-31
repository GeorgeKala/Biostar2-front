import { useState, useMemo } from "react";

export const useFilterAndSort = (data, initialFilters, initialSortConfig) => {
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) =>
        Object.keys(filters).every((key) => {
          const { text = "", selected = [] } = filters[key] || {};
          const fieldValue =
            key
              .split(".")
              .reduce((o, i) => (o ? o[i] : ""), item)
              ?.toString()
              .toLowerCase() || "";
          return (
            (!text || fieldValue.includes(text.toLowerCase())) &&
            (!selected.length ||
              selected.some((val) => fieldValue.includes(val.toLowerCase())))
          );
        })
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), a)
          ?.toString()
          .toLowerCase();
        const bValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), b)
          ?.toString()
          .toLowerCase();
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
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

  // const applyModalFilters = (field, selectedFilters) => {
  //   const selectedText = selectedFilters.join(", "); // Convert the array of selected filters into a comma-separated string

  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [field]: {
  //       ...prevFilters[field],
  //       selected: selectedFilters,
  //       text: selectedText, // Update the text field with the selected filters
  //     },
  //   }));
  // };


  const applyModalFilters = (field, selectedFilters) => {
    let displayText = "";

    if (selectedFilters.length === 1) {
      // If there's only one selected item, set it as the text
      displayText = selectedFilters[0];
    } else if (selectedFilters.length > 1) {
      // If there are multiple selected items, clear the text
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
