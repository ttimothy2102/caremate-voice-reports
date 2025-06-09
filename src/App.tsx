
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LiquidGradientStyles } from "@/components/ui/liquid-gradient-styles";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MobileHome from "./pages/MobileHome";
import Residents from "./pages/Residents";
import Schedule from "./pages/Schedule";
import TodaysReports from "./pages/TodaysReports";
import VoiceInput from "./pages/VoiceInput";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import GDPR from "./pages/GDPR";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { Vitals } from "./pages/Vitals";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LiquidGradientStyles />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mobile-home" element={<MobileHome />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/todays-reports" element={<TodaysReports />} />
          <Route path="/voice-input" element={<VoiceInput />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
