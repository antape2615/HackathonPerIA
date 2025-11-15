import { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar, { SidebarItem } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  sidebarItems?: SidebarItem[];
}

export default function MainLayout({ children, sidebarItems }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={sidebarItems ? toggleSidebar : undefined} />

      <div className="flex">
        {sidebarItems && (
          <Sidebar
            items={sidebarItems}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
