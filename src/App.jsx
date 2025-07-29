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
import AllDoctors from './components/AllDoctors';
import BookAppointment from './components/BookAppointment';
import PatientAppointments from './components/PatientAppointments';
import DoctorAppointments from './components/DoctorAppointments';
import PatientFeedback from './components/PatientFeedback';
import PatientFeedbackForm from './components/PatientFeedbackForm';
import DoctorFeedback from './components/DoctorFeedback';

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
        <Route path='/patient/doctors' element={<AllDoctors />} />
        <Route path="/patient/book-appointment/:doctorId" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path='patient/feedback' element={<PatientFeedback />} />
        <Route path="/patient/feedbackform/:doctorId" element={<PatientFeedbackForm />} />
        <Route path="/doctor/feedback" element={<DoctorFeedback />} />
      </Route>
    </Routes>
  );
}

export default App;