import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth"; // Import Firebase authentication methods

// Toast Component in JSX with PropTypes
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className="flex items-center w-80 p-4 rounded-lg border shadow-lg bg-[#FAF4ED] text-[#403C5C] border-[#CBAACB]"
  >
    <div className="flex-shrink-0">
      {type === "success" ? "🚀" : <CheckCircle className="w-5 h-5" />}
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

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

// ToastContainer Component in JSX with PropTypes
const ToastContainer = ({ children }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>{children}</AnimatePresence>
  </div>
);

ToastContainer.propTypes = {
  children: PropTypes.node,
};

// Success View Component with PropTypes
const SuccessView = ({ onReturn }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center space-y-4"
  >
    <CheckCircle className="w-16 h-16 text-green-500" />
    <p className="text-center text-[#403C5C] text-lg">
      Your password has been successfully reset. You can now log in with your
      new password.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="mt-4 px-6 py-2 bg-[#403C5C] text-white font-semibold rounded-lg shadow-lg hover:bg-[#5C6BC0]"
      onClick={onReturn}
    >
      Return to Login
    </motion.button>
  </motion.div>
);

SuccessView.propTypes = {
  onReturn: PropTypes.func.isRequired,
};

// Reset Form Component with PropTypes
const ResetForm = ({ error, newPassword, onPasswordChange, onSubmit }) => (
  <motion.form
    onSubmit={onSubmit}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col space-y-4"
  >
    {error && (
      <Alert className="bg-red-50 border-red-200">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    <div>
      <label className="block text-sm font-medium text-[#403C5C] mb-1">
        New Password
      </label>
      <input
        type="password"
        value={newPassword}
        onChange={onPasswordChange}
        placeholder="Enter your new password"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
      />
    </div>
    <motion.button
      type="submit"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-3 bg-[#403C5C] text-white font-semibold rounded-lg hover:bg-[#5C6BC0]"
    >
      Reset Password
    </motion.button>
  </motion.form>
);

ResetForm.propTypes = {
  error: PropTypes.string,
  newPassword: PropTypes.string.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const ResetPassword = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const oobCode = new URLSearchParams(location.search).get("oobCode"); // Get the oobCode from URL

  const addToast = React.useCallback((message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handlePasswordChange = React.useCallback((e) => {
    setNewPassword(e.target.value);
  }, []);

  const handleResetPassword = React.useCallback(
    async (e) => {
      e.preventDefault();

      if (!newPassword || newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      if (!oobCode) {
        setError("Invalid or expired reset link.");
        return;
      }

      try {
        const auth = getAuth();
        await confirmPasswordReset(auth, oobCode, newPassword); // Firebase password reset logic
        setSuccess(true);
        setNewPassword(""); // Clear password state after success
        setError("");
        addToast("Password successfully reset!", "success");
      } catch (error) {
        setError("Failed to reset password. The link might have expired.");
        addToast("Failed to reset password", "error");
      }
    },
    [newPassword, oobCode, addToast]
  );

  const handleReturn = React.useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ECE4DA] via-[#D6CFE9] to-[#CBAACB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-[90%] max-w-md"
      >
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#403C5C] to-[#5C6BC0] text-white">
            <CardTitle className="text-2xl font-extrabold">
              {success ? "Password Reset Successful" : "Reset Password"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {success ? (
                <SuccessView onReturn={handleReturn} />
              ) : (
                <ResetForm
                  error={error}
                  newPassword={newPassword}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={handleResetPassword}
                />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
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

export default ResetPassword;
