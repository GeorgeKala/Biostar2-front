import React, { useEffect } from 'react';
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
import { fetchAsyncUser } from './redux/userDataSlice';
import EmployeeEdit from './pages/Employee/Edit/EmployeeEdit';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAsyncUser());
  }, [dispatch]);

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
        <Route path="/employees/edit/:id" element={<EmployeeEdit/>} />
        <Route path="/schedules" element={<ProtectedRoute element={<Schedule />} />} />
        <Route path="/groups" element={<ProtectedRoute element={<Group />} />} />
        <Route path="/buildings" element={<ProtectedRoute element={<Building />} />} />
        <Route path="/departments" element={<ProtectedRoute element={<Department />} />} />
        <Route path="/users" element={<ProtectedRoute element={<User />} />} />
        <Route path="/departments-distributions" element={<ProtectedRoute element={<DepartmentDistribution />} />} />
      </Routes>
    </Router>
  );
}

export default App;
