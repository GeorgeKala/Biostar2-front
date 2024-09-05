import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux'; 
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import reportService from '../../../services/report';
import GeneralInputGroup from '../../../components/GeneralInputGroup';
import DepartmentInput from '../../../components/DepartmentInput';
import EmployeeInput from '../../../components/employee/EmployeeInput';
import NestedDropdownModal from '../../../components/NestedDropdownModal';
import EmployeeModal from '../../../components/employee/EmployeeModal';
import SearchIcon from '../../../assets/search.png';
import * as XLSX from 'xlsx';

const KitchenReport = () => {
  const [reportData, setReportData] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    department_id: '',
    employee: '',
    employee_id: '',
  });

  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);

  const { nestedDepartments } = useSelector((state) => state.departments); 

  const fetchData = async () => {
    try {
      const data = await reportService.fetchKitchenReport({
        start_date: formData.start_date,
        end_date: formData.end_date,
        department_id: formData.department_id,
        employee_id: formData.employee_id,
      });
      setReportData(data);
    } catch (error) {
      console.error('Error fetching kitchen report:', error);
    }
  };

  const handleClear = useCallback((field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const handleSubmit = useCallback(() => {
    fetchData();
  }, [formData]);

  const handleDepartmentSelect = useCallback((departmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      department_id: departmentId,
    }));
    setOpenNestedDropdown(false);
  }, []);

  const handleEmployeeSelect = useCallback((employee) => {
    setFormData((prev) => ({
      ...prev,
      employee_id: employee.id,
      employee: employee.fullname,
    }));
    setEmployeeModalOpen(false);
  }, []);

  const exportToExcel = () => {
    if (!reportData) return;

    const dataToExport = [];
    
    // Create headers
    const headers = ["დეპარტამენტი", "თანამშრომელი", ...reportData.report_periods.flatMap((month, index) => [...reportData.dates_grouped_by_month[index], "Total"]), "საბოლოო ჯამი"];
    dataToExport.push(headers);

    Object.keys(reportData.employee_data).forEach((month) => {
      Object.keys(reportData.employee_data[month]).forEach((department) => {
        Object.keys(reportData.employee_data[month][department]).forEach((employee, index) => {
          const row = [];
          if (index === 0) {
            row.push(department); 
          } else {
            row.push(""); 
          }
          row.push(employee);
          
          reportData.dates_grouped_by_month.forEach((dates, monthIndex) => {
            dates.forEach((date) => {
              row.push(reportData.employee_data[month][department][employee][date] || 0);
            });
            row.push(reportData.employee_data[month][department][employee]["Month Total"]);
          });

          row.push(reportData.employee_data[month][department][employee]["Grand Total"] || 0);

          dataToExport.push(row);
        });

        const deptTotalRow = [`${department} ჯამური`, "", ...reportData.dates_grouped_by_month.flatMap((dates, monthIndex) => [
          ...dates.map((date) => reportData.department_totals[month][department][date] || 0),
          reportData.department_totals[month][department]["Month Total"]
        ]), reportData.yearly_totals[department]["Year Total"] || 0];
        dataToExport.push(deptTotalRow);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);

    // Apply merged cells for department headers
    const mergeCells = [];
    let rowIndex = 1;
    for (let i = 0; i < dataToExport.length; i++) {
      if (dataToExport[i][0] !== "") {
        mergeCells.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 1 } });
        rowIndex++;
      } else {
        rowIndex++;
      }
    }
    worksheet['!merges'] = mergeCells;

    // Styling for header
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1976D2" } },
        alignment: { horizontal: "center" },
      };
    }

    // Styling for data cells
    for (let R = 1; R <= headerRange.e.r; R++) {
      for (let C = 0; C <= headerRange.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kitchen Report");

    XLSX.writeFile(workbook, "KitchenReport.xlsx");
  };

  const reportPeriods = reportData?.report_periods || [];
  const datesGroupedByMonth = reportData?.dates_grouped_by_month || [];
  const departmentTotals = reportData?.department_totals || {};
  const employeeData = reportData?.employee_data || {};
  const yearlyTotals = reportData?.yearly_totals || {};

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between w-full items-center mb-8">
          <h1 className="text-[#1976D2] font-medium text-[23px]">
            სამზარეულოს რეპორტი
          </h1>
          <button
            onClick={exportToExcel}
            className="bg-[#105D8D] px-7 py-4 rounded flex items-center gap-3 text-white text-[16px] border relative"
          >
            ჩამოტვირთვა
            <span className="absolute inset-0 border border-white border-dashed rounded"></span>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <GeneralInputGroup
            name="start_date"
            placeholder="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, start_date: e.target.value }))
            }
          />
          <GeneralInputGroup
            name="end_date"
            placeholder="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, end_date: e.target.value }))
            }
          />
          <DepartmentInput
            value={
              nestedDepartments.find((d) => d.id === formData.department_id)?.name || ''
            }
            onClear={() => handleClear('department_id')}
            onSearchClick={() => setOpenNestedDropdown(true)}
          />
          <EmployeeInput
            value={formData.employee}
            onClear={() => handleClear('employee')}
            onSearchClick={() => setEmployeeModalOpen(true)}
          />
          <button
            className="bg-[#1AB7C1] rounded-lg min-w-[75px] flex items-center justify-center py-2"
            onClick={handleSubmit}
          >
            <img src={SearchIcon}   alt="Search Icon" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full bg-white border text-sm">
              <thead className="bg-[#1976D2] text-white">
                <tr>
                  <th rowSpan={2} className="py-2 px-4 border">დეპარტამენტი</th>
                  <th rowSpan={2} className="py-2 px-4 border">თანამშრომელი</th>
                  {reportPeriods.map((month, index) => (
                    <React.Fragment key={month}>
                      <th colSpan={datesGroupedByMonth[index].length + 1} className="py-2 px-4 border text-center">
                        {month}
                      </th>
                    </React.Fragment>
                  ))}
                  <th rowSpan={2} className="py-2 px-4 border">საბოლოო ჯამი</th>
                </tr>
                <tr>
                  {datesGroupedByMonth.map((dates, monthIndex) => (
                    <React.Fragment key={monthIndex}>
                      {dates.map((date) => (
                        <th key={date} className="py-2 px-4 border text-center">{date}</th>
                      ))}
                      <th className="py-2 px-4 border text-center">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(employeeData).map((month) =>
                  Object.keys(employeeData[month]).map((department) => (
                    <React.Fragment key={department}>
                      {Object.keys(employeeData[month][department]).map((employee, index) => (
                        <tr key={`${month}-${department}-${employee}-${index}`}>
                          {index === 0 && (
                            <td
                              className="py-2 px-4 border font-bold"
                              rowSpan={Object.keys(employeeData[month][department]).length + 1}
                            >
                              {department}
                            </td>
                          )}
                          <td className="py-2 px-4 border">{employee}</td>
                          {datesGroupedByMonth.map((dates, monthIndex) => (
                            <React.Fragment key={monthIndex}>
                              {dates.map((date) => {
                                const isFixed = employeeData[month][department][employee][date] > 0;
                                return (
                                  <td
                                    key={date}
                                    className={`py-2 px-4 border text-center ${
                                      isFixed ? "bg-green-500 text-white" : ""
                                    }`}
                                  >
                                    {employeeData[month][department][employee][date] || 0}
                                  </td>
                                );
                              })}
                              <td className="py-2 px-4 border font-bold text-center">
                                {employeeData[month][department][employee]["Month Total"]}
                              </td>
                            </React.Fragment>
                          ))}
                          <td className="py-2 px-4 border font-bold text-center">
                            {employeeData[month][department][employee]["Grand Total"] || 0}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-200">
                        <td className="py-2 px-4 border font-bold" colSpan={1}>
                          {department} ჯამური
                        </td>
                        {datesGroupedByMonth.map((dates, monthIndex) => (
                          <React.Fragment key={monthIndex}>
                            {dates.map((date) => (
                              <td
                                key={date}
                                className="py-2 px-4 border font-bold text-center"
                              >
                                {departmentTotals[month][department][date] || 0}
                              </td>
                            ))}
                            <td className="py-2 px-4 border font-bold text-center">
                              {departmentTotals[month][department]["Month Total"]}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className="py-2 px-4 border font-bold text-center">
                          {yearlyTotals[department]["Year Total"] || 0}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openNestedDropdown && (
          <NestedDropdownModal
            header="დეპარტამენტები"
            isOpen={openNestedDropdown}
            onClose={() => setOpenNestedDropdown(false)}
            onSelect={handleDepartmentSelect}
            data={nestedDepartments} 
            link={"/departments"}
          />
        )}
        <EmployeeModal
          isOpen={EmployeeModalOpen}
          onClose={() => setEmployeeModalOpen(false)}
          onSelectEmployee={handleEmployeeSelect}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default KitchenReport;
