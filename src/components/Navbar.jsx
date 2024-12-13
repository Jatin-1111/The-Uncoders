import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase auth instance

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [user, setUser] = useState(null); // Track authenticated user
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const menuRef = useRef(null); // Reference for detecting clicks outside
  const dropdownRef = useRef(null); // Reference for dropdown clicks outside
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
      setUser(null); // Reset user state
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleContentClick = () => {
    if (!user) {
      // Redirect to login page with the intent to go to Content
      navigate("/login", { state: { redirectTo: "/Content" } });
    } else {
      navigate("/Content");
    }
  };

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close menus when clicking outside
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
            e.stopPropagation(); // Prevent click propagation for toggle
            toggleMobileMenu();
          }}
          className="flex flex-col justify-between w-6 h-5"
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
      </div>

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
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/About" },
              { label: "Content", action: handleContentClick },
              { label: "Contact", href: "/Contact" },
            ].map((item, index) => (
              <motion.li
                key={item.label}
                initial="hidden"
                animate="visible"
                custom={index}
                variants={desktopLinkVariants}
                className="flex justify-center items-center"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      item.action();
                    }}
                    className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>
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
            className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
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
            className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
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
              className="block px-4 text-[#D6CFE9] hover:text-[#C2B4E2] transition-colors"
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
