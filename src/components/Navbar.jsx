import { useState } from "react";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <nav className="bg-[#403C5C] h-[90px] w-full flex justify-between items-center px-6 lg:px-12 shadow-md">
      {/* Logo */}
      <a
        href="index.html"
        className="text-3xl font-extrabold text-[#D6CFE9] font-sans"
      >
        EDUSPHERE
      </a>

      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden text-[#D6CFE9] text-2xl focus:outline-none"
      >
        {mobileMenuVisible ? "✖" : "☰"}
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          mobileMenuVisible ? "block" : "hidden"
        } lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-8 font-semibold text-lg absolute lg:static bg-[#403C5C] w-full lg:w-auto top-[90px] left-0 lg:top-auto z-40 lg:z-auto`}
      >
        <li>
          <a
            href="index.html"
            className="block lg:inline px-4 lg:px-0 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="about.html"
            className="block lg:inline px-4 lg:px-0 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="content.html"
            className="block lg:inline px-4 lg:px-0 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Content
          </a>
        </li>
        <li className="relative">
          {/* Profile Icon */}
          <button
            onClick={toggleMenu}
            className="w-9 h-9 rounded-full bg-[#D4C1EC] text-[#403C5C] flex items-center justify-center font-bold transition-colors hover:bg-[#CBAACB] hover:text-white"
          >
            {/* Placeholder Initials for Profile */}
            P
          </button>

          {/* Dropdown Menu */}
          {menuVisible && (
            <div className="absolute top-12 right-0 bg-[#403C5C] rounded-lg shadow-lg text-center z-50">
              <a
                href="profile.html"
                className="block px-4 py-2 text-[#D6CFE9] hover:bg-[#C2B4E2] hover:text-[#403C5C] transition-colors"
              >
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-[#D6CFE9] hover:bg-[#C2B4E2] hover:text-[#403C5C] transition-colors"
              >
                Logout
              </a>
            </div>
          )}
        </li>
        <li>
          <a
            href="contact.html"
            className="block lg:inline px-4 lg:px-0 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Contact Us
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
