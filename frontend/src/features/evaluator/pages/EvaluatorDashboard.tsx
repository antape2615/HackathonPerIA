import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart3, Plus } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import Button from '@/shared/components/ui/Button/Button';
import Loading from '@/shared/components/feedback/Loading';
import { useEvaluatorStore } from '../store/evaluatorStore';
import { ROUTES } from '@/shared/utils/constants';
import { SidebarItem } from '@/shared/components/layout/Sidebar';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: ROUTES.EVALUATOR_DASHBOARD, icon: LayoutDashboard },
  { label: 'My Tests', href: ROUTES.TEST_LIST, icon: FileText },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
];

export default function EvaluatorDashboard() {
  const { stats, isLoading, fetchStats } = useEvaluatorStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <MainLayout sidebarItems={sidebarItems}>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluator Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your technical assessments</p>
          </div>
          <Link to={ROUTES.CREATE_TEST}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalTests || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.publishedTests || 0}
                </p>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <FileText className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalCandidates || 0}
                </p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <Users className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.averageScore?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            <Card.Description>Common tasks and shortcuts</Card.Description>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to={ROUTES.CREATE_TEST}>
                <Button variant="outline" fullWidth>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Test
                </Button>
              </Link>
              <Link to={ROUTES.TEST_LIST}>
                <Button variant="outline" fullWidth>
                  <FileText className="h-4 w-4 mr-2" />
                  View All Tests
                </Button>
              </Link>
              <Link to={ROUTES.ANALYTICS}>
                <Button variant="outline" fullWidth>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}
