import DashboardSidebar from './DashboardSidebar';

import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;