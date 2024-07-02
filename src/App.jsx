import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Home from './pages/Home/Home';
import EmployeeCreate from './pages/Employee/Create/EmployeeCreate';
import GeneralReport from './pages/Report/General/GeneralReport';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/employees/create' element={<EmployeeCreate/>}/>
          <Route path='reports/general' element={<GeneralReport/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
