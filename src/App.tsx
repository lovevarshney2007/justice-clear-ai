import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CasePredictor from "./pages/CasePredictor";
import ChatWorkspace from "./pages/ChatWorkspace";
import WebSummarizer from "./pages/WebSummarizer";
import LegalSearch from "./pages/LegalSearch";
import DocumentHub from "./pages/DocumentHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/case-predictor" element={<ProtectedRoute><CasePredictor /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatWorkspace /></ProtectedRoute>} />
            <Route path="/summarizer" element={<ProtectedRoute><WebSummarizer /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><LegalSearch /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><DocumentHub /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
