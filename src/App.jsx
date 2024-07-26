import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Login from './pages/Auth/Login/Login';
import EmployeeCreate from './pages/Employee/Create/EmployeeCreate';
import GeneralReport from './pages/Report/General/GeneralReport';
import DetailedReport from './pages/Report/Detailed/DetailedReport';
import CommentAnalyze from './pages/Comment/Analyze/CommentAnalyze';
import CommentTable from './pages/Comment/Table/CommentTable';
import Direct from './pages/Direct/Direct';
import Order from './pages/Order/Order';
import CreatedEmployees from './pages/Employee/Created/CreatedEmployees';
import Schedule from './pages/Schedule/Schedule';
import Group from './pages/Group/Group';
import Building from './pages/Building/Building';
import Department from './pages/Department/Department';
import User from './pages/User/User';
import DepartmentDistribution from './pages/DepartmentDistribution/DepartmentDistribution';
import EmployeeEdit from './pages/Employee/Edit/EmployeeEdit';
import useAuth from './hooks/useAuth';
import { fetchAsyncUser } from "../src/redux/userDataSlice"; 
import UserType from './pages/UserType/UserType';
import CommandType from './pages/CommandType/CommandType';
import ForgiveType from './pages/ForgiveType/ForgiveType';
import EmployeeAccess from './pages/EmployeeAccess/EmployeeAccess';
import ArchivedEmployee from './pages/Employee/Archived/ArchivedEmployee';
import AccessGroupDistribution from './pages/AccessGroupDistribution/AccessGroupDistribution';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {

  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    if (initialLoad) {
      dispatch(fetchAsyncUser()).then(() => {
        setInitialLoad(false);
      });
    }
  }, [initialLoad]);

  if (initialLoad || isLoading) {
    return (
      <div role="status" className='w-screen h-screen flex justify-center items-center'>
          <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
          <div className='font-bold text-5xl ml-2'>მიმდინარეობს ჩატვირთვა</div>
      </div>
    )
  }
  


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employees/create" element={<EmployeeCreate />} />
        <Route path="/reports/general" element={<ProtectedRoute element={<GeneralReport />} />} />
        <Route path="/reports/detailed" element={<ProtectedRoute element={<DetailedReport />} />} />
        <Route path="/comments/analyze" element={<ProtectedRoute element={<CommentAnalyze />} />} />
        <Route path="/comments/table" element={<ProtectedRoute element={<CommentTable />} />} />
        <Route path="/direct" element={<ProtectedRoute element={<Direct />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<Order />} />} />
        <Route path="/employees" element={<ProtectedRoute element={<CreatedEmployees />} />} />
        <Route path="/employees/archived" element={<ProtectedRoute element={<ArchivedEmployee />} />} />
        <Route path="/employees/edit/:id" element={<EmployeeEdit/>} />
        <Route path="/employees/access" element={<EmployeeAccess/>} />
        <Route path="/schedules" element={<ProtectedRoute element={<Schedule />} />} />
        <Route path="/groups" element={<ProtectedRoute element={<Group />} />} />
        <Route path="/buildings" element={<ProtectedRoute element={<Building />} />} />
        <Route path="/departments" element={<ProtectedRoute element={<Department />} />} />
        <Route path="/users" element={<ProtectedRoute element={<User />} />} />
        <Route path="/departments-distributions" element={<ProtectedRoute element={<DepartmentDistribution />} />} />
        <Route path="/user-types" element={<ProtectedRoute element={<UserType />} />} />
        <Route path="/command-types" element={<ProtectedRoute element={<CommandType/>} />} />
        <Route path="/forgive-types" element={<ProtectedRoute element={<ForgiveType/>} />} />
        <Route path="/buildings/access-groups" element={<ProtectedRoute element={<AccessGroupDistribution/>} />}/>
      </Routes>
    </Router>
  );
}

export default App;
