// Fixed ITContent.js - Page re-render issue completely resolved

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { curriculumService } from "../services/curriculumService";
import {
  BookOpen,
  ExternalLink,
  Search,
  ArrowLeft,
  Play,
  ArrowRight,
  Users,
  GraduationCap,
  Filter,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  BookMarked,
  Target,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import PropTypes from "prop-types";

// FIXED: Memoized Toast Component to prevent unnecessary re-renders
const Toast = memo(({ message, type, onClose }) => {
  const variants = useMemo(
    () => ({
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    }),
    []
  );

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
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <XCircle className="w-5 h-5" />
        ) : (
          "⚠️"
        )}
      </div>
      <div className="ml-3 flex-grow font-medium text-sm">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 text-current opacity-70 hover:opacity-100"
        aria-label="Close notification"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
});

Toast.displayName = "Toast";
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

// FIXED: Memoized ToastContainer
const ToastContainer = memo(({ children }) => (
  <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>{children}</AnimatePresence>
  </div>
));

ToastContainer.displayName = "ToastContainer";
ToastContainer.propTypes = {
  children: PropTypes.node,
};

// FIXED: Memoized SelectionDialog with React.memo to prevent re-renders
const SelectionDialog = memo(
  ({
    showDialog,
    setShowDialog,
    loading,
    curriculumData,
    searchQuery,
    setSearchQuery,
    formData,
    handleInputChange,
    handleSubmit,
    getAvailableSubjects,
    getAvailableChapters,
  }) => {
    const dialogRef = useRef(null);

    // Memoize modal variants
    const modalVariants = useMemo(
      () => ({
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.2 },
        },
      }),
      []
    );

    // Stable event handlers
    const handleEscape = useCallback(
      (e) => {
        if (e.key === "Escape") {
          setShowDialog(false);
        }
      },
      [setShowDialog]
    );

    const handleBackdropClick = useCallback(
      (e) => {
        if (e.target === dialogRef.current) {
          setShowDialog(false);
        }
      },
      [setShowDialog]
    );

    const preventClose = useCallback((e) => {
      e.stopPropagation();
    }, []);

    const closeDialog = useCallback(() => {
      setShowDialog(false);
    }, [setShowDialog]);

    // Event listener management
    useEffect(() => {
      if (showDialog) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [showDialog, handleEscape]);

    // FIXED: Memoize dropdown options to prevent recalculation
    const semesterOptions = useMemo(() => {
      return Object.keys(curriculumData).map((semesterKey) => {
        const semesterNum = semesterKey.replace("semester", "");
        return (
          <option key={semesterKey} value={semesterNum}>
            Semester {semesterNum}
          </option>
        );
      });
    }, [curriculumData]);

    const availableSubjects = useMemo(() => {
      return getAvailableSubjects(formData.semester);
    }, [formData.semester, getAvailableSubjects]);

    const availableChapters = useMemo(() => {
      return getAvailableChapters(formData.semester, formData.subject);
    }, [formData.semester, formData.subject, getAvailableChapters]);

    const filteredSubjects = useMemo(() => {
      if (!searchQuery) return availableSubjects;
      return availableSubjects.filter((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [availableSubjects, searchQuery]);

    const filteredChapters = useMemo(() => {
      if (!searchQuery) return availableChapters;
      return availableChapters.filter((chapter) =>
        chapter.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [availableChapters, searchQuery]);

    const subjectOptions = useMemo(() => {
      return filteredSubjects.map((subject) => (
        <option key={subject} value={subject}>
          {subject}
        </option>
      ));
    }, [filteredSubjects]);

    const chapterOptions = useMemo(() => {
      return filteredChapters.map((chapter) => (
        <option key={chapter} value={chapter}>
          {chapter}
        </option>
      ));
    }, [filteredChapters]);

    if (!showDialog) return null;

    return (
      <motion.div
        ref={dialogRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        style={{ zIndex: 9999 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={preventClose}
        >
          {/* Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#403C5C] to-[#9A86CF] rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#403C5C]">
                    Find Resources
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select your academic requirements
                  </p>
                </div>
              </div>
              <button
                onClick={closeDialog}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                disabled={loading}
                type="button"
                aria-label="Close dialog"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center py-12">
                <LoadingSpinner size="large" />
                <p className="mt-4 text-[#403C5C] font-medium">
                  Loading curriculum data...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we fetch the latest content
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search subjects or chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C1EC] focus:border-transparent transition-all"
                  />
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  {/* Semester Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#403C5C] mb-2">
                      Semester <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        handleInputChange("semester", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C1EC] focus:border-transparent transition-all appearance-none bg-white"
                      disabled={loading}
                    >
                      <option value="">Select semester</option>
                      {semesterOptions}
                    </select>
                  </div>

                  {/* Subject Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#403C5C] mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C1EC] focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-50"
                      disabled={!formData.semester || loading}
                    >
                      <option value="">Select subject</option>
                      {subjectOptions}
                    </select>
                  </div>

                  {/* Chapter Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#403C5C] mb-2">
                      Chapter <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.chapter}
                      onChange={(e) =>
                        handleInputChange("chapter", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4C1EC] focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-50"
                      disabled={!formData.subject || loading}
                    >
                      <option value="">Select chapter</option>
                      {chapterOptions}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      !formData.semester ||
                      !formData.subject ||
                      !formData.chapter
                    }
                    className="flex-1 bg-gradient-to-r from-[#403C5C] to-[#9A86CF] text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    <Search className="w-4 h-4 mr-2 inline" />
                    Find Resources
                  </motion.button>
                  <button
                    onClick={closeDialog}
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }
);

SelectionDialog.displayName = "SelectionDialog";
SelectionDialog.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  setShowDialog: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  curriculumData: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  getAvailableSubjects: PropTypes.func.isRequired,
  getAvailableChapters: PropTypes.func.isRequired,
};

// FIXED: Memoized ContentDisplay component
const ContentDisplay = memo(({ selectedContent, setSelectedContent }) => {
  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    }),
    []
  );

  // Memoize resources array
  const resources = useMemo(
    () => [
      {
        title: "Video Lectures",
        description:
          "Interactive video content with expert explanations and demonstrations",
        icon: Play,
        link: selectedContent?.ytLink,
        color: "from-red-500 via-red-600 to-pink-600",
        available: !!selectedContent?.ytLink,
        badge: "HD Quality",
        stats: "45+ hours",
      },
      {
        title: "Study Notes",
        description:
          "Comprehensive study materials with detailed explanations and examples",
        icon: BookMarked,
        link: selectedContent?.notes,
        color: "from-blue-500 via-blue-600 to-indigo-600",
        available: !!selectedContent?.notes,
        badge: "PDF Format",
        stats: "200+ pages",
      },
      {
        title: "Practice Papers",
        description:
          "Previous year questions and practice sets for thorough preparation",
        icon: Target,
        link: selectedContent?.pyqs,
        color: "from-emerald-500 via-green-600 to-teal-600",
        available: !!selectedContent?.pyqs,
        badge: "Updated",
        stats: "50+ questions",
      },
    ],
    [selectedContent]
  );

  const handleBack = useCallback(() => {
    setSelectedContent(null);
  }, [setSelectedContent]);

  if (!selectedContent) return null;

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="inline-flex items-center text-[#403C5C] hover:text-[#9A86CF] mb-8 transition-colors group"
        variants={itemVariants}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to selection</span>
      </motion.button>

      {/* Header Section */}
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#403C5C] via-[#5C6BC0] to-[#9A86CF] text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">
                Academic Resource
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {selectedContent.subject}
            </h1>
            <h2 className="text-xl md:text-2xl opacity-90 mb-2">
              {selectedContent.chapter}
            </h2>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <GraduationCap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Semester {selectedContent.semester}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resources Grid */}
      <motion.div
        className="grid lg:grid-cols-3 gap-8 mb-12"
        variants={containerVariants}
      >
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group flex flex-col"
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div
              className={`h-40 bg-gradient-to-br ${resource.color} relative overflow-hidden flex items-center justify-center`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-white">
                  {resource.badge}
                </span>
              </div>
              <div className="relative z-10 text-center text-white">
                <resource.icon className="w-16 h-16 mx-auto mb-2" />
                <p className="text-sm font-medium opacity-90">
                  {resource.stats}
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-[#403C5C]">
                  {resource.title}
                </h3>
                {resource.available && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">Premium</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {resource.description}
              </p>

              {resource.available ? (
                <motion.a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#403C5C] to-[#9A86CF] text-white py-3 px-6 rounded-xl font-semibold text-center hover:shadow-lg transition-all group flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Access Resource
                </motion.a>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-3 px-6 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Coming Soon
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
});

ContentDisplay.displayName = "ContentDisplay";
ContentDisplay.propTypes = {
  selectedContent: PropTypes.object,
  setSelectedContent: PropTypes.func.isRequired,
};

// FIXED: Memoized QuickAccessCards component
const QuickAccessCards = memo(() => {
  const navigate = useNavigate();

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    }),
    []
  );

  const handleGateNavigation = useCallback(() => {
    navigate("/content/gate");
  }, [navigate]);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h2 className="text-3xl md:text-4xl font-bold text-[#403C5C] mb-4">
          Explore Our Content Library
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover comprehensive study materials designed to accelerate your
          academic journey
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group cursor-pointer flex flex-col"
          onClick={handleGateNavigation}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#403C5C] group-hover:text-[#9A86CF] transition-colors">
                  GATE Preparation
                </h3>
                <p className="text-gray-600">Comprehensive exam preparation</p>
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-grow">
            <img
              src="/images/img4.jpg"
              alt="GATE Preparation"
              className="w-full h-48 object-cover rounded-xl mb-6 group-hover:scale-105 transition-transform"
            />
            <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
              Master GATE examinations with our expertly curated study
              materials, comprehensive notes, and strategic preparation guides
              designed for success.
            </p>

            <div className="flex items-center text-[#403C5C] group-hover:text-[#9A86CF] transition-colors mt-auto">
              <span className="font-semibold">Start GATE Journey</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 group flex flex-col"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#403C5C]">
                  Senior Mentorship
                </h3>
                <p className="text-gray-600">
                  Connect with experienced guidance
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-grow">
            <img
              src="/images/img5.jpeg"
              alt="Senior Mentorship"
              className="w-full h-48 object-cover rounded-xl mb-6"
            />
            <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
              Connect with experienced seniors and industry professionals for
              personalized guidance, career advice, and practical insights into
              your academic journey.
            </p>

            <div className="flex items-center text-gray-400 mt-auto">
              <span className="font-medium">Coming Soon</span>
              <Clock className="w-4 h-4 ml-2" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

QuickAccessCards.displayName = "QuickAccessCards";

// FIXED: Main ITContent component with optimized re-rendering
const ITContent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [curriculumData, setCurriculumData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const [formData, setFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);

      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // FIXED: Memoized toast management functions
  const addToast = useCallback((message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Load curriculum data
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadCurriculumData();
    }
  }, [isAuthenticated, authLoading]);

  const loadCurriculumData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getAllSemesters();

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No curriculum data found");
      }

      setCurriculumData(data);
    } catch (error) {
      console.error("Error loading curriculum:", error);
      addToast(
        "Failed to load curriculum data. Please refresh and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // FIXED: Stable input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset dependent fields
      if (field === "semester") {
        newData.subject = "";
        newData.chapter = "";
      } else if (field === "subject") {
        newData.chapter = "";
      }

      return newData;
    });
  }, []);

  // FIXED: Stable submit handler
  const handleSubmit = useCallback(async () => {
    const { semester, subject, chapter } = formData;

    if (!semester || !subject || !chapter) {
      addToast(
        "Please select semester, subject, and chapter to continue.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const semesterKey = `semester${semester}`;
      const semesterData = curriculumData[semesterKey];

      if (!semesterData || !semesterData.subjects) {
        throw new Error("Semester data not found");
      }

      const subjectData = semesterData.subjects[subject];
      if (!subjectData || !subjectData.chapters) {
        throw new Error("Subject data not found");
      }

      const selectedChapter = subjectData.chapters[chapter];
      if (!selectedChapter) {
        throw new Error("Chapter data not found");
      }

      const hasContent =
        selectedChapter.ytLink || selectedChapter.notes || selectedChapter.pyqs;

      if (!hasContent) {
        addToast(
          "Content for this topic is coming soon. Check back for updates!",
          "warning"
        );
        return;
      }

      setSelectedContent({
        semester,
        subject,
        chapter,
        ...selectedChapter,
      });
      setShowDialog(false);
      addToast(`Successfully loaded resources for ${chapter}`, "success");
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      addToast(`Unable to load content: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [formData, curriculumData, addToast]);

  // FIXED: Memoized helper functions
  const getAvailableSubjects = useCallback(
    (semester) => {
      if (!semester || !curriculumData) return [];

      const semesterKey = `semester${semester}`;
      const semesterData = curriculumData[semesterKey];

      if (!semesterData || !semesterData.subjects) {
        return [];
      }

      return Object.keys(semesterData.subjects);
    },
    [curriculumData]
  );

  const getAvailableChapters = useCallback(
    (semester, subject) => {
      if (!semester || !subject || !curriculumData) return [];

      const semesterKey = `semester${semester}`;
      const semesterData = curriculumData[semesterKey];

      if (
        !semesterData ||
        !semesterData.subjects ||
        !semesterData.subjects[subject]
      ) {
        return [];
      }

      const subjectData = semesterData.subjects[subject];
      return subjectData.chapters ? Object.keys(subjectData.chapters) : [];
    },
    [curriculumData]
  );

  // FIXED: Memoized dialog show function
  const handleShowDialog = useCallback(() => {
    setShowDialog(true);
  }, []);

  // FIXED: Memoized search query handler
  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // FIXED: Memoized hero section to prevent re-renders
  const HeroSection = useMemo(
    () => (
      <div className="relative bg-gradient-to-br from-[#403C5C] via-[#5C6BC0] to-[#9A86CF] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full -translate-x-40 translate-y-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <BookOpen className="w-8 h-8" />
              <span className="text-lg font-medium opacity-90">
                IT Content Library
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Master Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                IT Studies
              </span>
            </h1>

            <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-4xl mx-auto leading-relaxed">
              Access premium study resources tailored for IT students at UIET
              Chandigarh. From comprehensive notes to expert video lectures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={handleShowDialog}
                disabled={loading}
                className="bg-white text-[#403C5C] hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-2xl transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 mr-2 inline" />
                {loading ? "Loading..." : "Find Study Materials"}
              </motion.button>

              <div className="flex items-center gap-4 text-sm opacity-75">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free Access</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Updated Content</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Expert Curated</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    ),
    [loading, handleShowDialog]
  );

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF4ED] via-[#F8F6F3] to-[#F0F0F5] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-[#403C5C] font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF4ED] via-[#F8F6F3] to-[#F0F0F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#403C5C] mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access IT content.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#403C5C] text-white px-6 py-3 rounded-lg hover:bg-[#5C6BC0] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF4ED] via-[#F8F6F3] to-[#F0F0F5] py-10">
      {/* Hero Section - Memoized */}
      {HeroSection}

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {selectedContent ? (
            <ContentDisplay
              key="content"
              selectedContent={selectedContent}
              setSelectedContent={setSelectedContent}
            />
          ) : (
            <QuickAccessCards key="cards" />
          )}
        </AnimatePresence>
      </div>

      {/* Modal - Rendered separately to prevent re-renders */}
      <AnimatePresence>
        <SelectionDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          loading={loading}
          curriculumData={curriculumData}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          getAvailableSubjects={getAvailableSubjects}
          getAvailableChapters={getAvailableChapters}
        />
      </AnimatePresence>

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
  );
};

export default ITContent;
