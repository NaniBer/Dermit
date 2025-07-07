
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ConsultationNotificationToast from "@/components/ConsultationNotificationToast";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminPatients from "./pages/AdminPatients";
import NewConsultation from "./pages/NewConsultation";
import PatientChat from "./pages/PatientChat";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ConsultationNotificationToast />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/consultations" element={<Consultations />} />

            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/new-consultation"
              element={<NewConsultation />}
            />
            <Route path="/patient/chat" element={<PatientChat />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route
              path="/patient/consultations"
              element={<PatientConsultations />}
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
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/patients" element={<AdminPatients />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
