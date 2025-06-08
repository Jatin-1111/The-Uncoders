import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { curriculumService } from "../services/curriculumService";

const ITContent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popup2Message, setPopup2Message] = useState("");
  const [loading, setLoading] = useState(false);
  const [curriculumData, setCurriculumData] = useState({});
  const [formData, setFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
  });

  const navigate = useNavigate();

  const handleNavigateTogateContent = () => {
    navigate("/Content/GateContent");
  };

  // Load curriculum data on component mount
  useEffect(() => {
    loadCurriculumData();
  }, []);

  const loadCurriculumData = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getAllSemesters();
      setCurriculumData(data);
    } catch (error) {
      console.error("Error loading curriculum:", error);
      setPopupMessage("Failed to load curriculum data. Please try again.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Reset dependent fields
      if (field === "semester") {
        newData.subject = "";
        newData.chapter = "";
      } else if (field === "subject") {
        newData.chapter = "";
      }

      return newData;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowDialog(false);
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleKeyDown);
    };
  }, []);

  const handleSubmit = async () => {
    const { semester, subject, chapter } = formData;

    if (!semester || !subject || !chapter) {
      setPopup2Message("Please select Semester, Subject and Chapter!");
      setShowPopup2(true);
      setShowDialog(false);
      return;
    }

    try {
      const semesterKey = `semester${semester}`;
      const chapterData = await curriculumService.getChapters(
        semesterKey,
        subject
      );
      const selectedChapter = chapterData[chapter];

      if (
        !selectedChapter ||
        (!selectedChapter.ytLink &&
          !selectedChapter.notes &&
          !selectedChapter.pyqs)
      ) {
        setShowPopup(true);
        setShowDialog(false);
        setPopupMessage(
          "We're working hard to bring you content for this selection. Stay tuned for updates!"
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
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      setPopupMessage("Error loading content. Please try again.");
      setShowPopup(true);
      setShowDialog(false);
    }
  };

  const getAvailableSubjects = (semester) => {
    if (!semester) return [];
    const semesterKey = `semester${semester}`;
    const semesterData = curriculumData[semesterKey];
    return semesterData?.subjects ? Object.keys(semesterData.subjects) : [];
  };

  const getAvailableChapters = (semester, subject) => {
    if (!semester || !subject) return [];
    const semesterKey = `semester${semester}`;
    const semesterData = curriculumData[semesterKey];
    return semesterData?.subjects?.[subject]?.chapters
      ? Object.keys(semesterData.subjects[subject].chapters)
      : [];
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5 } },
  };

  const renderSelectionDialog = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] md:w-[30vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#403C5C]">
            Select Your Semester, Subject, and Chapter
          </h2>
          <button
            onClick={() => {
              setShowDialog(false);
              handleKeyDown();
            }}
            className="text-2xl font-bold text-[#403C5C]"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#403C5C]"></div>
            <span className="ml-3 text-[#403C5C]">Loading curriculum...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Semester Selection */}
            <div>
              <label className="block text-[#403C5C] mb-2">
                Select Semester:
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleInputChange("semester", e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value="">Choose a semester</option>
                {Object.keys(curriculumData).map((semesterKey) => {
                  const semesterNum = semesterKey.replace("semester", "");
                  return (
                    <option key={semesterKey} value={semesterNum}>
                      Semester {semesterNum}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-[#403C5C] mb-2">
                Select Subject:
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!formData.semester || loading}
              >
                <option value="">Choose a subject</option>
                {getAvailableSubjects(formData.semester).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="block text-[#403C5C] mb-2">
                Select Chapter:
              </label>
              <select
                value={formData.chapter}
                onChange={(e) => handleInputChange("chapter", e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!formData.subject || loading}
              >
                <option value="">Choose a chapter</option>
                {getAvailableChapters(formData.semester, formData.subject).map(
                  (chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-[#D4C1EC] rounded-md font-bold hover:bg-[#B3C7E6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-[#FAF4ED] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-center items-center flex-col p-8 text-[#403C5C] space-y-5 mt-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          IT Content
        </h2>
        <button
          onClick={() => setShowDialog(true)}
          disabled={loading}
          className="px-8 py-4 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Loading Curriculum..."
            : "Select Semester, Subject, and Chapter"}
        </button>
      </div>

      {/* Error Popups */}
      <AnimatePresence>
        {showPopup2 && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup2(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-8 w-[90vw] md:w-[30vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-lg font-semibold text-[#2C3E50]">
                {popup2Message}
              </p>
              <button
                onClick={() => setShowPopup2(false)}
                className="mt-4 px-4 py-2 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-[#403C5C] mb-4">
                {popupMessage}
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
        {showDialog && renderSelectionDialog()}
      </AnimatePresence>

      {/* Content Display Section */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            className="w-[85vw] md:max-w-6xl mx-auto px-4 md:px-6 py-6 mt-6 bg-white border border-[#CBAACB] rounded-md shadow-md"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#403C5C]">
                Semester {selectedContent.semester} - {selectedContent.subject}{" "}
                - {selectedContent.chapter}
              </h3>
              <p className="text-[#403C5C]">
                Here is the content for{" "}
                <strong>{selectedContent.chapter}</strong> from{" "}
                <strong>{selectedContent.subject}</strong> in Semester{" "}
                {selectedContent.semester}. You can access detailed notes, video
                lectures, and previous year question papers (PYQs) for better
                understanding.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  title: "YouTube Videos",
                  desc: "Watch curated video lectures to gain a deeper understanding and strengthen your grasp of the subject for better exam preparation.",
                  link: selectedContent?.ytLink || "#",
                },
                {
                  title: "PYQs",
                  desc: "To access previous year question papers for exam preparation, visit the UIET website and use the subject code to find the relevant papers.",
                  link: selectedContent?.pyqs || "#",
                },
                {
                  title: "Notes",
                  desc: "Get detailed notes that provide comprehensive explanations and key insights to enhance your understanding and overall learning experience.",
                  link: selectedContent?.notes || "#",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[30%]"
                >
                  <h4 className="text-xl font-bold text-[#403C5C] mb-4">
                    {card.title}
                  </h4>
                  <p className="text-[#403C5C] font-medium mb-4">{card.desc}</p>
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block px-6 py-2 ${
                      card.link !== "#"
                        ? "bg-[#D4C1EC] text-[#403C5C] hover:bg-[#B3C7E6] hover:text-[#FAF4ED]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } rounded font-bold transition-all`}
                  >
                    {card.link !== "#" ? "Click Here" : "Unavailable"}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Section */}
      <motion.div
        className="max-w-6xl mx-auto p-6 mt-12 rounded-md"
        initial={{ opacity: 1 }}
        animate={{ translateY: selectedContent ? "20px" : "0px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">
              GATE Preparation
            </h4>
            <img
              src="/images/img4.jpg"
              alt="Gate IMG"
              className="rounded-md md:h-[25vh] w-full shadow-md border border-[#CBAACB]"
            />
            <p className="text-[#403C5C] mb-4 py-4">
              Ace your GATE exams with curated IT resources, including video
              lectures, expertly crafted notes, and solved PYQs.
            </p>
            <button
              onClick={handleNavigateTogateContent}
              className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] mt-6 transition-all"
            >
              Start Your GATE Journey
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">
              Engage with Seniors
            </h4>
            <img
              src="/images/img5.jpeg"
              alt="EWS IMG"
              className="rounded-md md:h-[25vh] w-full shadow-md border border-[#CBAACB]"
            />
            <p className="text-[#403C5C] mb-4 py-4">
              Learn from experienced seniors through active engagement,
              mentoring opportunities, and insights that bridge the gap between
              academics and practical knowledge.
            </p>
            <button className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all">
              Engage with Seniors Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ITContent;
