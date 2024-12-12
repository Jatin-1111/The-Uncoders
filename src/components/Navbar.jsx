import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const menuRef = useRef(null); // Reference for detecting clicks outside

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    if (mobileMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuVisible]);

  // Framer Motion variants for the mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const desktopLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#403C5C] h-[100px] w-full flex justify-between items-center px-6 lg:px-12 shadow-md relative"
    >
      {/* Logo */}
      <motion.a
        href="/"
        className="text-3xl font-extrabold text-[#D6CFE9] font-sans"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        EDUSPHERE
      </motion.a>

      {/* Hamburger Icon for Mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent click propagation for toggle
          toggleMobileMenu();
        }}
        className="lg:hidden flex flex-col justify-between w-6 h-5 relative z-50"
        aria-label="Toggle Menu"
      >
        <motion.span
          initial={{ rotate: 0, y: 0 }}
          animate={{
            rotate: mobileMenuVisible ? 45 : 0,
            y: mobileMenuVisible ? 8 : 0,
          }}
          className="block w-full h-[2px] bg-[#D6CFE9] transition-all"
        ></motion.span>
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: mobileMenuVisible ? 0 : 1 }}
          className="block w-full h-[2px] bg-[#D6CFE9] transition-opacity"
        ></motion.span>
        <motion.span
          initial={{ rotate: 0, y: 0 }}
          animate={{
            rotate: mobileMenuVisible ? -45 : 0,
            y: mobileMenuVisible ? -8 : 0,
          }}
          className="block w-full h-[2px] bg-[#D6CFE9] transition-all"
        ></motion.span>
      </button>

      {/* Mobile Navigation Links */}
      <AnimatePresence>
        {mobileMenuVisible && (
          <motion.ul
            ref={menuRef}
            className="absolute top-[100px] left-0 w-full bg-[#403C5C] text-center z-40 font-semibold text-lg text-[#D6CFE9] space-y-4 lg:hidden py-6 shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <li>
              <a
                href="/"
                onClick={closeMobileMenu}
                className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/About"
                onClick={closeMobileMenu}
                className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/Content"
                onClick={closeMobileMenu}
                className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
              >
                Content
              </a>
            </li>
            <li>
              <a
                href="/Login"
                onClick={closeMobileMenu}
                className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/Contact"
                onClick={closeMobileMenu}
                className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
              >
                Contact Us
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Desktop Navigation Links */}
      <ul className="hidden lg:flex lg:items-center space-x-8 font-semibold text-lg text-[#D6CFE9]">
        {[
          { label: "Home", href: "/" },
          { label: "About", href: "/About" },
          { label: "Content", href: "/Content" },
          { label: "Login", href: "/Login" },
          { label: "Contact", href: "/Contact" },
        ].map((link, i) => (
          <motion.li
            key={link.href}
            initial="hidden"
            animate="visible"
            custom={i}
            variants={desktopLinkVariants}
          >
            <a
              href={link.href}
              className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
            >
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Navbar;
