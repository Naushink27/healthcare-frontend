import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'; // to send data to backend or email service
import toast from 'react-hot-toast';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace this with actual email sending logic (see Step 3 below)
    try {
      await axios.post('https://formspree.io/f/xblkarnr', formData); // see below how to get this URL
  toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // reset form
    } catch (error) {
toast.error('Failed to send message. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white py-16 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Have questions or need assistance? Reach out to us, and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Contact Healthcare"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
