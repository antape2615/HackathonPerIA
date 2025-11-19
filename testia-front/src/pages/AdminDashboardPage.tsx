import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { SidebarNav } from "../components/admin/SidebarNav";
import { KpiCard } from "../components/admin/KpiCard";
import { ScoreGauge } from "../components/admin/ScoreGauge";
import { RadarDimensions } from "../components/admin/RadarDimensions";
import { TimelineChart } from "../components/admin/TimelineChart";
import { SubmissionsTable } from "../components/admin/SubmissionsTable";
import { ComparisonChart } from "../components/admin/ComparisonChart";
import { SummaryCard } from "../components/admin/SummaryCard";

import { UsersIcon, FileCheckIcon, TrendingUpIcon, ClockIcon } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats.ts";

import { AdminSubmissionDetailModal } from "../components/admin/components/AdminSubmissionDetailModal";

export function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();

  // 👉 Modal state
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAssigned = stats?.total ?? 0;
  const completed = stats?.submitted ?? 0;
  const completionRate = stats?.completionRate ?? 0;

  // 👉 RECEIVES ASSIGNMENT ID ONLY
  const handleOpenDetail = (assignmentId: string) => {
    console.log("📌 Opening modal with assignmentId:", assignmentId);
    setSelectedAssignmentId(assignmentId);
    setOpenDetail(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-10 py-12">

          {/* Fade-in container */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >

            {/* Título principal */}
            <div className="mb-14">
              <h1 className="text-4xl font-alt font-bold text-foreground tracking-tight">
                Dashboard de evaluación
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Vista general del rendimiento de pruebas y entregas.
              </p>
            </div>

            {/* KPIs */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold mb-4 text-foreground/90">Indicadores clave</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                  title="Pruebas asignadas"
                  value={loading ? "..." : totalAssigned}
                  icon={UsersIcon}
                />

                <KpiCard
                  title="Pruebas completadas"
                  value={loading ? "..." : completed}
                  icon={FileCheckIcon}
                />

                <KpiCard
                  title="Tasa de finalización"
                  value={loading ? "..." : `${completionRate}%`}
                  icon={TrendingUpIcon}
                />

                <KpiCard
                  title="Tiempo promedio"
                  value="N/A (Mockup)"
                  icon={ClockIcon}
                />
              </div>
            </section>

            {/* Gráficas principales */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold mb-4 text-foreground/90">Visualizaciones del progreso</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ScoreGauge score={completionRate} />
                <RadarDimensions />
                <TimelineChart />
              </div>
            </section>

            {/* Tabla de entregas */}
            <section className="mb-16">
              <h2 className="text-xl font-semibold mb-4 text-foreground/90">Entregas recientes</h2>

              {/* 🚀 PASAMOS handleOpenDetail */}
              <SubmissionsTable onOpenDetail={handleOpenDetail} />
            </section>

            {/* Comparativas y resumen */}
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-foreground/90">
                Comparativas (Mockup)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonChart />
                <SummaryCard />
              </div>
            </section>

          </motion.div>
        </div>
      </main>

      {/* 👉 Modal con assignmentId */}
      {selectedAssignmentId && (
        <AdminSubmissionDetailModal
          submissionId={selectedAssignmentId}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
        />
      )}
    </div>
  );
}
