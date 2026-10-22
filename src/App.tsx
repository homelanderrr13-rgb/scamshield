import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { AnalyzerPage } from "@/pages/AnalyzerPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AboutPage } from "@/pages/AboutPage";
import type { Page } from "@/components/Logo";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.title = "ScamShield AI — Cyber Fraud Detector";
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {currentPage === "home" && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === "analyzer" && <AnalyzerPage onNavigate={handleNavigate} />}
        {currentPage === "dashboard" && <DashboardPage onNavigate={handleNavigate} />}
        {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
