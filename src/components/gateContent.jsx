import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GATEContent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
  });

  const navigate = useNavigate();
  const handleNavigateToITContent = () => {
    navigate("/Content/ITContent");
  }

  const gateSyllabus = {
    "Engineering Mathematics": {
      "Probability and Statistics": {
        ytLink:
          "https://www.youtube.com/playlist?list=PLvTTv60o7qj-q4idV59uKIkBPOxe-govX",
        notes: "",
      },
      "Linear Algebra": {
        ytLink:
          "https://www.youtube.com/playlist?list=PL6Hn_dJKTVOmrb3OWIe5kaB0d5C2nwckH",
        notes: "",
      },
      "Discrete Mathematics": {
        ytLink:
          "https://www.youtube.com/playlist?list=PL3eEXnCBViH_Vy3CLfkxM_wsGrKoX8dVc",
        notes: "",
      },
    },
    "Digital Logic": {
      "Digital Logic - 1": {
        ytLink:
          "https://youtube.com/playlist?list=PLC36xJgs4dxEErKQZ7xFxat8oh4OepU34&si=GfDV5UK12CmHqK6H",
        notes: "",
      },
      "Digital Logic - 2": {
        ytLink:
          "https://youtube.com/playlist?list=PL3eEXnCBViH8nznEyq1bdI0M_IfBScJ2H&si=POIqhIl7Fq7qR3zS",
        notes: "",
      },
      "Digital Logic - 3": {
        ytLink:
          "https://youtube.com/playlist?list=PLir19lgiavA0EKRRN3xdARy_z44hKhNQc&si=6-FDO0S4KisuNxR8",
        notes: "",
      },
    },
    "Computer Organization and Architecture": {
      "Computer Organization and Architecture - 1": {
        ytLink:
          "https://youtube.com/playlist?list=PLG9aCp4uE-s3WzvFW1nI-7hHWNC8s2RdI&si=w5bVh0HOYQ9wryjt",
        notes: "https://drive.google.com/open?id=1vYG9zaDX65l_g6nBsCXVfqa5lRauZehX&usp=drive_copy",
      },
      "Computer Organization and Architecture - 2": {
        ytLink:
          "https://youtube.com/playlist?list=PL3eEXnCBViH85a_kkiNN_rj97jPSIWtST&si=eMcVEwHV7YS475t2",
        notes: "https://drive.google.com/open?id=1vYG9zaDX65l_g6nBsCXVfqa5lRauZehX&usp=drive_copy",
      },
      "Computer Organization and Architecture - 3": {
        ytLink:
          "https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX&si=VfA3UxL0HPlvbLat",
        notes: "https://drive.google.com/open?id=1vYG9zaDX65l_g6nBsCXVfqa5lRauZehX&usp=drive_copy",
      },
    },
    "Programming and Data Structures": {
      "Programming and Data Structures - 1": {
        ytLink:
          "https://youtube.com/playlist?list=PLC36xJgs4dxFCQVvjMrrjcY3XrcMm2GHy&si=IT4M26hRdzwBNo8E",
        notes: "https://drive.google.com/open?id=1vmno5oAPmhPIgf50G7HttU6VWKQ8Zwpg&usp=drive_copy",
      },
      "Programming and Data Structures - 2": {
        ytLink:
          "https://youtube.com/playlist?list=PLG9aCp4uE-s334Pe8qACh32TdxsMKqDRU&si=LSvn50EueknyDBtx",
        notes: "https://drive.google.com/open?id=1vmno5oAPmhPIgf50G7HttU6VWKQ8Zwpg&usp=drive_copy",
      },
      "Programming and Data Structures - 3": {
        ytLink:
          "https://youtube.com/playlist?list=PLEBuowGoCtr0gkMchArBeydbLMUvZs6XQ&si=QZ75KktwtWBSVGci",
        notes: "https://drive.google.com/open?id=1vmno5oAPmhPIgf50G7HttU6VWKQ8Zwpg&usp=drive_copy",
      },
    },
    Algorithms: {
      "Sorting Algorithms": {
        ytLink:
          "",
        notes: "",
      },
      "Graph Algorithms": {
        ytLink:
          "",
        notes: "",
      },
    },
    "Theory of Computation": {
      "Automata Theory": {
        ytLink:
          "",
        notes: "",
      },
      "Formal Languages": {
        ytLink:
          "",
        notes: "",
      },
    },
    "Compiler Design": {
      "Lexical Analysis": {
        ytLink:
          "",
        notes: "",
      },
      "Syntax Analysis": {
        ytLink: "",
        notes: "",
      },
    },
    "Operating System": {
      "Process Management": {
        ytLink:
          "https://youtube.com/playlist?list=PLQX8XtP5l4yfH6IowBqhw3VJcHiDK-WiP",
        notes: "",
      },
      "Memory Management": {
        ytLink:
          "https://youtube.com/playlist?list=PLtVtDkk2pgb9r5g6q5b7AlP4dAn5sbWAy",
        notes: "",
      },
    },
    Databases: {
      "Database Management Systems": {
        ytLink:
          "https://www.youtube.com/playlist?list=PLwz5rJ2EKKc93kJ2x4W10KmZTzC59vQw2",
        notes: "",
      },
      "SQL Queries": {
        ytLink:
          "https://www.youtube.com/playlist?list=PL9vH01_fiM-GVxUg5GJc6-GLjR2MZAvX7",
        notes: "",
      },
    },
    "Computer Networks": {
      Introduction: {
        ytLink:
          "https://youtube.com/playlist?list=PLj6hR6YvBFzT3I68aIr7NfCdjzk-8rFwR",
        notes: "",
      },
      "Routing Algorithms": {
        ytLink:
          "https://youtube.com/playlist?list=PLfWnN-Je5rW0P6qgXZ5gK00lYvW7L2wOd",
        notes: "",
      },
    },
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset chapter if subject changes
      ...(field === "subject" ? { chapter: "" } : {}),
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowDialog(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = () => {
    setFormData("true");
    const { subject, chapter } = formData;

    if (!subject || !chapter) {
      setShowPopup(true);
      setShowDialog(false);
      setPopupMessage("Please select both Subject and Chapter!");
      return;
    }

    const chapterData = gateSyllabus[subject]?.[chapter];

    if (!chapterData) {
      setShowPopup(true);
      setPopupMessage(
        "We're working hard to bring you content for this selection. Stay tuned for updates!"
      );
      return;
    }

    setSelectedContent({
      subject,
      chapter,
      ...chapterData,
    });
    setShowDialog(false);
  };

  const getAvailableSubjects = () => Object.keys(gateSyllabus);

  const getAvailableChapters = (subject) =>
    subject ? Object.keys(gateSyllabus[subject] || {}) : [];

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
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-[90vw] md:w-[30vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4]">
          <h2 className="text-xl md:text-2xl font-bold text-[#2C3E50]">
            Select Your GATE Subject and Chapter
          </h2>
          <button
            onClick={() => setShowDialog(false)}
            className="text-2xl font-bold text-[#2C3E50] hover:text-gray-700"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-[#2C3E50] mb-2">
              Select Subject:
            </label>
            <select
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a subject</option>
              {getAvailableSubjects().map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="chapter" className="block text-[#2C3E50] mb-2">
              Select Chapter:
            </label>
            <select
              id="chapter"
              value={formData.chapter}
              onChange={(e) => handleInputChange("chapter", e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!formData.subject}
            >
              <option value="">Choose a chapter</option>
              {getAvailableChapters(formData.subject).map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#2C3E50] text-white py-2 rounded-md hover:bg-[#34495E] transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
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
          Gate Content
        </h2>
        <button
          onClick={() => setShowDialog(true)}
          className="px-8 py-4 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
        >
          Select Subject, and Chapter
        </button>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-8 w-[90vw] md:w-[30vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-lg font-semibold text-[#2C3E50]">
                {popupMessage}
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 px-4 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495E] transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showDialog && renderSelectionDialog()}</AnimatePresence>

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
            {/* Content section remains the same */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#403C5C]">
                Semester {selectedContent.semester} - {selectedContent.subject}{" "}
                - {selectedContent.chapter}
              </h3>
              <p className="text-[#403C5C]">
                Here is the content for{" "}
                <strong>{selectedContent.chapter}</strong> from{" "}
                <strong>{selectedContent.subject}</strong> in Semester{" "}
                {selectedContent.semester}. You can access detailed video
                lectures, and previous year question papers (notes) for better
                understanding.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-40">
              {[
                {
                  title: "YouTube Videos",
                  desc: "Watch curated video lectures to gain a deeper understanding and strengthen your grasp of the subject for better exam preparation.",
                  link: selectedContent?.ytLink || "#",
                },
                {
                  title: "notes",
                  desc: "To access previous year question papers for exam preparation, visit the UIET website and use the subject code to find the relevant papers.",
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
                    className={`inline-block px-6 py-2 w-full text-center ${
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
              IT Content
            </h4>
            <img src="/images/img6.jpeg" alt="IT IMG" className="rounded-md md:h-[55%] md:w-full" />
            <p className="text-[#403C5C] mb-4 py-4">
              Access detailed IT lectures, handwritten notes, and previous year
              question papers (notes) – all available for free to enhance your
              academic journey.
            </p>
            <button 
            onClick={handleNavigateToITContent}
            className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] mt-6">
              Access IT Resources
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">
              Engage with Seniors
            </h4>
            <img src="/images/img5.jpeg" alt="EWS IMG" className="rounded-md md:h-[55%] md:w-full" />
            <p className="text-[#403C5C] mb-4 py-4">
              Learn from experienced seniors through active engagement,
              mentoring opportunities, and insights that bridge the gap between
              academics and practical knowledge.
            </p>
            <button className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED]">
              Engage with Seniors Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GATEContent;
