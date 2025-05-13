import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">HealthCare</h1>
        <nav className="space-y-2 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to='/about' className="hover:underline">About Us</Link>
          <Link to='/contact' className="hover:underline">Contact</Link>
          <button className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition">Login</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;