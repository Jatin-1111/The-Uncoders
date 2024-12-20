import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleContentClick = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: "/Content" } });
    } else {
      navigate("/Content");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        closeMobileMenu();
        setDropdownVisible(false);
      }
    };

    if (mobileMenuVisible || dropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuVisible, dropdownVisible]);

  // Sliding menu variants
  const menuVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "100%", opacity: 0 },
  };

  const menuTransition = {
    type: "tween",
    duration: 0.4,
    ease: "easeInOut",
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
      className="bg-[#403C5C] h-[100px] w-full flex justify-between items-center px-6 lg:px-12 shadow-md relative z-10"
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
      <div className="lg:hidden flex items-center space-x-4 relative z-50">
        {user ? (
          <div ref={dropdownRef}>
            <FaUserCircle
              className="text-2xl text-[#D6CFE9] cursor-pointer"
              onClick={toggleDropdown}
            />
            <AnimatePresence>
              {dropdownVisible && (
                <motion.div
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-3 text-sm text-[#403C5C]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left hover:text-[#5C6BC0]"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <a
            href="/login"
            className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Login
          </a>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMobileMenu();
          }}
          className="focus:outline-none"
          aria-label="Toggle Menu"
        >
          <AnimatePresence mode="wait">
            {mobileMenuVisible ? (
              <motion.div
                key="close"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiX className="text-3xl text-[#D6CFE9] hover:text-[#C2B4E2]" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiMenu className="text-3xl text-[#D6CFE9] hover:text-[#C2B4E2]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuVisible && (
          <>
            {/* Black Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            {/* Sliding Menu */}
            <motion.div
              ref={menuRef}
              className="fixed top-0 right-0 h-full w-64 bg-[#403C5C] shadow-lg z-50 flex flex-col items-center justify-center"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={menuTransition}
            >
              {/* Close Button */}
              <button
                onClick={closeMobileMenu}
                className="absolute top-4 right-4 text-[#D6CFE9] focus:outline-none"
              >
                <HiX className="text-3xl hover:text-[#C2B4E2]" />
              </button>

              {/* Logo in Menu */}
              <h1 className="text-3xl font-extrabold text-[#D6CFE9] mb-8">
                <a href="/" onClick={closeMobileMenu}>
                  EDUSPHERE
                </a>
              </h1>

              {/* Menu Items */}
              <ul className="flex flex-col items-center space-y-6 text-lg font-semibold text-[#D6CFE9]">
                {[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/About" },
                  { label: "Content", action: handleContentClick },
                  { label: "Contact", href: "/Contact" },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="hover:text-[#C2B4E2] transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          item.action();
                        }}
                        className="hover:text-[#C2B4E2] transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Navigation Links */}
      <ul className="hidden lg:flex lg:items-center space-x-8 font-semibold text-lg text-[#D6CFE9]">
        {[
          { label: "Home", href: "/" },
          { label: "About", href: "/About" },
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
        <motion.li
          initial="hidden"
          animate="visible"
          custom={2}
          variants={desktopLinkVariants}
        >
          <button
            onClick={handleContentClick}
            className="block px-2 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Content
          </button>
        </motion.li>
        <motion.li
          initial="hidden"
          animate="visible"
          custom={3}
          variants={desktopLinkVariants}
        >
          <a
            href="/Contact"
            className="block px-2 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
          >
            Contact
          </a>
        </motion.li>
        <motion.li
          initial="hidden"
          animate="visible"
          custom={4}
          variants={desktopLinkVariants}
        >
          {user ? (
            <div ref={dropdownRef} className="relative">
              <FaUserCircle
                className="text-2xl cursor-pointer"
                onClick={toggleDropdown}
              />
              <AnimatePresence>
                {dropdownVisible && (
                  <motion.div
                    className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-3 text-sm text-[#403C5C]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left hover:text-[#5C6BC0]"
                    >
                      
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a
              href="/Login"
              className="block px-2 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
            >
              Login
            </a>
          )}
        </motion.li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;