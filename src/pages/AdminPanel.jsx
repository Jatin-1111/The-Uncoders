// Fixed Admin-panel.jsx - Main fixes for user data loading

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Users,
  BookOpen,
  Search,
  UserCircle,
  Mail,
  Plus,
  X,
  Shield,
  Edit,
  Trash2,
  Save,
  Video,
  FileText,
  ExternalLink,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react";
import { auth } from "../lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminService, userService } from "../services/firebaseserivce";
import { curriculumService } from "../services/curriculumService";

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
      className={`flex items-center w-80 p-4 rounded-lg border shadow-lg ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : type === "error"
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-yellow-50 border-yellow-200 text-yellow-800"
      }`}
    >
      <div className="flex-shrink-0">
        {type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}
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

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

const AdminPanel = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // User Management State
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [userDataError, setUserDataError] = useState(null);

  // Curriculum Management State
  const [curriculumData, setCurriculumData] = useState({});
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [curriculumFormData, setCurriculumFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
    ytLink: "",
    pyqs: "",
    notes: "",
  });

  const navigate = useNavigate();

  // Toast Management
  const addToast = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Authentication Check
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsCheckingAuth(true);

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            setError("Authentication required. Please log in.");
            navigate("/login");
            return;
          }

          try {
            const isAdmin = await adminService.isAdmin(user.uid);

            if (!isAdmin) {
              setError("Access denied. Admin privileges required.");
              navigate("/");
              return;
            }

            await loadAllData();
            setError(null);
          } catch (err) {
            console.error("Error checking admin status:", err);
            setError("Error verifying admin access: " + err.message);
            navigate("/");
          } finally {
            setIsCheckingAuth(false);
            setIsLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error in auth check:", err);
        setError("Authentication error occurred");
        setIsCheckingAuth(false);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Load All Data - FIXED VERSION
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setUserDataError(null);

      // Load data concurrently but handle errors separately
      const results = await Promise.allSettled([
        loadUserData(),
        loadCurriculumData(),
      ]);

      // Check for user data loading errors
      if (results[0].status === "rejected") {
        console.error("User data loading failed:", results[0].reason);
        setUserDataError(
          results[0].reason.message || "Failed to load user data"
        );
        addToast(
          "Failed to load user data: " + results[0].reason.message,
          "error"
        );
      }

      // Check for curriculum data loading errors
      if (results[1].status === "rejected") {
        console.error("Curriculum data loading failed:", results[1].reason);
        addToast(
          "Failed to load curriculum data: " + results[1].reason.message,
          "error"
        );
      }

      // If both failed, show a general error
      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected"
      ) {
        addToast(
          "Failed to load admin panel data. Please refresh the page.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error loading data:", err);
      addToast("Failed to load some data: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED User Management Functions
  const loadUserData = async () => {
    try {
      console.log("Starting to load user data...");

      // Load users and admins separately with better error handling
      const [usersResult, adminsResult] = await Promise.allSettled([
        userService.getUsers(),
        adminService.getAdmins(),
      ]);

      if (usersResult.status === "fulfilled") {
        console.log("Users loaded successfully:", usersResult.value);
        setUsers(usersResult.value || []);
      } else {
        console.error("Failed to load users:", usersResult.reason);
        setUsers([]);
        throw new Error(`Failed to load users: ${usersResult.reason.message}`);
      }

      if (adminsResult.status === "fulfilled") {
        console.log("Admins loaded successfully:", adminsResult.value);
        setAdmins(adminsResult.value || []);
      } else {
        console.error("Failed to load admins:", adminsResult.reason);
        setAdmins([]);
        // Don't throw here, admins failure shouldn't prevent user display
        addToast(
          "Failed to load admin list: " + adminsResult.reason.message,
          "warning"
        );
      }
    } catch (err) {
      console.error("Error in loadUserData:", err);
      throw new Error("Failed to load user data: " + err.message);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      addToast("Please enter an email address", "error");
      return;
    }

    try {
      setIsLoading(true);
      await adminService.addAdmin(newAdminEmail.trim());
      setNewAdminEmail("");
      setAdminDialogOpen(false);
      await loadUserData();
      addToast("Admin added successfully!", "success");
    } catch (err) {
      console.error("Error adding admin:", err);
      addToast("Failed to add admin: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (adminId) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      setIsLoading(true);
      await adminService.removeAdmin(adminId);
      await loadUserData();
      addToast("Admin removed successfully!", "success");
    } catch (err) {
      console.error("Error removing admin:", err);
      addToast("Failed to remove admin: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Curriculum Management Functions (unchanged)
  const loadCurriculumData = async () => {
    try {
      const data = await curriculumService.getAllSemesters();
      setCurriculumData(data);
    } catch (error) {
      console.error("Error loading curriculum:", error);
      throw new Error("Failed to load curriculum data");
    }
  };

  const resetCurriculumForm = () => {
    setCurriculumFormData({
      semester: "",
      subject: "",
      chapter: "",
      ytLink: "",
      pyqs: "",
      notes: "",
    });
    setEditingChapter(null);
    setShowCurriculumModal(false);
  };

  const handleCurriculumSubmit = async (e) => {
    e.preventDefault();

    if (
      !curriculumFormData.semester ||
      !curriculumFormData.subject ||
      !curriculumFormData.chapter
    ) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    // Validate URLs
    const urlFields = ["ytLink", "pyqs", "notes"];
    for (const field of urlFields) {
      if (
        curriculumFormData[field] &&
        !curriculumService.validateUrl(curriculumFormData[field])
      ) {
        addToast(`Invalid URL in ${field}`, "error");
        return;
      }
    }

    try {
      setIsLoading(true);
      const semesterKey = `semester${curriculumFormData.semester}`;
      const chapterData = {
        ytLink: curriculumFormData.ytLink,
        pyqs: curriculumFormData.pyqs,
        notes: curriculumFormData.notes,
      };

      if (editingChapter) {
        await curriculumService.updateChapter(
          semesterKey,
          curriculumFormData.subject,
          curriculumFormData.chapter,
          chapterData
        );
        addToast("Chapter updated successfully!", "success");
      } else {
        await curriculumService.addChapter(
          semesterKey,
          curriculumFormData.subject,
          curriculumFormData.chapter,
          chapterData
        );
        addToast("Chapter added successfully!", "success");
      }

      await loadCurriculumData();
      resetCurriculumForm();
    } catch (error) {
      addToast("Failed to save chapter: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChapter = (semester, subject, chapter, data) => {
    setCurriculumFormData({
      semester: semester.replace("semester", ""),
      subject,
      chapter,
      ytLink: data.ytLink || "",
      pyqs: data.pyqs || "",
      notes: data.notes || "",
    });
    setEditingChapter({ semester, subject, chapter });
    setShowCurriculumModal(true);
  };

  const handleDeleteChapter = async (semester, subject, chapter) => {
    if (
      !confirm(`Are you sure you want to delete "${chapter}" from ${subject}?`)
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await curriculumService.deleteChapter(semester, subject, chapter);
      addToast("Chapter deleted successfully!", "success");
      await loadCurriculumData();
    } catch (error) {
      addToast("Failed to delete chapter: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSubjects = (semester) => {
    if (!semester) return [];
    const semesterKey = `semester${semester}`;
    const semesterData = curriculumData[semesterKey];
    return semesterData?.subjects ? Object.keys(semesterData.subjects) : [];
  };

  const exportCurriculumData = async () => {
    try {
      const dataStr = JSON.stringify(curriculumData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `curriculum-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      addToast("Data exported successfully! 📁", "success");
    } catch (err) {
      addToast("Export failed: " + err.message, "error");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show error if access denied
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500 text-center">
              <h2 className="text-xl font-bold mb-2">Access Error</h2>
              <p>{error}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Return Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4ED] pt-28 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#403C5C]">Admin Panel 🛠️</h1>
          <div className="flex gap-4">
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === "users"
                ? "text-[#403C5C] border-b-2 border-[#403C5C]"
                : "text-gray-500 hover:text-[#403C5C]"
            }`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === "curriculum"
                ? "text-[#403C5C] border-b-2 border-[#403C5C]"
                : "text-gray-500 hover:text-[#403C5C]"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Curriculum Management
          </button>
        </div>

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Show user data error if exists */}
            {userDataError && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>User Data Error: {userDataError}</span>
                    <button
                      onClick={loadUserData}
                      className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Retry
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Admin Access Management
                </CardTitle>
                <Dialog
                  open={adminDialogOpen}
                  onOpenChange={setAdminDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Admin</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <input
                        type="email"
                        placeholder="Admin Email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        onClick={addAdmin}
                        className="mt-4 w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Admin Access"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length > 0 ? (
                        admins.map((admin) => (
                          <tr
                            key={admin.id}
                            className="border-b border-gray-100"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-500" />
                                {admin.email}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAdmin(admin.id)}
                                className="flex items-center gap-2"
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No admins found or failed to load admin data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* User List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  User Management
                </CardTitle>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Users: {users.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-2">
                              <UserCircle className="h-4 w-4" />
                              Name
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                      {user.name?.charAt(0).toUpperCase() ||
                                        "?"}
                                    </span>
                                  </div>
                                  <span className="font-medium">
                                    {user.name || "No Name"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {user.email || "No Email"}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    admins.some((admin) => admin.id === user.id)
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {admins.some((admin) => admin.id === user.id)
                                    ? "Admin"
                                    : "User"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              {userDataError
                                ? "Failed to load users - check your Firestore configuration"
                                : "No users found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Curriculum Management Tab - Keep existing code */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            {/* Curriculum Header */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Curriculum Management 📚
                </CardTitle>
                <div className="flex gap-4">
                  <button
                    onClick={exportCurriculumData}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <button
                    onClick={() => setShowCurriculumModal(true)}
                    disabled={isLoading}
                    className="bg-[#403C5C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5C6BC0] disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Chapter
                  </button>
                </div>
              </CardHeader>
            </Card>

            {/* Curriculum Content */}
            <div className="grid gap-6">
              {Object.entries(curriculumData).map(
                ([semesterKey, semesterData]) => (
                  <Card key={semesterKey}>
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-[#403C5C]">
                        {semesterKey.replace("semester", "Semester ")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(semesterData.subjects || {}).map(
                        ([subject, subjectData]) => (
                          <div
                            key={subject}
                            className="mb-6 border-l-4 border-[#D6CFE9] pl-4"
                          >
                            <h3 className="text-xl font-semibold text-[#403C5C] mb-3">
                              {subject}
                            </h3>
                            <div className="grid gap-3">
                              {Object.entries(subjectData.chapters || {}).map(
                                ([chapter, chapterData]) => (
                                  <div
                                    key={chapter}
                                    className="bg-gray-50 rounded-lg p-4 border"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-[#403C5C] mb-2">
                                          {chapter}
                                        </h4>
                                        <div className="flex gap-2">
                                          {chapterData.ytLink && (
                                            <a
                                              href={chapterData.ytLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-red-500 hover:text-red-700"
                                              title="YouTube Video"
                                            >
                                              <Video className="w-4 h-4" />
                                            </a>
                                          )}
                                          {chapterData.notes && (
                                            <a
                                              href={chapterData.notes}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:text-blue-700"
                                              title="Notes"
                                            >
                                              <FileText className="w-4 h-4" />
                                            </a>
                                          )}
                                          {chapterData.pyqs && (
                                            <a
                                              href={chapterData.pyqs}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-green-500 hover:text-green-700"
                                              title="Previous Year Questions"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            handleEditChapter(
                                              semesterKey,
                                              subject,
                                              chapter,
                                              chapterData
                                            )
                                          }
                                          className="text-blue-500 hover:text-blue-700"
                                          title="Edit"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteChapter(
                                              semesterKey,
                                              subject,
                                              chapter
                                            )
                                          }
                                          className="text-red-500 hover:text-red-700"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        )}

        {/* Curriculum Modal */}
        <AnimatePresence>
          {showCurriculumModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#403C5C]">
                    {editingChapter ? "Edit Chapter" : "Add New Chapter"}
                  </h2>
                  <button
                    onClick={resetCurriculumForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCurriculumSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester *
                    </label>
                    <select
                      value={curriculumFormData.semester}
                      onChange={(e) =>
                        setCurriculumFormData({
                          ...curriculumFormData,
                          semester: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                      disabled={editingChapter}
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    {editingChapter ? (
                      <input
                        type="text"
                        value={curriculumFormData.subject}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        disabled
                      />
                    ) : (
                      <select
                        value={curriculumFormData.subject}
                        onChange={(e) =>
                          setCurriculumFormData({
                            ...curriculumFormData,
                            subject: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Subject</option>
                        {getAvailableSubjects(curriculumFormData.semester).map(
                          (subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chapter *
                    </label>
                    <input
                      type="text"
                      value={curriculumFormData.chapter}
                      onChange={(e) =>
                        setCurriculumFormData({
                          ...curriculumFormData,
                          chapter: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Oscillations"
                      required
                      disabled={editingChapter}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      value={curriculumFormData.ytLink}
                      onChange={(e) =>
                        setCurriculumFormData({
                          ...curriculumFormData,
                          ytLink: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes Link
                    </label>
                    <input
                      type="url"
                      value={curriculumFormData.notes}
                      onChange={(e) =>
                        setCurriculumFormData({
                          ...curriculumFormData,
                          notes: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PYQs Link
                    </label>
                    <input
                      type="url"
                      value={curriculumFormData.pyqs}
                      onChange={(e) =>
                        setCurriculumFormData({
                          ...curriculumFormData,
                          pyqs: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                        isLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-[#403C5C] text-white hover:bg-[#5C6BC0]"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingChapter ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetCurriculumForm}
                      disabled={isLoading}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Container */}
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
