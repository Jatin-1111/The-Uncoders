import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, X, Loader2 } from "lucide-react";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { initAuthStateObserver } from "../services/firebaseserivce";
import { profileService } from "../services/profileService";

const LoadingButton = ({ loading = false, onClick, children }) => (
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
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

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

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

const ToastContainer = ({ children }) => (
  <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>{children}</AnimatePresence>
  </div>
);

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
  const [newEmail, setNewEmail] = useState("");
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

  useEffect(() => {
    const unsubscribe = initAuthStateObserver(({ user, userData }) => {
      if (user) {
        setEmail(user.email);
        setNewEmail(user.email);
        setMemberSince(user.metadata?.creationTime);

        if (userData) {
          setName(userData.name || "Guest");
          if (!isInitialized) {
            addToast(
              "Welcome back, " + (userData.name || "Guest") + "!",
              "success"
            );
            setIsInitialized(true);
          }
        } else {
          console.warn("User document not found in Firestore.");
          addToast(
            "Profile not fully set up. Please update your information.",
            "error"
          );
          setIsInitialized(true);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // const saveToFirestore = async (updatedData) => {
  //   try {
  //     if (!userId) {
  //       addToast("Failed to save: User ID not found", "error");
  //       return;
  //     }

  //     const userRef = doc(db, "users", userId);
  //     await setDoc(userRef, updatedData, { merge: true });

  //     if (email !== newEmail) {
  //       await updateEmail(auth.currentUser, newEmail);
  //       setEmail(newEmail);
  //     }

  //     const savedDoc = await getDoc(userRef);
  //     if (!savedDoc.exists()) {
  //       addToast("Failed to verify saved data", "error");
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     addToast("Failed to save profile: " + error.message, "error");
  //     throw error;
  //   }
  // };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedName = await profileService.updateName(name);
      setName(updatedName);
      setIsEditing(false);
      addToast("Profile updated successfully!", "success");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitialLetter = () => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logged out");
        addToast("Successfully logged out!", "success");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        addToast("Failed to log out. Please try again!", "error");
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
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#D6CFE9] border-4 border-[#CBAACB] flex items-center justify-center text-3xl font-bold text-[#403C5C]">
              {getInitialLetter()}
            </div>
          </div>
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
                  <label className="text-sm text-[#403C5C] opacity-80 block">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-lg font-semibold text-[#403C5C] border border-[#CBAACB] rounded-lg px-4 py-2 mt-2 w-full"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-[#403C5C]">
                      {name}
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-lg bg-[#FAF4ED] border border-[#CBAACB]">
                  <label className="text-sm text-[#403C5C] opacity-80 block">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="text-lg font-semibold text-[#403C5C] border border-[#CBAACB] rounded-lg px-4 py-2 mt-2 w-full"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-[#403C5C]">
                      {email}
                    </p>
                  )}
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
