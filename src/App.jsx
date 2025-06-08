import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./components/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components for better performance
const Home = lazy(() => import("./components/Home"));
const Content = lazy(() => import("./components/Content"));
const ITContent = lazy(() => import("./components/ITContent"));
const GATEContent = lazy(() => import("./components/gateContent"));
const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/profile"));
const ResetPassword = lazy(() => import("./components/reset-password"));
const AdminPanel = lazy(() => import("./components/Admin-panel"));
const CurriculumInitializer = lazy(() => import("./components/CurriculumInitializer"));
const CurriculumAdminPanel = lazy(() => import("./components/CurriculumAdminPanel"));

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
              <Route path="/admin-panel69" element={<AdminPanel />} />
              <Route path="/setup-curriculum" element={<CurriculumInitializer />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/content" element={
                <ProtectedRoute>
                  <Content />
                </ProtectedRoute>
              } />
              
              <Route path="/content/it" element={
                <ProtectedRoute>
                  <ITContent />
                </ProtectedRoute>
              } />
              
              <Route path="/content/gate" element={
                <ProtectedRoute>
                  <GATEContent />
                </ProtectedRoute>
              } />
              
              <Route path="/admin-curriculum" element={
                <ProtectedRoute>
                  <CurriculumAdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        <ToastContainer
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
        />
      </div>
    </AuthProvider>
  );
};

export default App;