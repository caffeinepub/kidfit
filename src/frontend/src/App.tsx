import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import AdBanner from "./components/AdBanner";
import BottomNav from "./components/BottomNav";
import { useActor } from "./hooks/useActor";
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
const AvatarPage = lazy(() => import("./pages/AvatarPage"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const FriendsPage = lazy(() => import("./pages/FriendsPage"));

export type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin"
  | "leaderboard"
  | "avatar"
  | "premium"
  | "friends";

function PageLoader() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function StreakUpdater() {
  const { actor } = useActor();
  const { data: profile } = useUserProfile();
  const didUpdate = useRef(false);

  useEffect(() => {
    if (!actor || !profile || didUpdate.current) return;
    didUpdate.current = true;
    const today = new Date().toISOString().slice(0, 10);
    (actor as unknown as { updateStreak(date: string): Promise<bigint> })
      .updateStreak(today)
      .catch(() => {
        /* silent */
      });
  }, [actor, profile]);

  return null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

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
    const premiumSuccess = params.get("premium_success");
    if (premiumSuccess) {
      setCurrentPage("premium");
    }
  }, []);

  const showAuth =
    !isInitializing &&
    (!isAuthenticated || (isAuthenticated && !profileLoading && !hasProfile));

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
        return <DietPage onNavigate={setCurrentPage} />;
      case "admin":
        return <AdminPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "avatar":
        return <AvatarPage onBack={() => setCurrentPage("profile")} />;
      case "premium":
        return <PremiumPage onBack={() => setCurrentPage("profile")} />;
      case "friends":
        return <FriendsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <StreakUpdater />
      <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      <BottomNav current={currentPage} onNavigate={setCurrentPage} />
      <AdBanner />
      <Toaster richColors position="top-center" />
    </div>
  );
}
