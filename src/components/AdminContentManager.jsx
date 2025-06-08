import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Video,
  FileText,
  ExternalLink,
  Upload,
  Download,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contentService } from "../services/ContentService";

const AdminContentManager = () => {
  // Normalized data structure that doesn't make my eyes bleed
  const [contentData, setContentData] = useState({
    itContent: {}, // semester -> subject -> chapter -> {ytLink, pyqs, notes}
    gateContent: {}, // subject -> chapter -> {ytLink, notes, pyqs}
  });

  const [activeTab, setActiveTab] = useState("it"); // 'it' or 'gate'
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    semester: "",
    subject: "",
    chapter: "",
    ytLink: "",
    pyqs: "",
    notes: "",
  });

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, []);

  const showMessage = (msg, type) => {
    if (type === "error") {
      setError(msg);
      setTimeout(() => setError(""), 5000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const loadExistingData = async () => {
    setLoading(true);
    try {
      // In a real app, uncomment this to load from Firebase:
      // const data = await contentService.loadContent();
      // setContentData(data);

      // For now, loading the existing messy data structure
      loadStaticData();
      showMessage("Content loaded successfully! 🚀", "success");
    } catch (err) {
      showMessage("Failed to load content: " + err.message, "error");
      loadStaticData(); // Fallback to static data
    } finally {
      setLoading(false);
    }
  };

  const loadStaticData = () => {
    // Transform the messy existing structure into something usable
    const existingITData = {
      1: {
        "Applied Physics": {
          Oscillations: {
            ytLink:
              "https://www.youtube.com/playlist?list=PLSWDszNFa1Q3aQmaSthNcX-mMgjjKIxOZ",
            pyqs: "https://drive.google.com/drive/folders/1PvrRqkNbNsCu9r7B_STBEPQ2ZCue-xgk",
            notes:
              "https://drive.google.com/drive/folders/1o730uMAlr_6TJV8UPpTgH-gky9oddhBs",
          },
        },
        "Programming Fundamentals": {
          "C Programming": {
            ytLink:
              "https://youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38wD3aR",
            pyqs: "https://drive.google.com/drive/folders/1p5wpghO4Q1MgX0vJ6HMEP85FZVU73-On",
            notes:
              "https://drive.google.com/drive/folders/1THvTeoJ6OT1PrPRFBpeTqnD1xp6iD35t",
          },
        },
      },
      2: {
        "Applied Chemistry": {
          "Chemical Bonding": {
            ytLink:
              "https://www.youtube.com/watch?v=Ym0jn-dHnPE&list=PLYqywOLBPSb0Zo0ByarczrB4vRKgC9AS0",
            pyqs: "https://uiet.puchd.ac.in/?page_id=4119",
            notes:
              "https://drive.google.com/drive/u/0/folders/1YHBc6UTmuIma8osifqwhe1sb1YeVCwQd",
          },
        },
      },
    };

    const existingGateData = {
      "Engineering Mathematics": {
        "Probability and Statistics": {
          ytLink:
            "https://www.youtube.com/playlist?list=PLvTTv60o7qj-q4idV59uKIkBPOxe-govX",
          notes: "",
          pyqs: "",
        },
      },
      "Digital Logic": {
        "Digital Logic - 1": {
          ytLink:
            "https://youtube.com/playlist?list=PLC36xJgs4dxEErKQZ7xFxat8oh4OepU34&si=GfDV5UK12CmHqK6H",
          notes: "",
          pyqs: "",
        },
      },
    };

    setContentData({
      itContent: existingITData,
      gateContent: existingGateData,
    });
  };

  const saveToFirebase = async (newData) => {
    try {
      setSaving(true);
      // Uncomment when using Firebase:
      // await contentService.saveContent(newData);

      // For demo, just simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showMessage("Content saved successfully! 💾", "success");
      return true;
    } catch (err) {
      showMessage("Failed to save: " + err.message, "error");
      return false;
    } finally {
      setSaving(false);
    }
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
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validate URLs
    const urlFields = ["ytLink", "pyqs", "notes"];
    for (const field of urlFields) {
      if (formData[field] && !isValidUrl(formData[field])) {
        showMessage(`Invalid URL in ${field}! Fix it, genius! 🔗`, "error");
        return;
      }
    }

    if (activeTab === "it") {
      if (!formData.semester || !formData.subject || !formData.chapter) {
        showMessage("Fill out all required fields, genius! 💥", "error");
        return;
      }
      await saveITContent();
    } else {
      if (!formData.subject || !formData.chapter) {
        showMessage("Subject and Chapter are required! 🎯", "error");
        return;
      }
      await saveGateContent();
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const saveITContent = async () => {
    const { semester, subject, chapter, ytLink, pyqs, notes } = formData;

    const newData = {
      ...contentData,
      itContent: {
        ...contentData.itContent,
        [semester]: {
          ...contentData.itContent[semester],
          [subject]: {
            ...contentData.itContent[semester]?.[subject],
            [chapter]: { ytLink, pyqs, notes },
          },
        },
      },
    };

    const saved = await saveToFirebase(newData);
    if (saved) {
      setContentData(newData);
      resetForm();
    }
  };

  const saveGateContent = async () => {
    const { subject, chapter, ytLink, pyqs = "", notes } = formData;

    const newData = {
      ...contentData,
      gateContent: {
        ...contentData.gateContent,
        [subject]: {
          ...contentData.gateContent[subject],
          [chapter]: { ytLink, notes, pyqs },
        },
      },
    };

    const saved = await saveToFirebase(newData);
    if (saved) {
      setContentData(newData);
      resetForm();
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (type, path) => {
    if (!confirm("Delete this? No going back! 🗑️")) return;

    const newData = { ...contentData };

    if (type === "it") {
      const [semester, subject, chapter] = path;
      if (chapter) {
        delete newData.itContent[semester][subject][chapter];
      } else if (subject) {
        delete newData.itContent[semester][subject];
      } else {
        delete newData.itContent[semester];
      }
    } else {
      const [subject, chapter] = path;
      if (chapter) {
        delete newData.gateContent[subject][chapter];
      } else {
        delete newData.gateContent[subject];
      }
    }

    const saved = await saveToFirebase(newData);
    if (saved) {
      setContentData(newData);
    }
  };

  const exportData = async () => {
    try {
      // For Firebase integration:
      // const dataStr = await contentService.exportToJSON();

      const dataStr = JSON.stringify(contentData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `content-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      showMessage("Data exported successfully! 📁", "success");
    } catch (err) {
      showMessage("Export failed: " + err.message, "error");
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate structure
        if (!importedData.itContent && !importedData.gateContent) {
          throw new Error("Invalid file format");
        }

        const saved = await saveToFirebase(importedData);
        if (saved) {
          setContentData(importedData);
          showMessage("Data imported successfully! 📥", "success");
        }
      } catch (err) {
        showMessage("Import failed: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  };

  const renderITContent = () => {
    return Object.entries(contentData.itContent).map(([semester, subjects]) => (
      <div
        key={semester}
        className="mb-6 border border-gray-200 rounded-lg p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#403C5C]">
            Semester {semester}
          </h3>
          <button
            onClick={() => handleDelete("it", [semester])}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {Object.entries(subjects).map(([subject, chapters]) => (
          <div
            key={subject}
            className="ml-4 mb-4 border-l-2 border-[#D6CFE9] pl-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-[#403C5C]">{subject}</h4>
              <button
                onClick={() => handleDelete("it", [semester, subject])}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {Object.entries(chapters).map(([chapter, data]) => (
              <div
                key={chapter}
                className="ml-4 mb-2 p-3 bg-gray-50 rounded border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-[#403C5C]">{chapter}</h5>
                    <div className="flex gap-2 mt-2">
                      {data.ytLink && (
                        <a
                          href={data.ytLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Video size={16} />
                        </a>
                      )}
                      {data.notes && (
                        <a
                          href={data.notes}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FileText size={16} />
                        </a>
                      )}
                      {data.pyqs && (
                        <a
                          href={data.pyqs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-700"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit({
                          semester,
                          subject,
                          chapter,
                          ...data,
                        })
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete("it", [semester, subject, chapter])
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  };

  const renderGateContent = () => {
    return Object.entries(contentData.gateContent).map(
      ([subject, chapters]) => (
        <div
          key={subject}
          className="mb-6 border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#403C5C]">{subject}</h3>
            <button
              onClick={() => handleDelete("gate", [subject])}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {Object.entries(chapters).map(([chapter, data]) => (
            <div
              key={chapter}
              className="ml-4 mb-2 p-3 bg-gray-50 rounded border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-[#403C5C]">{chapter}</h4>
                  <div className="flex gap-2 mt-2">
                    {data.ytLink && (
                      <a
                        href={data.ytLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Video size={16} />
                      </a>
                    )}
                    {data.notes && (
                      <a
                        href={data.notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FileText size={16} />
                      </a>
                    )}
                    {data.pyqs && (
                      <a
                        href={data.pyqs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit({
                        subject,
                        chapter,
                        ...data,
                      })
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete("gate", [subject, chapter])}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF4ED] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2"
            >
              <AlertTriangle size={20} />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2"
            >
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#403C5C]">
            Content Management 📚
          </h1>
          <div className="flex gap-4">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: "none" }}
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
            >
              <Upload size={20} />
              Import Data
            </label>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#403C5C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5C6BC0]"
              disabled={saving}
            >
              <Plus size={20} />
              Add Content
            </button>
            <button
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={20} />
              Export Data
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("it")}
            className={`px-6 py-3 font-medium ${
              activeTab === "it"
                ? "text-[#403C5C] border-b-2 border-[#403C5C]"
                : "text-gray-500 hover:text-[#403C5C]"
            }`}
          >
            IT Content
          </button>
          <button
            onClick={() => setActiveTab("gate")}
            className={`px-6 py-3 font-medium ${
              activeTab === "gate"
                ? "text-[#403C5C] border-b-2 border-[#403C5C]"
                : "text-gray-500 hover:text-[#403C5C]"
            }`}
          >
            GATE Content
          </button>
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 shadow-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#403C5C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {activeTab === "it" ? renderITContent() : renderGateContent()}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
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
                    {editingItem ? "Edit" : "Add"}{" "}
                    {activeTab === "it" ? "IT" : "GATE"} Content
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === "it" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester *
                      </label>
                      <input
                        type="number"
                        value={formData.semester}
                        onChange={(e) =>
                          setFormData({ ...formData, semester: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 1, 2, 3..."
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Applied Physics"
                      required
                    />
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
                      onClick={handleSubmit}
                      disabled={saving}
                      className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                        saving
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-[#403C5C] text-white hover:bg-[#5C6BC0]"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {editingItem ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetForm}
                      disabled={saving}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContentManager;
