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

const KitchenReport = () => {
  const [reportData, setReportData] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    department_id: '',
    employee: '',
  });

  const [openNestedDropdown, setOpenNestedDropdown] = useState(false);
  const [EmployeeModalOpen, setEmployeeModalOpen] = useState(false);

  const { nestedDepartments } = useSelector((state) => state.departments); 

  const fetchData = async () => {
    try {
      const data = await reportService.fetchKitchenReport({
        start_date: formData.start_date || '2024-07-01',
        end_date: formData.end_date || '2024-08-31',
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
  }, []);

  const reportPeriods = reportData?.report_periods || [];
  const datesGroupedByMonth = reportData?.dates_grouped_by_month || [];
  const departmentTotals = reportData?.department_totals || {};
  const employeeData = reportData?.employee_data || {};

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">სამზარეულოს რეპორტი</h1>

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
            className="bg-[#1AB7C1] rounded-lg px-8 py-5"
            onClick={handleSubmit}
          >
            <img src={SearchIcon} className="w-[50px]" alt="Search Icon" />
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
                              rowSpan={Object.keys(employeeData[month][department]).length}
                            >
                              {department}
                            </td>
                          )}
                          <td className="py-2 px-4 border">{employee}</td>
                          {datesGroupedByMonth.map((dates, monthIndex) => (
                            <React.Fragment key={monthIndex}>
                              {dates.map((date) => (
                                <td key={date} className="py-2 px-4 border text-center">
                                  {employeeData[month][department][employee][date] || 0}
                                </td>
                              ))}
                              {/* Monthly Total */}
                              <td className="py-2 px-4 border font-bold text-center">
                                {employeeData[month][department][employee]['Month Total']}
                              </td>
                            </React.Fragment>
                          ))}
                          <td className="py-2 px-4 border font-bold text-center">
                            {employeeData[month][department][employee]['Grand Total']}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-200">
                        <td className="py-2 px-4 border font-bold" colSpan={2}>
                          {department} ჯამური
                        </td>
                        {datesGroupedByMonth.map((dates, monthIndex) => (
                          <React.Fragment key={monthIndex}>
                            {dates.map((date) => (
                              <td key={date} className="py-2 px-4 border font-bold text-center">
                                {departmentTotals[month][department][date] || 0}
                              </td>
                            ))}
                            {/* Monthly Total */}
                            <td className="py-2 px-4 border font-bold text-center">
                              {departmentTotals[month][department]['Month Total']}
                            </td>
                          </React.Fragment>
                        ))}
                        <td className="py-2 px-4 border font-bold text-center">
                          {departmentTotals[month][department]['Grand Total']}
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
