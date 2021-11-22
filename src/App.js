import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';

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

  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && (
            <Sidebar />
          )}
          <div className="container">
            <Navbar />
            <Routes>
              <Route path='/' element={(!user && <Navigate to='/login'/>) || (user && <Dashboard />)} />
              <Route path='/create' element={(!user && <Navigate to='/login'/>) || (user && <Create />)} />
              <Route path='/login' element={(user && <Navigate to='/'/>) || (!user && <Login />)} />
              <Route path='/project' element={(!user && <Navigate to='/login'/>) || (user && <Project />)} />
              <Route path='/signup' element={(user && <Navigate to='/'/>) || (!user && <Signup />)} />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
