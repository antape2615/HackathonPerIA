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

export default function CreateTestPage() {
  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
          <p className="text-gray-600 mt-1">Configure your technical assessment</p>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Test Creator (Multi-Step Form)</Card.Title>
            <Card.Description>
              This feature will include a multi-step form for creating tests with configuration, questions, and preview steps.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <p className="text-gray-600">
              Implementation in progress... This will include language selection, framework, difficulty, duration, and question management.
            </p>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}
