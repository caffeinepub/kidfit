import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import AdBanner from "./components/AdBanner";
import BottomNav from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";

const HomePage = lazy(() => import("./pages/HomePage"));
const ExercisesPage = lazy(() => import("./pages/ExercisesPage"));
const PushUpCounterPage = lazy(() => import("./pages/PushUpCounterPage"));
const TournamentsPage = lazy(() => import("./pages/TournamentsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const BattlePage = lazy(() => import("./pages/BattlePage"));
const DietPage = lazy(() => import("./pages/DietPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin"
  | "leaderboard";

function PageLoader() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Hard timeout: if loading screen shows for more than 4s, force proceed
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = !!identity;
  const hasProfile = !!profile;
  const isWaiting =
    isInitializing || (isAuthenticated && profileLoading && !profile);

  useEffect(() => {
    if (isWaiting && !loadingTimedOut) {
      timerRef.current = setTimeout(() => setLoadingTimedOut(true), 8000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isWaiting, loadingTimedOut]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tournamentSuccess = params.get("tournament_success");
    if (tournamentSuccess) {
      setCurrentPage("tournaments");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const showAuth =
    !isInitializing &&
    (!isAuthenticated || (isAuthenticated && !profileLoading && !hasProfile));

  // Show startup splash only while loading AND not yet timed out
  if (isWaiting && !loadingTimedOut) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl font-black mb-4">
            TEEN<span className="text-neon-green">TUFF</span>LIFTS
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (showAuth || loadingTimedOut) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
        <Toaster richColors position="top-center" />
      </Suspense>
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
      case "leaderboard":
        return <LeaderboardPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      <BottomNav current={currentPage} onNavigate={setCurrentPage} />
      <AdBanner />
      <Toaster richColors position="top-center" />
    </div>
  );
}
