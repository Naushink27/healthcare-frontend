import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

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
         <Link to='/login'> <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Get Started
          </button>
          </Link>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Healthcare"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Home;
