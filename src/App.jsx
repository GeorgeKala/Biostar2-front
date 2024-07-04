import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Home from './pages/Home/Home';
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

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/employees/create' element={<EmployeeCreate/>}/>
          <Route path='/reports/general' element={<GeneralReport/>}/>
          <Route path='/reports/detailed' element={<DetailedReport/>}/>
          <Route path='/comments/analyze' element={<CommentAnalyze/>}/>
          <Route path='/comments/table' element={<CommentTable/>}/>
          <Route path='/direct' element={<Direct/>}/>
          <Route path='/orders' element={<Order/>}/>
          <Route path='/employees' element={<CreatedEmployees/>}/>
          <Route path='/schedules' element={<Schedule/>}/>
          <Route path='/groups' element={<Group/>}/>
          <Route path='/buildings' element={<Building/>}/>
          <Route path='/departments' element={<Department/>}/>
          <Route path='/users' element={<User/>}/>
          <Route path='/departments-distributions' element={<DepartmentDistribution/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
