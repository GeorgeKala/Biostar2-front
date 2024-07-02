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
        </Routes>
      </Router>
    </>
  )
}

export default App
