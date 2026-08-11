import PageContainer from '../../../shared/components/ui/PageContainer';
import StatCard from '../../../shared/components/ui/StatCard';
import ActivityFeed from '../../../shared/components/ui/ActivityFeed';
import ProjectSummary from '../../../shared/components/ui/ProjectSummary';
import MachinerySummary from '../../../shared/components/ui/MachinerySummary';
import QuotationSummary from '../../../shared/components/ui/QuotationSummary';
import useAuth from '../../../shared/hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();

  return (
    <PageContainer title={`Welcome${user?.name ? `, ${user.name}` : ''}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard>Active Projects</StatCard>
        <StatCard>Open Service Requests</StatCard>
        <StatCard>Pending Quotations</StatCard>
        <StatCard>Machinery in Use</StatCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ProjectSummary />
        <MachinerySummary />
        <QuotationSummary />
      </div>

      <div className="mt-6">
        <ActivityFeed />
      </div>
    </PageContainer>
  );
}

export default Dashboard;
