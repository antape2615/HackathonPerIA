'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { dashboardAPI } from '@/services/api'

export function useDashboardData(assessmentId: string) {
  return useQuery({
    queryKey: ['dashboard', assessmentId],
    queryFn: () => dashboardAPI.getData(assessmentId).then(res => res.data.data),
    enabled: !!assessmentId,
  })
}
