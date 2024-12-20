import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITContent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popup2Message, setPopup2Message] = useState("");
  const [formData, setFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
  });

  const syllabus = {
    1: {
      "Applied Physics": {
        chapters: {
          Oscillations: {
            ytLink:
              "https://www.youtube.com/playlist?list=PLSWDszNFa1Q3aQmaSthNcX-mMgjjKIxOZ",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
          "Electromagnetic Waves": {
            ytLink:
              "https://www.youtube.com/playlist?list=PL5zwY2E7i60UOvHJEOpJEw-lR2Zdmg2Ik",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
          Polarization: {
            ytLink:
              "https://www.youtube.com/playlist?list=PLAPKGqvQGg6rKWLDXQ3i3O0P5DVA5uxs8",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
          Laser: {
            ytLink:
              "https://www.youtube.com/watch?v=2BzQYDwZeZk&list=PL5zwY2E7i60XzRPOrKzvSzjvxnyK6jQB3",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
          "Optical Fibre": {
            ytLink:
              "https://www.youtube.com/watch?v=QQPjAIHRhFk&list=PL5zwY2E7i60WKxGzyMVr7U71VWuCAU5Jj",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
        },
      },
      Calculus: {
        chapters: {
          "Sequences and Series": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLhSp9OSVmeyI3uivqqHzrlomwD6gZx2-R",
            pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
            notes:
              "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V",
          },
          "Partial Differentiation": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLVCBPCYGv7bDiiZ5fP856_EGNyf34avaH",
            pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
            notes:
              "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V",
          },
          "Integral Calculus": {
            ytLink:
              "https://youtube.com/playlist?list=PL-s82sZoRUdDxjKVucnabhn9kO3GWrAS1",
            pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
            notes:
              "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V",
          },
          "Vector Calculus": {
            ytLink:
              "https://youtube.com/playlist?list=PL-s82sZoRUdARGbMQAn4M7AZwC0uLK9yY",
            pyqs: "https://drive.google.com/drive/folders/1DZmP6XxH6kf7QI_6XKtLxCFDBm0bFkYU",
            notes:
              "https://drive.google.com/drive/folders/1NkaTBM-OQoZrEdMDAQXWMipoGPZLKk4V",
          },
        },
      },
      "Programming Fundamentals": {
        chapters: {
          "C Programming": {
            ytLink:
              "https://youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR",
            pyqs: "https://drive.google.com/drive/folders/1p5wpghO4Q1MgX0vJ6HMEP85FZVU73-On",
            notes:
              "https://drive.google.com/drive/folders/1THvTeoJ6OT1PrPRFBpeTqnD1xp6iD35t",
          },
        },
      },
      "Professional Communication": {
        chapters: {
          "Professional Communication Skills": {
            ytLink:
              "https://youtube.com/playlist?list=PL9RcWoqXmzaKWxaNoDhW4O1kA0hK9AYys",
            pyqs: "https://drive.google.com/drive/folders/1EAstkD36g_k-6ds6E_uqZnTlmQU6kX5t",
            notes:
              "https://drive.google.com/drive/folders/1YQ2p7Zf5wR-osyNbyQvBxm7CTOHLFee-",
          },
        },
      },
      Workshop: {
        chapters: {
          Workshop: {
            ytLink:
              "https://youtube.com/playlist?list=PLJu6FW_RN3r69JZbDBMNtBICM8NbmtplZ",
            pyqs: "",
            notes:
              "https://drive.google.com/drive/folders/1yYH46q9KMBbzl2wkBsT1o1YNro6g8CRE",
          },
        },
      },
    },
    2: {
      "Applied Chemistry": {
        chapters: {
          "Chemical Bonding": {
            ytLink:
              "https://www.youtube.com/watch?v=Ym0jn-dHnPE&list=PLYqywOLBPSb0Zo0ByarczrB4vRKgC9AS0",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
          "Stereochemistry of Organic Compounds": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLLf6O8XdGj03fWMXEe-8QJNVJ-ySOF0jO",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
          Spectroscopy: {
            ytLink:
              "https://youtube.com/playlist?list=PLLf6O8XdGj03ktP4MHmIV87pHZHBEUF6f&si=ESEYTAPocaTPmBeY",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
          Thermodynamics: {
            ytLink: "https://www.youtube.com/watch?v=kkUWKF7TFno",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
          Catalysis: {
            ytLink: "",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
          Polymers: {
            ytLink:
              "https://youtube.com/playlist?list=PLiYAH68F-CTDvXZ2G5JICP91oxb1WX1d_&si=rAkvQVOhwWwuhDnC",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
        },
      },
      "Differential Equation and Transformation": {
        chapters: {
          "Ordinary Differential Equations": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLVCBPCYGv7bB7ZxAx2rT0Ln2G6ad4ME-1",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes: "",
          },
          "Partial Differential Equations": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLhSp9OSVmeyJoNnAqghUK-Lit3qBgfa6o",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes: "",
          },
          "Laplace Transformation": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLVCBPCYGv7bB5mBCyEIBxFnl3OLW0Vmu1",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes: "",
          },
          "Fourier Series": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLhSp9OSVmeyLke5_cby8i8ZhK8FHpw3qs",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes: "",
          },
          "Fourier Transformation": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLhSp9OSVmeyJ5N-JUEZj7uS6IAT9a79nD",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes: "",
          },
        },
      },
      BEEE: {
        chapters: {
          BEE: {
            ytLink:
              "https://www.youtube.com/playlist?list=PL9RcWoqXmzaLTYUdnzKhF4bYug3GjGcEc",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi",
          },
          Diodes: {
            ytLink:
              "https://www.youtube.com/playlist?list=PL3qvHcrYGy1uF5KAGntUITTJ85Dm3Dtdy",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi",
          },
          Transformers: {
            ytLink:
              "https://www.youtube.com/playlist?list=PL4K9r9dYCOors6MRFwoIe9_iBzSzUp2Zi",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1Kj7lXZbREk9EjUK3Vf_9G2CI1m47KXNi",
          },
        },
      },
      "Engineering Graphics": {
        chapters: {
          "Orthographic Projections": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLDN15nk5uLiBpnIOK5r3KXdfFOVzGHJSt",
            pyqs: "",
            notes:
              "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W",
          },
          "Isometric Projections": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLDN15nk5uLiCf-raL06kSCeqR8h61eYIC",
            pyqs: "",
            notes:
              "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W",
          },
          "Projection of Regular Solids": {
            ytLink: "",
            pyqs: "",
            notes:
              "https://drive.google.com/drive/u/0/folders/1SEGMvIYs5PuV7LA8EzHUAO9VLDUreh4W",
          },
        },
      },
      "OOPS with C++": {
        chapters: {
          "Complete Playlist": {
            ytLink:
              "https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
            pyqs: "",
            notes: "",
          },
        },
      },
    },
    3: {
      "Linear Algebra and Probability": {
        chapters: {
          "Matrices and Linear Equations": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Vector Spaces": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Probability Concepts": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Random Variables": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Digital Electronics": {
        chapters: {
          "Boolean Algebra": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Combinational Circuits": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Sequential Circuits": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Memory and PLDs": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      DBMS: {
        chapters: {
          "Database Concepts": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          SQL: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          Normalization: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Transaction Management": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Data Structure": {
        chapters: {
          "Arrays and Linked Lists": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Stacks and Queues": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          Trees: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          Graphs: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Searching and Sorting": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Computer Architecture and Organisation": {
        chapters: {
          "Computer Organization Basics": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "CPU Architecture": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Memory Organization": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "I/O Organization": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
    },
    4: {
      Economics: {
        chapters: {
          "Basic Economic Concepts": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Market Structure": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Financial Management": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Project Management": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Discrete Structure": {
        chapters: {
          "Set Theory": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Relations and Functions": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Graph Theory": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Boolean Algebra": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Computer Network": {
        chapters: {
          "Network Fundamentals": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Data Link Layer": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Network Layer": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Transport Layer": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Application Layer": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Micro-Processor": {
        chapters: {
          "8085 Architecture": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Assembly Language Programming": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          Interfacing: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "8086 Microprocessor": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
      "Operating System": {
        chapters: {
          "OS Introduction": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Process Management": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "Memory Management": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          "File Systems": {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
          Deadlocks: {
            ytLink: "",
            pyqs: "",
            notes: "",
          },
        },
      },
    },
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

  const handleSubmit = () => {
    setFormData(true);
    const { semester, subject, chapter } = formData;

    if (!semester || !subject || !chapter) {
      setPopup2Message("Please select Semester, Subject and Chapter!");
      setShowPopup2(true);
      setShowDialog(false);
      return;
    }

    const subjectData = syllabus[semester]?.[subject];
    const chapterData = subjectData?.chapters?.[chapter];

    if (!chapterData) {
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
      ...chapterData,
    });
    setShowDialog(false);
  };

  const getAvailableSubjects = (semester) => {
    return semester ? Object.keys(syllabus[semester] || {}) : [];
  };

  const getAvailableChapters = (semester, subject) => {
    return semester && subject
      ? Object.keys(syllabus[semester]?.[subject]?.chapters || {})
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
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90vw] md:w-[30vw] ">
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
          >
            &times;
          </button>
        </div>
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
            >
              <option value="">Choose a semester</option>
              {Object.keys(syllabus).map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-[#403C5C] mb-2">Select Subject:</label>
            <select
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!formData.semester}
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
            <label className="block text-[#403C5C] mb-2">Select Chapter:</label>
            <select
              value={formData.chapter}
              onChange={(e) => handleInputChange("chapter", e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!formData.subject}
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
            className="w-full py-3 bg-[#D4C1EC] rounded-md font-bold hover:bg-[#B3C7E6]"
          >
            Submit
          </button>
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
      <div className="flex justify-center items-center flex-col p-8 text-[#403C5C] space-y-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          IT Content
        </h2>
        <button
          onClick={() => setShowDialog(true)}
          className="px-8 py-4 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
        >
          Select Semester, Subject, and Chapter
        </button>
      </div>

      {/* Dialogs */}
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
            <img src="/images/img4.jpg" alt="Gate IMG" className="rounded-md" />
            <p className="text-[#403C5C] mb-4 py-4">
              Ace your GATE exams with curated IT resources, including video
              lectures, expertly crafted notes, and solved PYQs.
            </p>
            <button className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] mt-6">
              Start Your GATE Journey
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">
              Engage with Seniors
            </h4>
            <img src="/images/img5.jpeg" alt="EWS IMG" className="rounded-md" />
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

export default ITContent;
