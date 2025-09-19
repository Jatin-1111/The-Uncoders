import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
// import { ToastContainer } from "react-toastify";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Content = lazy(() => import("./pages/Content"));
const ITContent = lazy(() => import("./pages/ITContent"));
const GATEContent = lazy(() => import("./pages/GateContent"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#FAF4ED] flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FAF4ED] flex flex-col">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin Routes */}
              <Route
                path="/admin-panel69"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/content"
                element={
                  <ProtectedRoute>
                    <Content />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/content/it"
                element={
                  <ProtectedRoute>
                    <ITContent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/content/gate"
                element={
                  <ProtectedRoute>
                    <GATEContent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
          toastClassName="bg-white border border-[#CBAACB] text-[#403C5C] shadow-lg"
          bodyClassName="text-sm font-medium"
        /> */}
      </div>
    </AuthProvider>
  );
};

export default App;
