import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Plus } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import Button from '@/shared/components/ui/Button/Button';
import Badge from '@/shared/components/ui/Badge/Badge';
import Loading from '@/shared/components/feedback/Loading';
import EmptyState from '@/shared/components/feedback/EmptyState';
import { useEvaluatorStore } from '../store/evaluatorStore';
import { ROUTES } from '@/shared/utils/constants';
import { SidebarItem } from '@/shared/components/layout/Sidebar';
import { formatDate } from '@/shared/utils/format';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: ROUTES.EVALUATOR_DASHBOARD, icon: LayoutDashboard },
  { label: 'My Tests', href: ROUTES.TEST_LIST, icon: FileText },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
];

export default function TestListPage() {
  const { tests, isLoading, fetchTests } = useEvaluatorStore();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tests</h1>
            <p className="text-gray-600 mt-1">Manage your technical assessments</p>
          </div>
          <Link to={ROUTES.CREATE_TEST}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </Link>
        </div>

        {tests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No tests yet"
            description="Create your first test to start evaluating candidates"
            action={{
              label: 'Create Test',
              onClick: () => window.location.href = ROUTES.CREATE_TEST,
            }}
          />
        ) : (
          <div className="grid gap-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <Badge variant={test.status === 'published' ? 'success' : 'default'}>
                        {test.status}
                      </Badge>
                      <Badge variant="primary">{test.language}</Badge>
                      <Badge>{test.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{test.questions.length} questions</span>
                      <span>•</span>
                      <span>{test.duration} minutes</span>
                      <span>•</span>
                      <span>Created {formatDate(test.createdAt, 'PPP')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
