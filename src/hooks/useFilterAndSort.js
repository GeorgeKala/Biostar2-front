import { useMemo, useState } from "react";

const useFilterAndSort = (data = [], filters = {}, initialSortConfig) => {
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    let filtered = data.filter((item) => {
      const matches = (fieldValue, filter) => {
        const textFilter = filter.text?.toLowerCase() || "";
        const selectedFilters = (filter.selected || []).map((f) =>
          f.toLowerCase()
        );

        const matchesText =
          !textFilter ||
          (fieldValue && fieldValue.toLowerCase().includes(textFilter));
        const matchesSelected =
          selectedFilters.length === 0 ||
          selectedFilters.some(
            (selected) =>
              fieldValue && fieldValue.toLowerCase().includes(selected)
          );

        return matchesText && matchesSelected;
      };

      return Object.keys(filters).every((key) =>
        matches(item[key], filters[key] || {})
      );
    });

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        const aValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), a);
        const bValue = sortConfig.key
          .split(".")
          .reduce((o, i) => (o ? o[i] : ""), b);
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      let direction = "ascending";
      if (
        prevSortConfig.key === key &&
        prevSortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      return { key, direction };
    });
  };

  return { filteredAndSortedData, handleSort, sortConfig };
};

export default useFilterAndSort;
