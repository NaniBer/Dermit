import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminPatients from "./pages/AdminPatients";
import NewConsultation from "./pages/NewConsultation";
import PatientProfile from "./pages/PatientProfile";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorProfile from "./pages/DoctorProfile";
import NotFound from "./pages/NotFound";
import DoctorConsultations from "./pages/DoctorConsultations";
import DoctorConsultationDetail from "./pages/DoctorConsultationDetail";
import AdminDoctors from "./pages/AdminDoctors";
import PatientConsultations from "./pages/PatientConsultation";
import PatientConsultationChat from "./pages/PatientConsultationChat";
import Consultations from "./pages/Consultations";
import { useState } from "react";
import InstantNotificationSystem from "./components/InstantNotificationSystem";
import AcceptConsultationPage from "./pages/AcceptConsultation";
import TermsoFService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import Consent from "./pages/Consent";
import PatientFeedback from "./pages/PatientFeedback";
import DoctorThankyou from "./pages/DoctorThankyou";
import AuthCallback from "./pages/auth-callback";

const queryClient = new QueryClient();

const App = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <InstantNotificationSystem
              onBadgeCountChange={setNotificationCount}
            />

            {/* <DoctorNotificationToast /> */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/terms" element={<TermsoFService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Patient Routes */}

              {/* <Route path="/patient/dashboard" element={<PatientDashboard />} /> */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/consent" element={<Consent />} />
              <Route
                path="/patient/new-consultation"
                element={<NewConsultation />}
              />
              <Route path="/patient/profile" element={<PatientProfile />} />
              <Route
                path="/patient/consultations"
                element={<PatientConsultations />}
              />
              <Route
                path="/patient/feedback/:id"
                element={<PatientFeedback />}
              />
              <Route
                path="/patient/consultation/:id"
                element={<PatientConsultationChat />}
              />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor/consultations"
                element={<DoctorConsultations />}
              />
              <Route
                path="/doctor/consultation/:id"
                element={<DoctorConsultationDetail />}
              />
              <Route path="/doctor/thank-you" element={<DoctorThankyou />} />

              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/overview" element={<AdminOverview />} />
              <Route path="/admin/doctors" element={<AdminDoctors />} />
              <Route path="/admin/patients" element={<AdminPatients />} />

              {/* Accepting the consultation */}
              <Route
                path="/consultation/:consultationId/accept"
                element={<AcceptConsultationPage />}
              />
              <Route path="/auth-callback" element={<AuthCallback />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
