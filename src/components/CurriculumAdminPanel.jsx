// src/components/CurriculumAdminPanel.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Video,
  FileText,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { curriculumService } from "../services/curriculumService";

const CurriculumAdminPanel = () => {
  const [curriculumData, setCurriculumData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
    ytLink: "",
    pyqs: "",
    notes: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadCurriculumData();
  }, []);

  const loadCurriculumData = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getAllSemesters();
      setCurriculumData(data);
    } catch (error) {
      showMessage("Failed to load curriculum data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const resetForm = () => {
    setFormData({
      semester: "",
      subject: "",
      chapter: "",
      ytLink: "",
      pyqs: "",
      notes: "",
    });
    setEditingChapter(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.semester || !formData.subject || !formData.chapter) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    // Validate URLs
    const urlFields = ["ytLink", "pyqs", "notes"];
    for (const field of urlFields) {
      if (formData[field] && !curriculumService.validateUrl(formData[field])) {
        showMessage(`Invalid URL in ${field}`, "error");
        return;
      }
    }

    try {
      setLoading(true);
      const semesterKey = `semester${formData.semester}`;
      const chapterData = {
        ytLink: formData.ytLink,
        pyqs: formData.pyqs,
        notes: formData.notes,
      };

      if (editingChapter) {
        await curriculumService.updateChapter(
          semesterKey,
          formData.subject,
          formData.chapter,
          chapterData
        );
        showMessage("Chapter updated successfully!", "success");
      } else {
        await curriculumService.addChapter(
          semesterKey,
          formData.subject,
          formData.chapter,
          chapterData
        );
        showMessage("Chapter added successfully!", "success");
      }

      await loadCurriculumData();
      resetForm();
    } catch (error) {
      showMessage("Failed to save chapter: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (semester, subject, chapter, data) => {
    setFormData({
      semester: semester.replace("semester", ""),
      subject,
      chapter,
      ytLink: data.ytLink || "",
      pyqs: data.pyqs || "",
      notes: data.notes || "",
    });
    setEditingChapter({ semester, subject, chapter });
    setShowModal(true);
  };

  const handleDelete = async (semester, subject, chapter) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${chapter}" from ${subject}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await curriculumService.deleteChapter(semester, subject, chapter);
      showMessage("Chapter deleted successfully!", "success");
      await loadCurriculumData();
    } catch (error) {
      showMessage("Failed to delete chapter: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSubjects = (semester) => {
    if (!semester) return [];
    const semesterKey = `semester${semester}`;
    const semesterData = curriculumData[semesterKey];
    return semesterData?.subjects ? Object.keys(semesterData.subjects) : [];
  };

  return (
    <div className="min-h-screen bg-[#FAF4ED] p-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#403C5C]">
            Curriculum Management 📚
          </h1>
          <div className="flex gap-4">
            <button
              onClick={loadCurriculumData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="bg-[#403C5C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5C6BC0] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Chapter
            </button>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Display */}
        {loading && Object.keys(curriculumData).length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#403C5C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading curriculum...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {Object.entries(curriculumData).map(
              ([semesterKey, semesterData]) => (
                <div
                  key={semesterKey}
                  className="bg-white rounded-lg p-6 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-[#403C5C] mb-4">
                    {semesterKey.replace("semester", "Semester ")}
                  </h2>

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
                                        handleEdit(
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
                                        handleDelete(
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
                </div>
              )
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
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
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
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
                        value={formData.subject}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        disabled
                      />
                    ) : (
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Subject</option>
                        {getAvailableSubjects(formData.semester).map(
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
                      value={formData.chapter}
                      onChange={(e) =>
                        setFormData({ ...formData, chapter: e.target.value })
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
                      value={formData.ytLink}
                      onChange={(e) =>
                        setFormData({ ...formData, ytLink: e.target.value })
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
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
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
                      value={formData.pyqs}
                      onChange={(e) =>
                        setFormData({ ...formData, pyqs: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                        loading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-[#403C5C] text-white hover:bg-[#5C6BC0]"
                      }`}
                    >
                      {loading ? (
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
                      onClick={resetForm}
                      disabled={loading}
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
      </div>
    </div>
  );
};

export default CurriculumAdminPanel;
