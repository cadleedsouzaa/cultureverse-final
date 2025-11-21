import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider"; 

// --- IMPORT PAGES ---
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Result from "./pages/Result"; 
import Archive from "./pages/Archive"; 

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="culture-lens-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* 1. HOME / CAMERA */}
              <Route path="/" element={<Index />} />
              
              {/* 2. AR RESULT */}
              <Route path="/result/:id" element={<Result />} />

              {/* 3. ARCHIVE GALLERY */}
              <Route path="/archive" element={<Archive />} />
              
              {/* 4. 404 PAGE (Removed UnknownResult) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}