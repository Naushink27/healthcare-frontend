import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/Login';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorProfile from './components/DoctorProfile';
import PatientProfile from './components/PatientProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile/>}/>
        <Route path="/patient/profile" element={<PatientProfile />} />
      </Route>
    </Routes>
  );
}

export default App;