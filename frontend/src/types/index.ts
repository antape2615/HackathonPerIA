export interface PainPoint {
  title: string;
  priority: 'Alta' | 'Media' | 'Baja';
  impact: string;
  category: string;
}

export interface Solution {
  title: string;
  cost: string;
  roi: string;
  duration: string;
}

export interface SolutionsByTimeline {
  shortTerm: Solution[];
  mediumTerm: Solution[];
  longTerm: Solution[];
}

export interface Analytics {
  averageROI: number;
  timeSaved: number;
  efficiency: {
    current: number;
    projected: number;
    improvement: number;
  };
}

export interface Recommendation {
  title: string;
  category: 'Estratégica' | 'Operativa' | 'Tecnológica';
}

export interface Assessment {
  id: string;
  title: string;
  status: string;
  responses: any;
  painPoints: PainPoint[];
  solutions: SolutionsByTimeline;
  analytics: Analytics;
  recommendations: Recommendation[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  assessment: Assessment;
}
