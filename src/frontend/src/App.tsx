import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AdBanner from "./components/AdBanner";
import BottomNav from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import BattlePage from "./pages/BattlePage";
import DietPage from "./pages/DietPage";
import ExercisesPage from "./pages/ExercisesPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PushUpCounterPage from "./pages/PushUpCounterPage";
import TournamentsPage from "./pages/TournamentsPage";

type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Check for tournament success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tournamentSuccess = params.get("tournament_success");
    if (tournamentSuccess) {
      setCurrentPage("tournaments");
      // Clean the URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Show auth page if not logged in or profile not set up
  const isAuthenticated = !!identity;
  const hasProfile = !!profile;
  const showAuth =
    !isInitializing &&
    (!isAuthenticated || (isAuthenticated && !profileLoading && !hasProfile));

  if (isInitializing || (isAuthenticated && profileLoading && !profile)) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl font-black mb-2">
            KID<span className="text-neon-green">FIT</span>
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return (
      <>
        <AuthPage />
        <Toaster richColors position="top-center" />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "exercises":
        return <ExercisesPage />;
      case "pushups":
        return <PushUpCounterPage />;
      case "tournaments":
        return <TournamentsPage />;
      case "profile":
        return <ProfilePage onNavigate={setCurrentPage} />;
      case "battle":
        return <BattlePage />;
      case "diet":
        return <DietPage />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {renderPage()}
      <BottomNav current={currentPage} onNavigate={setCurrentPage} />
      <AdBanner />
      <Toaster richColors position="top-center" />
    </div>
  );
}
