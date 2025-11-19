import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TestList } from "../components/candidate/TestList";
import { EmptyState } from "../components/candidate/EmptyState";
import { Test } from "../components/candidate/TestCard";
import { useAuthStore } from "../stores/authStore";
import { useNotificationStore } from "../stores/notificationStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationPanel } from "../components/candidate/NotificationPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOutIcon, BellIcon, Loader2 } from "lucide-react";
import api from "@/lib/api";

export function CandidateTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  useEffect(() => {
    const loadTests = async () => {
      try {
        // 1️⃣ Traer asignaciones
        const assignmentRes = await api.get("/api/v1/candidate/tests");
        const assignments = assignmentRes.data;

        // 2️⃣ Cargar detalles reales para cada prueba
        const fullTests: Test[] = await Promise.all(
          assignments.map(async (a: any) => {
            try {
              const detailsRes = await api.get(`/api/v1/candidate/test/${a.id}`);
              const d = detailsRes.data;

              return {
                id: a.id,
                language: d.language,
                level: d.level,
                title: d.title,
                status:
                  a.status === "SENT"
                    ? "pending"
                    : a.status === "COMPLETED"
                    ? "completed"
                    : "pending",
                assignedDate: new Date(a.assignedAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                duration: d.duration ?? 60,
                problemSummary:
                  d.description.length > 120
                    ? d.description.slice(0, 120) + "..."
                    : d.description,
                testCaseCount: d.testCases?.length || 0,
              };
            } catch (err) {
              console.error("Error cargando test:", err);
              return null;
            }
          })
        );

        setTests(fullTests.filter((t): t is Test => t !== null));
      } catch (err) {
        console.error("Error cargando pruebas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-alt font-bold text-foreground">TestIA</h1>
            <span className="text-muted-foreground">|</span>
            <h2 className="text-xl font-medium text-foreground">Mis Pruebas</h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email ?? ""}
            </span>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="bg-transparent text-foreground hover:bg-muted relative"
                aria-label="Notificaciones"
              >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            <ThemeToggle />

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="bg-transparent text-foreground hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Cerrar sesión"
            >
              <LogOutIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tests.length > 0 ? (
            <TestList tests={tests} />
          ) : (
            <EmptyState />
          )}
        </motion.div>
      </main>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
