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
            At HealthCare Pro, we are dedicated to making healthcare accessible and efficient. Our platform allows you to book appointments, consult with doctors online, and securely manage your medical records—all in one place.
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