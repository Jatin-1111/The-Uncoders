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

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/About", icon: Info },
    { label: "Content", action: handleContentClick, icon: FileText },
    { label: "Contact", href: "/Contact", icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuVisible(prev => !prev);
  const closeMobileMenu = () => setMobileMenuVisible(false);
  const toggleDropdown = () => setDropdownVisible(prev => !prev);

  function handleContentClick() {
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
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          !dropdownRef.current?.contains(event.target)) {
        closeMobileMenu();
        setDropdownVisible(false);
      }
    };

    if (mobileMenuVisible || dropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuVisible, dropdownVisible]);

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
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="max-w-7xl mx-auto py-4 px-4 space-y-1">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
                      className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
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
  );
};

export default Navbar;