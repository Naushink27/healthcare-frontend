import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const lines = [
    'Your Health, Our Priority',
    'Book Appointments with Ease',
    'Consult Doctors Anytime, Anywhere',
    'Secure Your Health Records',
  ];

  useEffect(() => {
    let interval;
    const currentLine = lines[textIndex];

    if (isTyping) {
      interval = setInterval(() => {
        if (charIndex < currentLine.length) {
          setCurrentText(currentLine.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsTyping(false);
            setCharIndex(currentLine.length);
          }, 2000);
        }
      }, 100);
    } else {
      interval = setInterval(() => {
        if (charIndex > 0) {
          setCurrentText(currentLine.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          clearInterval(interval);
          setTextIndex((prev) => (prev + 1) % lines.length);
          setIsTyping(true);
          setCharIndex(0);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [textIndex, isTyping, charIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white py-16 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">
            <span>{currentText}</span>
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Book appointments, consult doctors online, and manage your medical records from one place.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Healthcare"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[{
            title: 'Book Appointment',
            icon: '📅',
            desc: 'Schedule visits with doctors in a few clicks.',
          }, {
            title: 'Online Consultation',
            icon: '💬',
            desc: 'Talk to healthcare professionals from home.',
          }, {
            title: 'Medical Records',
            icon: '🗂️',
            desc: 'Securely store and access your medical files.',
          }].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded shadow hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
