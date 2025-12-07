import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const pages = [
  { name: "Vendor", to: "/vendor" },
  { name: "RFP", to: "/" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 md:px-[100px] h-[60px] flex justify-between items-center">
      
      {/* Logo */}
      <p className="text-3xl font-bold">RFP</p>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10 font-bold text-lg">
        {pages.map((p) => (
          <NavLink
            key={p.to}
            to={p.to}
            className={({ isActive }) =>
              `hover:scale-110 transition-all duration-100 ease-in-out ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-black"
              }`
            }
          >
            {p.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-[60px] left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 gap-5 font-bold text-lg md:hidden transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {pages.map((p) => (
          <NavLink
            key={p.to}
            to={p.to}
            onClick={() => setOpen(false)} // closes menu when clicking
            className={({ isActive }) =>
              `transition-all duration-100 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`
            }
          >
            {p.name}
          </NavLink>
        ))}
      </div>

    </nav>
  );
};

export default Navbar;
