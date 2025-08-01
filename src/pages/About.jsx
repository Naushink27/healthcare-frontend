import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white py-16 px-4 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">
            About HealthCare Pro
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            HealthCare Pro is a simple yet powerful web platform designed to connect patients and doctors—especially for hospitals or clinics that lack their own online systems.
            <br /><br />
            Patients can update their profile, explore available doctors, and book appointments easily. Once the appointment is confirmed, they can visit the respective hospital for check-ups and later provide feedback based on their experience.
            <br /><br />
            Doctors can manage their profiles, view all booked appointments, and accept them as per their availability. This ensures better schedule planning and smooth communication.
            <br /><br />
            Acting as a middleware between patients and offline hospitals, HealthCare Pro helps streamline the appointment process, saving time and improving accessibility—especially in areas where digital health systems are still missing.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="About Healthcare"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
