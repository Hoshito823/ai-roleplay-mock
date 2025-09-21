import { KPICards } from "@/components/dashboard/KPICards";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { SessionHistory } from "@/components/dashboard/SessionHistory";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>

      {/* KPI Cards */}
      <KPICards />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts />
      </div>

      {/* Session History */}
      <SessionHistory />
    </div>
  );
}