import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { initDemoData } from "@/lib/storage";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Subscriptions from "./pages/Subscriptions";
import Staff from "./pages/Staff";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64">
              <Header />
              <main className="p-4 lg:p-8 pb-20 lg:pb-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <MobileNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
