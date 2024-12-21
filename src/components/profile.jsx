import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, X, Loader2 } from "lucide-react";
import { db, auth } from "../firebase"; // Ensure auth is imported from your firebase config
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const LoadingButton = ({ loading, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`w-full md:w-auto flex items-center justify-center gap-2 ${
      loading
        ? "bg-[#E8E3F5] cursor-not-allowed"
        : "bg-[#D6CFE9] hover:bg-[#D4C1EC] hover:text-[#FAF4ED]"
    } text-[#403C5C] px-6 py-2 rounded-lg transition-colors`}
  >
    {loading ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
      <Settings size={20} />
    )}
    {children}
  </button>
);

LoadingButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

LoadingButton.defaultProps = {
  loading: false,
};

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

// Add prop-types validation for Toast
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

// Add prop-types validation for ToastContainer
ToastContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const Profile = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [toasts, setToasts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const addToast = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setUserId(user.uid);
        const creationTime = user.metadata?.creationTime;
        setMemberSince(creationTime);

        // Only fetch if we haven't initialized the data yet
        if (!isInitialized) {
          const userRef = doc(db, "users", user.uid);
          getDoc(userRef)
            .then((docSnap) => {
              if (docSnap.exists()) {
                const userData = docSnap.data();
                setName(userData.name || "Guest");
                addToast(
                  "Welcome back, " + (userData.name || "Guest") + "!",
                  "success"
                );
              } else {
                console.warn("User document not found in Firestore.");
                addToast(
                  "Profile not fully set up. Please update your information.",
                  "error"
                );
              }
              setIsInitialized(true);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              addToast(
                "Failed to fetch profile data. Please try again later.",
                "error"
              );
              setIsInitialized(true);
            });
        }
      } else {
        console.error("User is not logged in");
        addToast(
          "You are not logged in. Redirecting to login page...",
          "error"
        );
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, isInitialized]);

  // Save data to Firestore (name only)
  const saveToFirestore = async (updatedData) => {
    try {
      if (!userId) {
        console.error("User ID is not available.");
        addToast("Failed to save: User ID not found", "error");
        return;
      }

      console.log("Attempting to save data:", {
        userId,
        updatedData,
        docPath: `users/${userId}`,
      });

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, updatedData, { merge: true });

      // Verify the save by reading back the data
      const savedDoc = await getDoc(userRef);
      if (savedDoc.exists()) {
        console.log("Verification - saved data:", savedDoc.data());
      } else {
        console.error("Verification failed - document not found after save");
        addToast("Failed to verify saved data", "error");
      }

      console.log("User data saved successfully:", updatedData);
    } catch (error) {
      console.error("Detailed save error:", {
        errorMessage: error.message,
        errorCode: error.code,
        stack: error.stack,
      });
      addToast("Failed to save profile: " + error.message, "error");
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      addToast("Name cannot be empty!", "error");
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = { name };
      if (userId) {
        await saveToFirestore(updatedData);
        setIsEditing(false);
        addToast("Profile updated successfully!", "success");
      } else {
        console.error("User ID not available.");
        addToast("Failed to save: User ID not found", "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      addToast("Failed to save profile. Please try again!", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logged out");
        addToast("Successfully logged out!", "success"); // Success toast
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        addToast("Failed to log out. Please try again!", "error"); // Error toast
      });
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FAF4ED] px-4 md:px-8 py-8 md:py-16"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="container mx-auto md:mt-14 max-w-4xl py-8 mt-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#403C5C]">
            Welcome back, {name ? name.split(" ")[0] : "User"}!
          </h2>
        </div>

        <div className="mt-8 md:mt-12">
          <motion.div
            className="w-full p-6 md:p-8 rounded-xl bg-white border border-[#CBAACB] shadow-lg"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4 text-center md:text-left">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#FAF4ED] border border-[#CBAACB]">
                  <label
                    htmlFor="full-name"
                    className="text-sm text-[#403C5C] opacity-80 block"
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      id="full-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="text-lg font-semibold text-[#403C5C] border border-[#CBAACB] rounded-lg px-4 py-2 mt-2 w-full"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-[#403C5C]">
                      {name}
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-lg bg-[#FAF4ED] border border-[#CBAACB]">
                  <p className="text-sm text-[#403C5C] opacity-80">Email</p>
                  <p className="text-lg font-semibold text-[#403C5C]">
                    {email || "Not set"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#FAF4ED] border border-[#CBAACB]">
                  <p className="text-sm text-[#403C5C] opacity-80">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold text-[#403C5C]">
                    {memberSince
                      ? new Date(memberSince).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#FAF4ED] border border-[#CBAACB]">
                  <p className="text-sm text-[#403C5C] opacity-80">
                    Account Status
                  </p>
                  <p className="text-lg font-semibold text-[#403C5C]">Active</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
              {isEditing ? (
                <LoadingButton loading={isSaving} onClick={handleSaveProfile}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </LoadingButton>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#D6CFE9] text-[#403C5C] px-6 py-2 rounded-lg hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors"
                >
                  <Settings size={20} />
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#F28C8C] text-white px-6 py-2 rounded-lg hover:bg-[#E06B6B] transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
          {/* Toast Container */}
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
      </div>
    </motion.div>
  );
};

export default Profile;
