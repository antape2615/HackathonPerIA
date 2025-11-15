import { LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import { SidebarItem } from '@/shared/components/layout/Sidebar';
import { ROUTES } from '@/shared/utils/constants';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: ROUTES.EVALUATOR_DASHBOARD, icon: LayoutDashboard },
  { label: 'My Tests', href: ROUTES.TEST_LIST, icon: FileText },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
];

export default function AnalyticsDashboard() {
  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track performance metrics and insights</p>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Analytics & Charts (Recharts)</Card.Title>
            <Card.Description>
              This will include interactive charts showing language distribution, performance trends, and pass rates.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600">
              Implementation in progress... This will include multiple chart types, filters, and detailed metrics.
            </p>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}
