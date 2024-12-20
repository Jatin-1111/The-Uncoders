import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { 
  UserCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  FileText,
  Mail
} from "lucide-react";

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
      setDropdownVisible(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMobileMenu();
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className={`text-2xl font-bold ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            The UnCoders
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isScrolled 
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" 
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button
                    onClick={item.action}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isScrolled 
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" 
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )}
              </motion.div>
            ))}

            {/* User Menu */}
            <div ref={dropdownRef} className="relative">
              {user ? (
                <motion.button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isScrolled 
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" 
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircle className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.a
                  href="/login"
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    isScrolled 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Login</span>
                </motion.a>
              )}

              <AnimatePresence>
                {dropdownVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuVisible ? (
              <X className={isScrolled ? "text-gray-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
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
                  The UnCoders
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

