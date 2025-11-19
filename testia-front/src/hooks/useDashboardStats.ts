import { useEffect, useState } from "react";
import api from "@/lib/api";

interface DashboardStats {
  total: number;
  sent: number;
  submitted: number;
  completionRate: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/v1/dashboard/stats");
      setStats(res.data);
    } catch (e) {
      console.error("Error loading dashboard stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, reload: loadStats };
}
