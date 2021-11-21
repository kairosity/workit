import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


// styles
import './App.css'

// pages & components
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Project from './pages/project/Project'
import Signup from './pages/signup/Signup'
import Sidebar from './components/Sidebar';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <div className="container">
          <Navbar />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/create' element={<Create />} />
            <Route path='/login' element={<Login />} />
            <Route path='/project' element={<Project />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App
