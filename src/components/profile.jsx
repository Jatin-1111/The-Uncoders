import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, LogOut } from "lucide-react";
import { db, auth } from "../firebase"; // Ensure auth is imported from your firebase config
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Fetch user data when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        setEmail(user.email);
        setUserId(user.uid);

        // Set the "Member Since" date from Firebase Authentication metadata
        const creationTime = user.metadata?.creationTime;
        setMemberSince(creationTime);

        // Fetch additional user data from Firestore
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.name || "");
          }
        });
      } else {
        // Handle user not logged in (e.g., redirect to login page)
        console.error("User is not logged in");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Save data to Firestore (name only)
  const saveToFirestore = async (updatedData) => {
    try {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }
      const userRef = doc(db, "users", userId); // Ensure userId is valid
      await setDoc(userRef, updatedData, { merge: true }); // Merge updates with existing data
      console.log("User data saved to Firestore:", updatedData);
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
    }
  };

  const handleEditProfile = async () => {
    const updatedData = {};
    if (name !== "") updatedData.name = name;

    if (Object.keys(updatedData).length > 0) {
      await saveToFirestore(updatedData);
      console.log("Profile updated:", updatedData);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logged out");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
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
      <div className="container mx-auto max-w-4xl py-8 mt-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#403C5C]">
            Welcome back, {name || "User"}!
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
                  <p className="text-sm text-[#403C5C] opacity-80">Full Name</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg font-semibold text-[#403C5C] border border-[#CBAACB] rounded-lg px-4 py-2"
                  />
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
              <button
                onClick={handleEditProfile}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#D6CFE9] text-[#403C5C] px-6 py-2 rounded-lg hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors"
              >
                <Settings size={20} />
                Save Changes
              </button>
              <button
                onClick={handleLogout}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#F28C8C] text-white px-6 py-2 rounded-lg hover:bg-[#E06B6B] transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
