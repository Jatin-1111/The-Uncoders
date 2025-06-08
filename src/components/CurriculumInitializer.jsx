// src/components/CurriculumInitializer.jsx
import { useState } from "react";
import { curriculumService } from "../services/curriculumService";

const CurriculumInitializer = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initializeCurriculum = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("Initializing curriculum...");

      await curriculumService.initializeCurriculum();

      setMessage(
        "✅ Curriculum initialized successfully! You can now use the IT Content page."
      );
    } catch (err) {
      setError("❌ Failed to initialize curriculum: " + err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("Testing Firebase connection...");

      const data = await curriculumService.getAllSemesters();

      if (Object.keys(data).length > 0) {
        setMessage(
          "✅ Firebase connection successful! Found " +
            Object.keys(data).length +
            " semesters."
        );
      } else {
        setMessage(
          '⚠️ Firebase connected but no curriculum data found. Click "Initialize Curriculum" to add data.'
        );
      }
    } catch (err) {
      setError("❌ Firebase connection failed: " + err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF4ED] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#403C5C] mb-6 text-center">
          Curriculum Setup
        </h2>

        <div className="space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Testing..." : "Test Firebase Connection"}
          </button>

          <button
            onClick={initializeCurriculum}
            disabled={loading}
            className="w-full py-3 bg-[#D4C1EC] text-[#403C5C] rounded-lg hover:bg-[#B3C7E6] hover:text-[#FAF4ED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Initializing..." : "Initialize Curriculum"}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>⚠️ Only run initialization once!</p>
          <p>This will create the curriculum collection in Firebase.</p>
        </div>
      </div>
    </div>
  );
};

export default CurriculumInitializer;
