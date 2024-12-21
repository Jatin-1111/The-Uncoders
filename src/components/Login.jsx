import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { X, Check } from "lucide-react";

const db = getFirestore();

import PropTypes from "prop-types";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const toastStyle =
    "flex items-center w-80 p-4 rounded-lg border shadow-lg bg-[#FAF4ED] text-[#403C5C] border-[#CBAACB]";

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={toastStyle}
    >
      <div className="flex-shrink-0">
        {type === "success" ? "🚀" : <Check />}
      </div>
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

// Add prop-types validation for Toast
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

// ToastContainer Component
const ToastContainer = ({ children }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>{children}</AnimatePresence>
  </div>
);

// Add prop-types validation for ToastContainer
ToastContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const addToast = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toggleMode = () => {
    setIsSignUpActive((prev) => !prev);
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!name) {
        setError("Name is required for sign-up.");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the name in Firestore
      await setDoc(doc(db, "users", user.uid), { name, email });

      toast.success("Account created successfully!");
      toggleMode();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset the password.");
      return;
    }
  
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`, // Direct user to reset-password page
        handleCodeInApp: true, // Ensure the link opens within the app
      };
  
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      addToast("Password reset email sent! Check your inbox.", "success");
    } catch (err) {
      const errorMessage =
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Failed to send password reset email. Please try again.";
      setError(errorMessage);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ECE4DA] via-[#D6CFE9] to-[#CBAACB]">
      <div className="relative bg-white shadow-2xl overflow-hidden w-[90%] max-w-5xl h-[500px] flex">
        {/* Sign In Form */}
        <motion.div
          className={`w-1/2 px-10 py-12 ${isSignUpActive ? "hidden" : "block"}`}
          initial={{ opacity: 0, x: "100%" }}
          animate={!isSignUpActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-[#403C5C] mb-6">
            Sign In
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
              required
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#5C6BC0] hover:underline"
            >
              Forgot Your Password?
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-[#403C5C] text-white font-semibold rounded-lg hover:bg-[#5C6BC0]"
            >
              Sign In
            </motion.button>
          </form>
        </motion.div>

        {/* Sign Up Form */}
        <motion.div
          className={`w-1/2 px-10 py-12 ${isSignUpActive ? "block" : "hidden"}`}
          initial={{ opacity: 0, x: "-100%" }}
          animate={isSignUpActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-[#403C5C] mb-6">
            Create Account
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-[#403C5C] text-white font-semibold rounded-lg hover:bg-[#5C6BC0]"
            >
              Sign Up
            </motion.button>
          </form>
        </motion.div>

        {/* Toggle Panel with Curved Design */}
        <motion.div
          className="w-2/3 sm:w-3/4 bg-gradient-to-br from-[#403C5C] to-[#5C6BC0] text-white flex flex-col justify-center items-center px-8 py-6 text-center"
          animate={{
            clipPath: isSignUpActive
              ? "polygon(0 0, 100% 0, 100% 100%, 30% 100%)"
              : "polygon(20% 0px, 100% 0px, 100% 100%, 0% 100%)",
          }}
          initial={{
            clipPath: isSignUpActive
              ? "polygon(22% 0px, 100% 0px, 100% 100%, 0% 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 32% 100%)",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 className="text-2xl font-extrabold mb-4">
            {isSignUpActive ? "Welcome Back!" : "Hello, Friend!"}
          </h2>
          <p className="text-base leading-relaxed px-4 sm:px-6 md:px-8 lg:px-10">
            {isSignUpActive
              ? "Sign in to access your account and continue your journey."
              : "Create an account to unlock personalized resources and tools."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMode}
            className="mt-6 px-6 py-2 bg-white text-[#403C5C] font-semibold rounded-lg shadow-lg hover:bg-[#ECE4DA]"
          >
            {isSignUpActive ? "Sign In" : "Sign Up"}
          </motion.button>
        </motion.div>
      </div>
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
    </div>
  );
};

export default Login;
