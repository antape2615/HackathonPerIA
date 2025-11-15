import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, Play } from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import Card from '@/shared/components/ui/Card/Card';
import Button from '@/shared/components/ui/Button/Button';
import { ROUTES } from '@/shared/utils/constants';
import { SidebarItem } from '@/shared/components/layout/Sidebar';

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: ROUTES.CANDIDATE_DASHBOARD, icon: LayoutDashboard },
  { label: 'Available Tests', href: ROUTES.AVAILABLE_TESTS, icon: FileText },
  { label: 'My Results', href: ROUTES.MY_RESULTS, icon: Trophy },
];

export default function CandidateDashboard() {
  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-1">Take technical assessments and track your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Tests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <Trophy className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0%</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <Trophy className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to={ROUTES.AVAILABLE_TESTS}>
                <Button variant="outline" fullWidth>
                  <Play className="h-4 w-4 mr-2" />
                  Browse Available Tests
                </Button>
              </Link>
              <Link to={ROUTES.MY_RESULTS}>
                <Button variant="outline" fullWidth>
                  <Trophy className="h-4 w-4 mr-2" />
                  View My Results
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}
