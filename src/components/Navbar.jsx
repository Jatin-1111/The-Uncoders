import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
  Mail,
  Settings,
} from "lucide-react";
import { auth, db } from "../firebase";
import PropTypes from "prop-types";
import { doc, getDoc } from "firebase/firestore";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center w-80 p-4 rounded-lg border shadow-lg bg-[#FAF4ED] text-[#403C5C] border-[#CBAACB]"
    >
      <div className="flex-shrink-0">{type === "success" ? "🚀" : "❌"}</div>
      <div className="ml-3 flex-grow font-medium text-sm">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

// ToastContainer Component
const ToastContainer = ({ children }) => (
  <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>{children}</AnimatePresence>
  </div>
);

ToastContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toasts, setToasts] = useState([]);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const addToast = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Info },
    {
      label: "Content",
      action: useCallback(() => {
        if (!user) {
          navigate("/login", { state: { redirectTo: "/content" } });
        } else {
          navigate("/content");
        }
      }, [user, navigate]),
      icon: FileText,
    },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  const checkAdminStatus = async (user) => {
    try {
      if (!user.email) return false;
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      return !adminDoc.empty;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const getNavItems = () => {
    if (isAdmin) {
      return [
        ...navItems,
        {
          label: "Admin Panel",
          action: () => navigate("/admin-panel69"),
          icon: Settings,
        },
      ];
    }
    return navItems;
  };

  useEffect(() => {
    let isInitialAuthCheck = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const adminStatus = await checkAdminStatus(currentUser);
        setIsAdmin(adminStatus);

        if (!user && !isInitialAuthCheck) {
          addToast("Welcome back!", "success");
        }
      } else {
        setIsAdmin(false);
      }
      isInitialAuthCheck = false;
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuVisible((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuVisible(false);
  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        addToast("Successfully logged out!", "success");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        addToast("Failed to log out. Please try again!", "error");
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (!menuRef.current || !menuRef.current.contains(event.target)) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target))
      ) {
        setMobileMenuVisible(false);
        setDropdownVisible(false);
      }
    };

    if (mobileMenuVisible || dropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuVisible, dropdownVisible]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 bg-[#FAF4ED] ${
          isScrolled ? "shadow-md backdrop-blur-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="text-2xl md:text-3xl font-bold text-[#403C5C] hover:text-[#9A86CF] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              The UnCoders
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {getNavItems().map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#403C5C] hover:bg-[#D6CFE9] transition-colors text-sm font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <button
                      onClick={item.action}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#403C5C] hover:bg-[#D6CFE9] transition-colors text-sm font-medium"
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
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[#403C5C] hover:bg-[#D6CFE9] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserCircle className="w-5 h-5" />
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.a
                    href="/login"
                    className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-[#D6CFE9] text-[#403C5C] hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Login</span>
                  </motion.a>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-[#CBAACB]"
                    >
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-3 text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
                        onClick={() => setDropdownVisible(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
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
              className="lg:hidden p-2 rounded-lg text-[#403C5C] hover:bg-[#D6CFE9]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuVisible ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuVisible && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-[#CBAACB] shadow-lg"
            >
              <div className="max-w-7xl mx-auto py-4 px-4 space-y-1">
                {getNavItems().map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          closeMobileMenu();
                          item.action();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </motion.div>
                ))}

                {user ? (
                  <>
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </a>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-[#403C5C] hover:bg-[#FAF4ED] transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <a
                    href="/login"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-[#D6CFE9] text-[#403C5C] hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </>
  );
};

export default Navbar;
