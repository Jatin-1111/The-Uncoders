import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITContent = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const subjects = {
    1: ["Applied Physics", "Calculus", "Workshop", "Programming Fundamental", "Professional Communication"],
    2: ["Applied Chemistry", "Differential Equation and Transformation", "BEEE", "Engineering Graphics", "OOPS with C++"],
    3: ["Linear Algebra and Probability", "Digital Electronics", "DBMS", "Data Structure", "Computer Architecture and Organisation"],
    4: ["Economics", "Discrete Structure", "Computer Network", "Micro-Processor", "Operating System"],
  };

  const chapters = {
    "Applied Physics": ["Oscillations", "Electromagnetic Waves", "Polarization", "Lasers and Optical Fibers"],
    "Calculus": ["Sequences and Series", "Differential Calculus", "Integral Calculus", "Vector Calculus"],
    "Programming Fundamental": ["Introduction to Programming", "Data Types", "Control Structures", "Functions"],
  };

  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const handleSubmit = () => {
    if (semester && subject && chapter) {
      setSelectedContent({ semester, subject, chapter });
      setShowDialog(false);
    } else {
      alert("Please select Semester, Subject, and Chapter!");
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#FAF4ED] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-center items-center flex-col p-8 text-[#403C5C] space-y-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center">IT Content</h2>
        <h3 className="text-lg md:text-xl text-center">Explore the best resources for your IT journey!</h3>
        <button
          onClick={() => setShowDialog(true)}
          className="px-8 py-4 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
        >
          Select Semester, Subject and Chapter
        </button>
      </div>

      {/* Rest of the component remains exactly the same */}
      {showDialog && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#403C5C]">Select Your Semester, Subject, and Chapter</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-2xl font-bold text-[#403C5C] hover:text-[#B3C7E6]"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#403C5C] mb-2">Select Semester:</label>
                <select
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    setSubject("");
                    setChapter("");
                  }}
                  className="w-full p-2 border border-[#CBAACB] rounded focus:ring-2 focus:ring-[#D4C1EC]"
                >
                  <option value="">Choose a semester</option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      Semester {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#403C5C] mb-2">Select Subject:</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setChapter("");
                  }}
                  className="w-full p-2 border border-[#CBAACB] rounded focus:ring-2 focus:ring-[#D4C1EC]"
                  disabled={!semester}
                >
                  <option value="">Choose a subject</option>
                  {semester && subjects[semester]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#403C5C] mb-2">Select Chapter:</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full p-2 border border-[#CBAACB] rounded focus:ring-2 focus:ring-[#D4C1EC]"
                  disabled={!subject || !chapters[subject]}
                >
                  <option value="">Choose a chapter</option>
                  {subject && chapters[subject]?.map((chap) => (
                    <option key={chap} value={chap}>
                      {chap}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Display Section */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
          className="w-[85vw] md:max-w-6xl mx-auto px-4 md:px-6 py-6 mt-6 bg-white border border-[#CBAACB] rounded-md shadow-md"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#403C5C]">
                Semester {selectedContent.semester} - {selectedContent.subject} - {selectedContent.chapter}
              </h3>
              <p className="text-[#403C5C]">
                Here is the content for <strong>{selectedContent.chapter}</strong> from <strong>{selectedContent.subject}</strong> in Semester {selectedContent.semester}.
                You can access detailed notes, video lectures, and previous year question papers (PYQs) for better understanding.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { title: "YT Videos", desc: "Watch curated video lectures for an in-depth understanding.", link: "/ytvideos" },
                { title: "PYQs", desc: "Access previous year question papers to boost exam preparation.", link: "/pyqs" },
                { title: "Notes", desc: "Get detailed notes to enhance your learning experience.", link: "/notes" },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[30%]"
                >
                  <h4 className="text-xl font-bold text-[#403C5C] mb-4">{card.title}</h4>
                  <p className="text-[#403C5C] mb-4">{card.desc}</p>
                  <a
                    href={card.link}
                    className="inline-block px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED]"
                  >
                    Click Here
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GATE Prep Section */}
      <motion.div
        className="max-w-6xl mx-auto p-6 mt-12 rounded-md"
        initial={{ opacity: 1 }}
        animate={{ translateY: selectedContent ? "20px" : "0px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">GATE Preparation</h4>
            <img src="/images/img4.jpg" alt="Gate IMG" className="rounded-md " />
            <p className="text-[#403C5C] mb-4 py-4">
              Ace your GATE exams with curated IT resources, including video lectures, expertly crafted notes, and solved PYQs.
            </p>
            <button className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] mt-6">
              Click Here
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#CBAACB] hover:shadow-xl transition-all w-[90%] md:w-[45%]">
            <h4 className="text-2xl font-bold text-[#403C5C] mb-4 text-center">Engage with Seniors</h4>
            <img src="/images/img5.jpeg" alt="EWS IMG" className="rounded-md"/>
            <p className="text-[#403C5C] mb-4 py-4">
              Learn from experienced seniors through active engagement, mentoring opportunities, and insights that bridge the gap between academics and practical knowledge.
            </p>
            <button className="w-full px-6 py-2 bg-[#D4C1EC] text-[#403C5C] rounded font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED]">
              Click Here
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ITContent;