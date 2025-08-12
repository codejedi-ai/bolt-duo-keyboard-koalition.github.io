import DashboardSidebar from '../../components/DashboardSidebar';
import Header from '../../components/Header';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

function ProtectedLayout({ children }: ProtectedLayoutProps): JSX.Element {
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

export default ProtectedLayout;