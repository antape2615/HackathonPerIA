import {LayoutDashboard, FileText, Trophy} from 'lucide-react';
import MainLayout from '@/shared/components/layout/MainLayout';
import {ROUTES} from '@/shared/utils/constants';
import {SidebarItem} from '@/shared/components/layout/Sidebar';
import {TestsList} from "@/features/candidate/components/TestsList.tsx";

const sidebarItems: SidebarItem[] = [
    {label: 'Dashboard', href: ROUTES.CANDIDATE_DASHBOARD, icon: LayoutDashboard},
    {label: 'Available Tests', href: ROUTES.AVAILABLE_TESTS, icon: FileText},
    {label: 'My Results', href: ROUTES.MY_RESULTS, icon: Trophy},
];

export default function AvailableTestsPage() {
    return (
        <MainLayout sidebarItems={sidebarItems}>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Available Tests</h1>
                    <p className="text-gray-600 mt-1">Choose a test to start your assessment</p>
                </div>

                <TestsList/>
            </div>
        </MainLayout>
    );
}
