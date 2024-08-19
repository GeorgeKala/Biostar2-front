import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../../Layouts/AuthenticatedLayout';
import reportService from '../../../services/report';

const KitchenReport = () => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await reportService.fetchKitchenReport({
          start_date: '2024-08-01',
          end_date: '2024-08-31',
        });
        setReportData(data);
      } catch (error) {
        console.error('Error fetching kitchen report:', error);
      }
    };

    fetchData();
  }, []);

  const dates = reportData?.dates || [];
  const departmentTotals = reportData?.department_totals || {};
  const employeeData = reportData?.employee_data || {};

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">სამზარეულოს რეპორტი</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th rowSpan={2} className="py-2 px-4 border">დეპარტამენტი</th>
              <th rowSpan={2} className="py-2 px-4 border">თანამშრომელი</th>
              {dates.map((date) => (
                <th key={date} colSpan={1} className="py-2 px-4 border text-center">
                  {date}
                </th>
              ))}
              <th rowSpan={2} className="py-2 px-4 border">საბოლოო ჯამი</th>
            </tr>
            <tr>
              {dates.map((date) => (
                <th key={date} className="py-2 px-4 border text-center">Fixed Count</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(employeeData).map((department) => (
              <React.Fragment key={department}>
                {Object.keys(employeeData[department]).map((employee, index) => (
                  <tr key={`${department}-${employee}-${index}`}>
                    {index === 0 && (
                      <td
                        className="py-2 px-4 border font-bold"
                        rowSpan={Object.keys(employeeData[department]).length}
                      >
                        {department}
                      </td>
                    )}
                    <td className="py-2 px-4 border">{employee}</td>
                    {dates.map((date) => (
                      <td key={date} className="py-2 px-4 border text-center">
                        {employeeData[department][employee][date] || 0}
                      </td>
                    ))}
                    <td className="py-2 px-4 border font-bold text-center">
                      {employeeData[department][employee]['Grand Total']}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200">
                  <td className="py-2 px-4 border font-bold" colSpan={2}>
                    {department} ჯამური
                  </td>
                  {dates.map((date) => (
                    <td key={date} className="py-2 px-4 border font-bold text-center">
                      {departmentTotals[department][date] || 0}
                    </td>
                  ))}
                  <td className="py-2 px-4 border font-bold text-center">
                    {departmentTotals[department]['Grand Total']}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
};

export default KitchenReport;
